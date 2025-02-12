import { useCallback, useRef } from 'react';

interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: DebounceOptions = {}
) {
  const { leading = false, trailing = true, maxWait } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<number>(0);
  const fnRef = useRef(fn);
  const waitRef = useRef(wait);
  const leadingRef = useRef(leading);
  const maxWaitRef = useRef(maxWait);
  const trailingRef = useRef(trailing);

  // Update refs when dependencies change
  fnRef.current = fn;
  waitRef.current = wait;
  leadingRef.current = leading;
  maxWaitRef.current = maxWait;
  trailingRef.current = trailing;

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const isInvokable = lastCallRef.current === 0 && leadingRef.current;

    // Reset last call time
    if (lastCallRef.current === 0) {
      lastCallRef.current = now;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Handle leading edge
    if (isInvokable) {
      lastCallRef.current = now;
      return fnRef.current(...args);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (trailingRef.current) {
        fnRef.current(...args);
      }
      lastCallRef.current = 0;
      timeoutRef.current = null;
    }, waitRef.current);

    // Handle maxWait
    if (maxWaitRef.current && now - lastCallRef.current >= maxWaitRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      lastCallRef.current = now;
      return fnRef.current(...args);
    }
  }, []);
}