import { useEffect, useState } from "react";
const API_BASE = "http://localhost:3003/api/v1";

export function useAlert(userId: string) {
  console.log("RUNNING");

  const [eventData, setEventData] = useState<string[]>([]);
  useEffect(() => {
    if (!userId) return;
    console.log("RUNNING", userId);

    const eventSource = new EventSource(`${API_BASE}/alert/${userId}`);
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
  }, [userId]);
  return eventData;
}
