import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API;

export function useAlert() {
  const [eventData, setEventData] = useState<string[]>([]);
  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/alert`);
    eventSource.addEventListener("message", (event) => {
      setEventData((prev) => [...prev, event.data]);
    });

    eventSource.onerror = (err) => {
      console.log(err);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);
  return eventData;
}
