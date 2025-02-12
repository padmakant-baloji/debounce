import { useState, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  eventCount: number;
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<{
    problem: PerformanceMetrics;
    solution: PerformanceMetrics;
  }>({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });

  // Keep track of baseline memory usage
  const baselineMemory = useRef<number | null>(null);
  const memoryReadings = useRef<{ problem: number[]; solution: number[] }>({
    problem: [],
    solution: [],
  });

  // Initialize baseline memory
  const initializeBaseline = useCallback(async () => {
    if (window.gc) {
      await window.gc();
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    baselineMemory.current = performance.memory?.usedJSHeapSize || 0;
  }, []);

  const measure = useCallback(async (
    fn: () => Promise<void> | void,
    type: 'problem' | 'solution'
  ) => {
    // Initialize baseline if not set
    if (baselineMemory.current === null) {
      await initializeBaseline();
    }

    // Initial measurements
    const startTime = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;

    try {
      // Run the function
      await fn();
    } finally {
      // Ensure some time for memory to settle
      await new Promise(resolve => setTimeout(resolve, 50));

      // Final measurements
      const endTime = performance.now();
      const endMemory = performance.memory?.usedJSHeapSize || 0;

      // Calculate memory delta relative to baseline
      const memoryDelta = Math.max(0, (endMemory - (baselineMemory.current || 0)) / (1024 * 1024));
      
      // Store memory reading
      memoryReadings.current[type].push(memoryDelta);
      
      // Keep only last 10 readings
      if (memoryReadings.current[type].length > 10) {
        memoryReadings.current[type].shift();
      }

      // Calculate average memory usage from readings
      const avgMemory = memoryReadings.current[type].reduce((a, b) => a + b, 0) / 
                       memoryReadings.current[type].length;

      setMetrics(prev => ({
        ...prev,
        [type]: {
          executionTime: endTime - startTime,
          memoryUsage: avgMemory,
          eventCount: prev[type].eventCount + 1,
        },
      }));
    }
  }, []);

  const reset = useCallback(async () => {
    // Reset baseline memory
    await initializeBaseline();
    
    // Clear memory readings
    memoryReadings.current = {
      problem: [],
      solution: [],
    };
    
    setMetrics({
      problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
      solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    });
  }, []);

  return {
    metrics,
    measure,
    reset,
  };
}