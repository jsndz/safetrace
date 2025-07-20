import React from "react";
import { Satellite } from "lucide-react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <Satellite className="text-sky-400 animate-pulse" size={48} />
          <div className="absolute inset-0 animate-spin">
            <div className="w-16 h-16 border-2 border-sky-400/20 border-t-sky-400 rounded-full"></div>
          </div>
        </div>
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  );
};
