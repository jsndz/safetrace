import React from 'react';
import { Satellite, MapPin, Clock, Target } from 'lucide-react';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { GlassCard } from '../components/GlassCard';
import { StatusIndicator } from '../components/StatusIndicator';
import { formatCoordinate, formatAccuracy, formatTimeAgo } from '../utils/formatting';

export const HomePage: React.FC = () => {
  const {
    isTracking,
    currentLocation,
    error,
    lastUpdated,
    startTracking,
    stopTracking,
  } = useLocationTracking();

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Satellite className="text-sky-400" size={32} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-sky-400 bg-clip-text text-transparent">
              Location Tracker
            </h1>
          </div>
          <p className="text-slate-400 text-sm">Real-time position monitoring</p>
        </div>

        {/* Main Control Card */}
        <GlassCard>
          <div className="text-center space-y-6">
            {/* Status */}
            <div className="flex justify-center">
              <StatusIndicator
                isActive={isTracking}
                label={isTracking ? 'Tracking Active' : 'Tracking Inactive'}
                size="lg"
              />
            </div>

            {/* Control Button */}
            <button
              onClick={isTracking ? stopTracking : startTracking}
              className={`
                w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
                ${isTracking
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25'
                }
                transform hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </button>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Location Information */}
        {currentLocation && (
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <MapPin size={18} />
                <span>Last Known Location</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Latitude</p>
                  <p className="font-mono text-white">
                    {formatCoordinate(currentLocation.latitude)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Longitude</p>
                  <p className="font-mono text-white">
                    {formatCoordinate(currentLocation.longitude)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock size={14} />
                  <span>{lastUpdated ? formatTimeAgo(lastUpdated) : 'Never'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Target size={14} />
                  <span>{formatAccuracy(currentLocation.accuracy)}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Quick Stats */}
        {!currentLocation && !isTracking && (
          <GlassCard className="text-center">
            <div className="space-y-3">
              <MapPin className="mx-auto text-slate-400" size={48} />
              <div>
                <h3 className="text-lg font-semibold text-slate-300">No Location Data</h3>
                <p className="text-slate-400 text-sm">Start tracking to begin monitoring your location</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};