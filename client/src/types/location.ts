export interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
  address?: string;
}

export interface TrackingState {
  isTracking: boolean;
  currentLocation: LocationData | null;
  locationHistory: LocationData[];
  error: string | null;
  lastUpdated: number | null;
}

export interface AppSettings {
  darkMode: boolean;
  autoStopMinutes: number;
  exportFormat: 'json' | 'csv';
}