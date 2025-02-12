import { useState, useCallback } from 'react';
import { DemoStats } from '../types';

export function useStats(initialStats?: Partial<DemoStats>) {
  const [stats, setStats] = useState<DemoStats>({
    problem: {
      executionTime: 0,
      memoryUsage: 0,
      eventCount: 0,
    },
    solution: {
      executionTime: 0,
      memoryUsage: 0,
      eventCount: 0,
    },
    ...initialStats,
  });

  const measurePerformance = useCallback(async (
    fn: () => Promise<void> | void,
    type: 'problem' | 'solution'
  ) => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;

    try {
      await fn();
    } finally {
      const endTime = performance.now();
      const memoryEnd = performance.memory?.usedJSHeapSize || 0;

      setStats(prev => ({
        ...prev,
        [type]: {
          executionTime: endTime - startTime,
          memoryUsage: (memoryEnd - memoryStart) / (1024 * 1024),
          eventCount: prev[type].eventCount + 1,
        },
      }));
    }
  }, []);

  const resetStats = useCallback(() => {
    setStats({
      problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
      solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    });
  }, []);

  return {
    stats,
    measurePerformance,
    resetStats,
  };
}