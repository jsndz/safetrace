import React from "react";
import { Settings, ChevronRight, ChevronLeft } from "lucide-react";
import { Extension } from "../types/extensions";
import { ExtensionToggle } from "./ExtensionToggle";
import { GlassCard } from "./GlassCard";

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
        className={`fixed top-4 left-4 z-50 p-3  backdrop-blur-lg
     
    border border-slate-700/50 rounded-xl text-sky-400 
    hover:bg-slate-700/50`}
        onClick={onToggleSidebar}
      >
        <Settings size={20} />
      </button>

      {/* Sidebar Overlay */}

      {isOpen && (
        <div
          onClick={onToggleSidebar}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar  */}
      {isOpen && (
        <aside className="bg-black fixed top-0 w-80 left-0 h-full  border-r border-slate-700/50  transform transition-transform duration-300 z-50">
          <div className=" flex flex-col   h-full items-stretch  ">
            {/* Header */}
            <div className="flex justify-between p-2">
              <div className="">
                <h1 className="font-bold ">Extensions</h1>
              </div>
              <button onClick={onToggleSidebar}>
                <ChevronLeft size={20} />
              </button>
            </div>

            {/* Extensions List */}
            <div className="flex-1 overflow-y-auto ">
              {" "}
              {extensions.map((extension) => (
                <div key={extension.id} className=" space-y-11">
                  <GlassCard>
                    <ExtensionToggle
                      extension={extension}
                      onToggle={() => onToggleExtension(extension.id)}
                      onConfigure={() => onConfigureExtension(extension)}
                    />
                  </GlassCard>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-auto p-4 border-t border-white/10">
              <p className="text-xs text-slate-500 text-center">
                {extensions.filter((ext) => ext.enabled).length} of{" "}
                {extensions.length} extensions enabled
              </p>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
