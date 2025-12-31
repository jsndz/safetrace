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
      <div>
        <div>
          {/* Header */}
          <div>
            <div>
              <Satellite size={32} />
              <h1>Location Tracker</h1>
            </div>
            <p>Real-time position monitoring</p>
          </div>

          {/* Main Control Card */}
          <GlassCard>
            <div>
              {/* Status */}
              <div>
                <StatusIndicator
                  isActive={isTracking}
                  label={isTracking ? "Tracking Active" : "Tracking Inactive"}
                  size="lg"
                />
              </div>

              {/* Control Button */}
              <button onClick={isTracking ? stopTracking : startTracking}>
                {isTracking ? "Stop Tracking" : "Start Tracking"}
              </button>

              {/* Error Display */}
              {error && (
                <div>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Location Information */}
          {currentLocation && (
            <GlassCard>
              <div>
                <div>
                  <MapPin size={18} />
                  <span>Last Known Location</span>
                </div>

                <div>
                  <div>
                    <p>Latitude</p>
                    <p>{formatCoordinate(currentLocation.latitude)}</p>
                  </div>
                  <div>
                    <p>Longitude</p>
                    <p>{formatCoordinate(currentLocation.longitude)}</p>
                  </div>
                </div>

                <div>
                  <div>
                    <Clock size={14} />
                    <span>
                      {lastUpdated ? formatTimeAgo(lastUpdated) : "Never"}
                    </span>
                  </div>
                  <div>
                    <Target size={14} />
                    <span>{formatAccuracy(currentLocation.accuracy)}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Empty State */}
          {!currentLocation && !isTracking && (
            <GlassCard>
              <div>
                <MapPin size={48} />
                <div>
                  <h3>No Location Data</h3>
                  <p>Start tracking to begin monitoring your location</p>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Extension Configuration Modal */}
      <ExtensionConfigModal
        extension={activeConfigExtension}
        onSave={saveExtensionConfig}
        onClose={closeConfigModal}
      />
    </div>
  );
};
