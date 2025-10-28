import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_CLIENT_API;

export function useAlert(userId: string) {
  const [eventData, setEventData] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    console.log(`[SSE] Connecting to: ${API_BASE}/alert/${userId}`);
    const eventSource = new EventSource(`${API_BASE}/alert/${userId}`);

    eventSource.addEventListener("message", (event) => {
      console.log("[SSE] Message received:", event.data);
      setEventData((prev) => [...prev, event.data]);
    });

    eventSource.addEventListener("open", () => {
      console.log("[SSE] Connection opened ✅");
    });

    eventSource.addEventListener("error", (err) => {
      console.error("[SSE] Error:", err);
      eventSource.close();
    });

    return () => {
      console.log("[SSE] Connection closed ❌");
      eventSource.close();
    };
  }, [userId]);

  return eventData;
}
