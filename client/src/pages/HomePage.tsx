import React, { useState } from "react";
import { Satellite, MapPin, Clock, Target } from "lucide-react";
import { useLocationTracking } from "../hooks/useLocationTracking";
import { useExtensions } from "../hooks/useExtensions";
import { GlassCard } from "../components/GlassCard";
import { StatusIndicator } from "../components/StatusIndicator";
import { ExtensionSidebar } from "../components/ExtensionSidebar";
import { ExtensionConfigModal } from "../components/ExtensionConfigModal";
import {
  formatCoordinate,
  formatAccuracy,
  formatTimeAgo,
} from "../utils/formatting";

export const HomePage: React.FC = () => {
  const {
    extensions,
    activeConfigExtension,
    toggleExtension,
    openConfigModal,
    closeConfigModal,
    saveExtensionConfig,
  } = useExtensions();

  const enabledExtensions = extensions
    .filter((ext) => ext.enabled)
    .map((ex) => ex.id);

  const {
    isTracking,
    currentLocation,
    error,
    lastUpdated,
    startTracking,
    stopTracking,
  } = useLocationTracking(enabledExtensions);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      {/* Extensions Sidebar */}
      <ExtensionSidebar
        extensions={extensions}
        onToggleExtension={toggleExtension}
        onConfigureExtension={openConfigModal}
        isOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="bg-black flex justify-center items-start  min-h-screen ">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3 p-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Safetrace
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-md">
              Real-time position monitoring
            </p>
          </div>


          {/* Main Control Card */}
          <GlassCard>
            <div className="text-center space-y-3 ">
              {/* Status */}
              <div className="flex justify-center">
                <StatusIndicator
                  isActive={isTracking}
                  label={isTracking ? "Tracking Active" : "Tracking Inactive"}
                  size="lg"
                />
              </div>

              {/* Control Button */}
              <button
                onClick={isTracking ? stopTracking : startTracking}
                className={`
                py-4 px-6  rounded-xl font-semibold text-sm transition-all duration-200
                ${
                  isTracking
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
                    : "bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25"
                }
                transform hover:scale-[1.02] active:scale-[0.98]
              `}
              >
                {isTracking ? "Stop Tracking" : "Start Tracking"}
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
                    <span>
                      {lastUpdated ? formatTimeAgo(lastUpdated) : "Never"}
                    </span>
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
                  <h3 className="text-lg font-semibold text-slate-300">
                    No Location Data
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Start tracking to begin monitoring your location
                  </p>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </main>

      {/* Extension Configuration Modal */}
      <ExtensionConfigModal
        extension={activeConfigExtension}
        onSave={saveExtensionConfig}
        onClose={closeConfigModal}
      />
    </div>
  );
};
