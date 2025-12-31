import React from "react";
import { Settings, ChevronRight, ChevronLeft } from "lucide-react";
import { Extension } from "../types/extensions";
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
      <button className="fixed top-4 left-4 " onClick={onToggleSidebar}>
        <Settings size={20} />
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div onClick={onToggleSidebar} />
      )}

      {/* Sidebar  */}
      {isOpen && (
        <aside className="bg-black fixed top-0 w-80 left-0 h-full  z-50" >
          <div className=" flex flex-col items-center space-y-8 mt-auto">
            {/* Header */}
            <div className="flex justify-between items-center " >
              <div className="">
                <h2>Extensions</h2>
                <p>Enhance your tracking experience</p>
              </div>
              <button onClick={onToggleSidebar}>
                <ChevronLeft size={20} />
              </button>
            </div>

            {/* Extensions List */}
            <div>
              {extensions.map((extension) => (
                <div key={extension.id} className="flex flex-col justify-between space-y-11">
                  <ExtensionToggle
                    extension={extension}
                    onToggle={() => onToggleExtension(extension.id)}
                    onConfigure={() => onConfigureExtension(extension)}
                  />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 ">
              <p>
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
