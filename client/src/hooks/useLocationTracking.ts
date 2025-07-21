import { useState, useEffect, useCallback, useRef } from "react";
import { LocationData, TrackingState } from "../types/location";
import { storageService } from "../utils/storage";
import { sendLocation } from "../services/location";

export const useLocationTracking = () => {
  const [state, setState] = useState<TrackingState>({
    isTracking: false,
    currentLocation: null,
    locationHistory: [],
    error: null,
    lastUpdated: null,
  });

  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const storedHistory = storageService.getLocationHistory();
    const lastLocation = storedHistory[storedHistory.length - 1] || null;

    setState((prev) => ({
      ...prev,
      locationHistory: storedHistory,
      currentLocation: lastLocation,
      lastUpdated: lastLocation?.timestamp || null,
    }));
  }, []);

  const addLocationToHistory = useCallback((location: LocationData) => {
    setState((prev) => {
      const newHistory = [...prev.locationHistory, location];
      storageService.saveLocationHistory(newHistory);
      return {
        ...prev,
        currentLocation: location,
        locationHistory: newHistory,
        lastUpdated: location.timestamp,
        error: null,
      };
    });
  }, []);

  const handleLocationSuccess = useCallback(
    (position: GeolocationPosition) => {
      const locationData: LocationData = {
        id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now(),
      };
      addLocationToHistory(locationData);
      sendLocation(locationData);
    },
    [addLocationToHistory]
  );

  const handleLocationError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = "Unknown location error";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage =
          "Location access denied. Please enable location permissions.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information unavailable.";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out.";
        break;
    }

    setState((prev) => ({
      ...prev,
      error: errorMessage,
      isTracking: false,
    }));

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isTracking: true, error: null }));

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      options
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleLocationSuccess,
      handleLocationError,
      options
    );
  }, [handleLocationSuccess, handleLocationError]);

  const stopTracking = useCallback(() => {
    setState((prev) => ({ ...prev, isTracking: false }));

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const clearHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      locationHistory: [],
      currentLocation: null,
      lastUpdated: null,
    }));
    storageService.clearLocationHistory();
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startTracking,
    stopTracking,
    clearHistory,
  };
};
