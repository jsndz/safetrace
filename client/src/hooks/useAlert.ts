import { useEffect, useState } from "react";

export function useAlert(url: string) {
  const [eventData, setEventData] = useState<string[]>([]);
  useEffect(() => {
    const eventSource = new EventSource(url);
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
