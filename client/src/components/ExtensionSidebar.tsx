import React from "react";
import { Settings, ChevronRight } from "lucide-react";
import { Extension } from "../types/extensions";
import { GlassCard } from "./GlassCard";
import { ExtensionToggle } from "./ExtensionToggle";

interface ExtensionSidebarProps {
  extensions: Extension[];
  onToggleExtension: (extensionId: string) => void;
  onConfigureExtension: (extension: Extension) => void;
  isOpen: boolean;
  onToggleSidebar: () => void;
}

export const ExtensionSidebar: React.FC<ExtensionSidebarProps> = ({
  extensions,
  onToggleExtension,
  onConfigureExtension,
  isOpen,
  onToggleSidebar,
}) => {
  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggleSidebar}
        className={`
    fixed top-4 left-4 z-50 p-3 bg-slate-800/90 backdrop-blur-sm 
    border border-slate-700/50 rounded-xl text-sky-400 
    hover:bg-slate-700/50 transition-all duration-200
    ${isOpen ? "translate-x-80" : "translate-x-0"}
    lg:hidden
  `}
      >
        <Settings size={20} />
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
                ${isOpen ? "fixed" : "fixed"} top-0 left-0
                h-full w-80 bg-slate-900/95 backdrop-blur-md 
                border-r border-slate-700/50 z-40 transform transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                lg:static lg:translate-x-0 lg:w-80 lg:h-auto lg:z-auto lg:transform-none
          `}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Extensions</h2>
              <p className="text-sm text-slate-400">
                Enhance your tracking experience
              </p>
            </div>
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Extensions List */}
          <div className="space-y-4">
            {extensions.map((extension) => (
              <GlassCard key={extension.id} padding="sm">
                <ExtensionToggle
                  extension={extension}
                  onToggle={() => onToggleExtension(extension.id)}
                  onConfigure={() => onConfigureExtension(extension)}
                />
              </GlassCard>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 text-center">
              {extensions.filter((ext) => ext.enabled).length} of{" "}
              {extensions.length} extensions enabled
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
