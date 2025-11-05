import { useEffect, useRef } from 'react';

export const usePolling = (callback: () => void, interval: number = 5000) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    // Initial call
    tick();

    // Set up interval
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval]);
};
