import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, History, Map, Settings, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Navigation: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/history", icon: History, label: "History" },
    { to: "/map", icon: Map, label: "Map" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-t border-slate-700/50">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-sky-400 bg-sky-400/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`
            }
          >
            <Icon size={20} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </NavLink>
        ))}

        {/* User Info & Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
          title={`Logout ${user?.name || "User"}`}
        >
          <LogOut size={20} />
          <span className="text-xs mt-1 font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};
