import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAlert } from "../hooks/useAlert";

type Notification = {
  id: number;
  message: string;
  timestamp: string;
};

export function Notification() {
  const rawMessages = useAlert();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    rawMessages.forEach((msg) => {
      const id = Date.now() + Math.random();
      const newNotification: Notification = {
        id,
        message: msg,
        timestamp: new Date().toLocaleTimeString(),
      };

      setNotifications((prev) => [...prev.slice(-4), newNotification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    });
  }, [rawMessages]);

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="relative rounded-xl bg-white shadow-lg border-l-4 border-blue-500 p-4 flex items-start space-x-2"
        >
          <div className="flex-1">
            <p className="text-sm text-gray-800">{n.message}</p>
            <p className="text-xs text-gray-400">{n.timestamp}</p>
          </div>
          <button
            onClick={() => dismiss(n.id)}
            className="ml-2 text-gray-400 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
