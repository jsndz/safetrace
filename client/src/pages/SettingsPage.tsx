import React, { useState, useEffect } from "react";
import {
  Settings,
  Moon,
  Clock,
  Download,
  Trash2,
  Shield,
  User,
} from "lucide-react";
import { useLocationTracking } from "../hooks/useLocationTracking";
import { useAuth } from "../hooks/useAuth";
import { GlassCard } from "../components/GlassCard";

export const SettingsPage: React.FC = () => {
  const { locationHistory, clearHistory } = useLocationTracking();
  const { user } = useAuth();
  const [autoStopMinutes, setAutoStopMinutes] = useState(60);
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("location_tracker_settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAutoStopMinutes(settings.autoStopMinutes || 60);
      setExportFormat(settings.exportFormat || "json");
      setDarkMode(settings.darkMode !== false); // Default to true
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      autoStopMinutes,
      exportFormat,
      darkMode,
    };
    localStorage.setItem("location_tracker_settings", JSON.stringify(settings));

    // You could also trigger a toast notification here
    console.log("Settings saved!");
  };

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Settings className="text-sky-400" size={32} />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Configure your tracking preferences
          </p>
        </div>

        {/* User Profile */}
        <GlassCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sky-400 font-semibold">
              <User size={18} />
              <span>Profile</span>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-white">Name</h3>
                <p className="text-slate-400">{user?.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-white">Email</h3>
                <p className="text-slate-400">{user?.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-white">Member Since</h3>
                <p className="text-slate-400">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Display Settings */}
        <GlassCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sky-400 font-semibold">
              <Moon size={18} />
              <span>Display</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Dark Mode</h3>
                <p className="text-sm text-slate-400">
                  Use dark theme interface
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
              </label>
            </div>
          </div>
        </GlassCard>

        {/* Tracking Settings */}
        <GlassCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sky-400 font-semibold">
              <Clock size={18} />
              <span>Tracking</span>
            </div>

            <div>
              <label htmlFor="autoStop" className="block">
                <h3 className="font-medium text-white mb-1">Auto-stop Timer</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Automatically stop tracking after inactivity
                </p>
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="autoStop"
                  type="range"
                  min="5"
                  max="240"
                  step="5"
                  value={autoStopMinutes}
                  onChange={(e) => setAutoStopMinutes(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-white font-medium w-16 text-right">
                  {autoStopMinutes}min
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Export Settings */}
        <GlassCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sky-400 font-semibold">
              <Download size={18} />
              <span>Export</span>
            </div>

            <div>
              <h3 className="font-medium text-white mb-3">
                Default Export Format
              </h3>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="json"
                    checked={exportFormat === "json"}
                    onChange={(e) => setExportFormat(e.target.value as "json")}
                    className="w-4 h-4 text-sky-500 bg-slate-600 border-slate-500 focus:ring-sky-500 focus:ring-2"
                  />
                  <span className="text-white">JSON</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="csv"
                    checked={exportFormat === "csv"}
                    onChange={(e) => setExportFormat(e.target.value as "csv")}
                    className="w-4 h-4 text-sky-500 bg-slate-600 border-slate-500 focus:ring-sky-500 focus:ring-2"
                  />
                  <span className="text-white">CSV</span>
                </label>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Privacy & Data */}
        <GlassCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sky-400 font-semibold">
              <Shield size={18} />
              <span>Privacy & Data</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Data Storage</h3>
                  <p className="text-sm text-slate-400">
                    {locationHistory.length} location
                    {locationHistory.length !== 1 ? "s" : ""} stored locally
                  </p>
                </div>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              </div>

              <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <p className="text-xs text-slate-400">
                  All location data is stored locally on your device and never
                  sent to external servers. You have full control over your
                  privacy and data.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          className="w-full py-4 px-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-lg rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};
