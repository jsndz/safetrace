import React from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { GlassCard } from '../components/GlassCard';
import { formatCoordinate } from '../utils/formatting';

export const MapPage: React.FC = () => {
  const { locationHistory, currentLocation } = useLocationTracking();

  // In a real implementation, you would integrate with a mapping library like Leaflet or Mapbox
  // For this demo, we'll show a placeholder with coordinate information
  
  const bounds = locationHistory.length > 0 ? {
    minLat: Math.min(...locationHistory.map(l => l.latitude)),
    maxLat: Math.max(...locationHistory.map(l => l.latitude)),
    minLng: Math.min(...locationHistory.map(l => l.longitude)),
    maxLng: Math.max(...locationHistory.map(l => l.longitude)),
  } : null;

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Map View</h1>
          <p className="text-slate-400 text-sm">
            Visualize your location history and current position
          </p>
        </div>

        {/* Map Container */}
        <GlassCard className="h-96 md:h-[500px]">
          <div className="h-full flex items-center justify-center bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-600/50">
            <div className="text-center space-y-4">
              <Navigation className="mx-auto text-slate-400" size={64} />
              <div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Interactive Map</h3>
                <p className="text-slate-400 text-sm max-w-md">
                  Map integration would display your location path, markers, and real-time position.
                  This would typically use Leaflet, Mapbox, or Google Maps API.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Map Stats */}
        {locationHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GlassCard padding="sm">
              <div className="text-center">
                <MapPin className="mx-auto text-sky-400 mb-2" size={24} />
                <h3 className="font-semibold text-white mb-1">Total Points</h3>
                <p className="text-2xl font-bold text-sky-400">{locationHistory.length}</p>
              </div>
            </GlassCard>

            {currentLocation && (
              <GlassCard padding="sm">
                <div className="text-center">
                  <Navigation className="mx-auto text-green-400 mb-2" size={24} />
                  <h3 className="font-semibold text-white mb-1">Current Position</h3>
                  <p className="text-sm text-slate-300">
                    {formatCoordinate(currentLocation.latitude, 4)}, {formatCoordinate(currentLocation.longitude, 4)}
                  </p>
                </div>
              </GlassCard>
            )}

            {bounds && (
              <GlassCard padding="sm">
                <div className="text-center">
                  <Info className="mx-auto text-purple-400 mb-2" size={24} />
                  <h3 className="font-semibold text-white mb-1">Coverage Area</h3>
                  <p className="text-sm text-slate-300">
                    {((bounds.maxLat - bounds.minLat) * 111).toFixed(1)}km × {((bounds.maxLng - bounds.minLng) * 111).toFixed(1)}km
                  </p>
                </div>
              </GlassCard>
            )}
          </div>
        )}

        {/* Map Legend */}
        {locationHistory.length > 0 && (
          <GlassCard padding="sm">
            <h3 className="font-semibold text-white mb-3">Map Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Start Point</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300">Current Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-sky-400"></div>
                <span className="text-slate-300">Travel Path</span>
              </div>
            </div>
          </GlassCard>
        )}

        {/* No Data State */}
        {locationHistory.length === 0 && (
          <GlassCard className="text-center">
            <div className="space-y-3 py-8">
              <MapPin className="mx-auto text-slate-400" size={48} />
              <div>
                <h3 className="text-lg font-semibold text-slate-300">No Location Data</h3>
                <p className="text-slate-400 text-sm">
                  Start tracking to see your path on the map
                </p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};