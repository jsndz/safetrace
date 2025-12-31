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
    <nav >
      <div className=" bg-black flex justify-between fixed bottom-0 left-0 right-0 p-4 border-t rounded-lg">
        {navItems.map(({ to, icon: Icon, label }) => (
          <button title={`${label}`}>
          <NavLink key={to} to={to}>
            <Icon size={30} />
            {/* <span>{label}</span> */}
          </NavLink>
          </button>
        ))}

        {/* User Info & Logout */}
        <button onClick={handleLogout} title={`Logout ${user?.Name || "User"}`}>
          <LogOut size={30} />
          {/* <span>Logout</span> */}
        </button>
      </div>
    </nav>
  );
};
