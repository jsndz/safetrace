import React, { useState, useMemo } from "react";
import { Search, Download, Trash2, MapPin, Clock } from "lucide-react";
import { useLocationTracking } from "../hooks/useLocationTracking";
import { GlassCard } from "../components/GlassCard";
import {
  formatCoordinate,
  formatTimestamp,
  formatTimeAgo,
  calculateDistance,
} from "../utils/formatting";
import { storageService } from "../utils/storage";

export const HistoryPage: React.FC = () => {
  const { locationHistory, clearHistory } = useLocationTracking();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredAndSortedHistory = useMemo(() => {
    let filtered = locationHistory.filter((location) => {
      const searchLower = searchTerm.toLowerCase();
      const dateStr = new Date(location.timestamp)
        .toLocaleDateString()
        .toLowerCase();
      const timeStr = new Date(location.timestamp)
        .toLocaleTimeString()
        .toLowerCase();
      const coordStr =
        `${location.latitude} ${location.longitude}`.toLowerCase();

      return (
        dateStr.includes(searchLower) ||
        timeStr.includes(searchLower) ||
        coordStr.includes(searchLower)
      );
    });

    return filtered.sort((a, b) =>
      sortOrder === "newest"
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp
    );
  }, [locationHistory, searchTerm, sortOrder]);

  const handleExport = (format: "json" | "csv") => {
    if (format === "json") {
      storageService.exportToJSON(locationHistory);
    } else {
      storageService.exportToCSV(locationHistory);
    }
  };

  const getDistanceFromPrevious = (index: number) => {
    if (index === 0) return null;
    const current = filteredAndSortedHistory[index];
    const previous = filteredAndSortedHistory[index - 1];

    return calculateDistance(
      previous.latitude,
      previous.longitude,
      current.latitude,
      current.longitude
    );
  };

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Location History</h1>
          <p className="text-slate-400 text-sm">
            {locationHistory.length} location
            {locationHistory.length !== 1 ? "s" : ""} recorded
          </p>
        </div>

        {/* Controls */}
        <GlassCard padding="sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by date, time, or coordinates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50"
              />
            </div>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleExport("json")}
              className="flex items-center gap-2 px-4 py-2 bg-black text-sky-400 border border-sky-500/30 rounded-lg hover:bg-black/30 transition-colors"
            >
              <Download size={16} />
              Export JSON
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="flex items-center gap-2 px-4 py-2 bg-black text-sky-400 border border-sky-500/30 rounded-lg hover:bg-black/30 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            {locationHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors ml-auto"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>
        </GlassCard>

        {/* History List */}
        {filteredAndSortedHistory.length > 0 ? (
          <div className="space-y-3">
            {filteredAndSortedHistory.map((location, index) => {
              const distance = getDistanceFromPrevious(index);

              return (
                <GlassCard key={location.id} padding="sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="text-sky-400" size={16} />
                        <span className="font-semibold text-white">
                          {formatCoordinate(location.latitude, 4)},{" "}
                          {formatCoordinate(location.longitude, 4)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{formatTimestamp(location.timestamp)}</span>
                        </div>
                        <div>
                          Accuracy: ±{Math.round(location.accuracy || 0)}m
                        </div>
                        {distance && (
                          <div className="text-slate-500">
                            {distance < 1000
                              ? `${Math.round(distance)}m from previous`
                              : `${(distance / 1000).toFixed(
                                  1
                                )}km from previous`}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-sm text-slate-500">
                      {formatTimeAgo(location.timestamp)}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <GlassCard className="text-center">
            <div className="space-y-3 py-8">
              <MapPin className="mx-auto text-slate-400" size={48} />
              <div>
                <h3 className="text-lg font-semibold text-slate-300">
                  No Location History
                </h3>
                <p className="text-slate-400 text-sm">
                  {searchTerm
                    ? "No locations match your search."
                    : "Start tracking to build your location history."}
                </p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
