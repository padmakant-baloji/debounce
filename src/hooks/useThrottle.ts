import { useCallback, useRef } from "react";

interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
  onTrailing?: () => void;
}

export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: ThrottleOptions = {}
) {
  const { leading = true, trailing = true, onTrailing } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const isThrottledRef = useRef(false);
  const hasTrailingExecutedRef = useRef(false); // Track trailing execution

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = lastCallTimeRef.current ? now - lastCallTimeRef.current : null;
      const shouldCallNow = leading && (!isThrottledRef.current || (timeSinceLastCall !== null && timeSinceLastCall >= wait));

      if (shouldCallNow) {
        fn(...args);
        lastCallTimeRef.current = now;
        isThrottledRef.current = true;
        hasTrailingExecutedRef.current = false; // Reset since leading call happened
      } else if (trailing) {
        lastArgsRef.current = args;
      }

      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          isThrottledRef.current = false;

          if (trailing && lastArgsRef.current) {
            fn(...lastArgsRef.current);
            lastArgsRef.current = null;

            if (onTrailing && !hasTrailingExecutedRef.current) {
              onTrailing(); // ✅ Only run if a trailing execution actually happened
              hasTrailingExecutedRef.current = true;
            }
          }
        }, wait);
      }
    },
    [fn, wait, leading, trailing, onTrailing]
  );
}
