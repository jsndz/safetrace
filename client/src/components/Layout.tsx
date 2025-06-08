import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="pb-20">
        <Outlet />
      </div>
      <Navigation />
    </div>
  );
};