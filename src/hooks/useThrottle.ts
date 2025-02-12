import { useCallback, useRef } from 'react';

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
  const lastCallRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const hasTrailingCallRef = useRef(false);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = wait - (now - lastCallRef.current);

      // Store the latest arguments for trailing call
      lastArgsRef.current = args;
      hasTrailingCallRef.current = true;

      // If we're at the beginning or past the wait period
      if (remaining <= 0 || remaining > wait) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        lastCallRef.current = now;
        if (leading || (trailing && hasTrailingCallRef.current)) {
          hasTrailingCallRef.current = false;
          fn(...args);
        }
      } 
      // Set up trailing call if needed
      else if (trailing && !timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          timeoutRef.current = null;

          if (hasTrailingCallRef.current && lastArgsRef.current) {
            fn(...lastArgsRef.current);
            if (onTrailing) {
              onTrailing();
            }
            hasTrailingCallRef.current = false;
          }
        }, remaining);
      }
    },
    [fn, wait, leading, trailing, onTrailing]
  );
}