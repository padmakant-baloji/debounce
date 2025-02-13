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
  const fnRef = useRef(fn);

  // Keep fnRef always up-to-date to avoid stale closure issues
  fnRef.current = fn;

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = lastCallTimeRef.current ? now - lastCallTimeRef.current : null;
      const shouldCallNow = leading && (!isThrottledRef.current || (timeSinceLastCall !== null && timeSinceLastCall >= wait));

      if (shouldCallNow) {
        fnRef.current(...args);
        lastCallTimeRef.current = now;
        isThrottledRef.current = true;
      } else if (trailing) {
        lastArgsRef.current = args;
      }

      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          isThrottledRef.current = false;

          if (trailing && lastArgsRef.current) {
            fnRef.current(...lastArgsRef.current);
            lastArgsRef.current = null;

            if (onTrailing) {
              onTrailing(); // ✅ Only trigger if trailing execution happened
            }
          }
        }, wait);
      }
    },
    [leading, trailing, wait, onTrailing] // ✅ fn is no longer in dependencies (avoids stale closure issues)
  );
}
