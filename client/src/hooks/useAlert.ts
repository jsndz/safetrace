import { useEffect, useState } from "react";
const API_BASE = "http://localhost:3003/api/v1";

export function useAlert(userId: string) {
  const [eventData, setEventData] = useState<string[]>([]);
  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource(`${API_BASE}/alert/${userId}`);
    eventSource.addEventListener("message", (event) => {
      setEventData((prev) => [...prev, event.data]);
    });

    eventSource.onerror = (err) => {
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, [userId]);
  return eventData;
}
