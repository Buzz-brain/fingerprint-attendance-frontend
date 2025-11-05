import { useEffect, useRef } from 'react';

export function useEventStream(onEvent) {
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const url = import.meta.env.VITE_API_BASE_URL + '/api/events/stream';
    const eventSource = new window.EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (onEvent) onEvent(event);
      } catch (err) {
        // Ignore parse errors
      }
    };

    eventSource.onerror = () => {
      // Optionally handle errors or reconnect
    };

    return () => {
      eventSource.close();
    };
  }, [onEvent]);
}
