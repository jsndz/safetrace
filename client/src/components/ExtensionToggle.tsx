import React from "react";
import { Settings, MapPin, FileText, Gauge, Battery } from "lucide-react";
import { Extension } from "../types/extensions";

interface ExtensionToggleProps {
  extension: Extension;
  onToggle: () => void;
  onConfigure: () => void;
}

const iconMap = {
  MapPin,
  FileText,
  Gauge,
  Battery,
  Settings,
};

export const ExtensionToggle: React.FC<ExtensionToggleProps> = ({
  extension,
  onToggle,
  onConfigure,
}) => {
  const IconComponent =
    iconMap[extension.icon as keyof typeof iconMap] || Settings;

  return (
    <div className="space-y-3">
      {/* Extension Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-black rounded-lg">
            <IconComponent className="text-sky-400" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm">
              {extension.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {extension.description}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer ml-3">
          <input
            type="checkbox"
            checked={extension.enabled}
            onChange={onToggle}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-black peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
        </label>
      </div>

      {/* Configuration Button */}
      {extension.requiresConfig && extension.enabled && (
        <button
          onClick={onConfigure}
          className="w-full py-2 px-3 bg-black hover:bg-slate-700 text-slate-300 hover:text-white text-sm rounded-lg transition-colors border border-slate-600/50 hover:border-slate-500"
        >
          <div className="flex items-center justify-center gap-2">
            <Settings size={14} />
            <span>Configure</span>
          </div>
        </button>
      )}

      {/* Configuration Status */}
      {extension.enabled && extension.config && (
        <div className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
          ✓ Configured
        </div>
      )}
    </div>
  );
};
