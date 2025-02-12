import React, { useState, useEffect } from 'react';
import { useThrottle } from '../hooks/useThrottle';
import { StatsCard } from '../components/StatsCard';
import { ScenarioInfo } from '../components/ScenarioInfo';
import { DEMO_INFO } from '../data/demoInfo';
import { Activity, ArrowDown, Clock } from 'lucide-react';

type ThrottlePhase = 'initial' | 'throttled' | 'final' | null;
type LogEntry = {
  message: string;
  type: 'regular' | 'initial' | 'throttled' | 'final';
  timestamp: string;
};

export default function LeadingTrailingThrottle() {
  // User Activity Monitor
  const [lastActivity, setLastActivity] = useState<string>('No activity');
  const [regularLogs, setRegularLogs] = useState<LogEntry[]>([]);
  const [throttledLogs, setThrottledLogs] = useState<LogEntry[]>([]);
  const [activityStats, setActivityStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });
  const [isMonitoring, setIsMonitoring] = useState({ regular: false, throttled: false });
  const [throttlePhase, setThrottlePhase] = useState<ThrottlePhase>(null);

  const handleRegularActivity = () => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    const timestamp = new Date().toLocaleTimeString();
    setLastActivity(`Active at ${timestamp}`);
    setIsMonitoring(prev => ({ ...prev, regular: true }));
    
    // Add regular log entry
    setRegularLogs(prev => [
      ...prev.slice(-4),
      { message: '🔄 Regular update', type: 'regular', timestamp }
    ]);
    
    const endTime = performance.now();
    setActivityStats(prev => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));

    setTimeout(() => {
      setIsMonitoring(prev => ({ ...prev, regular: false }));
    }, 300);
  };

  const handleThrottledActivity = useThrottle(() => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    const timestamp = new Date().toLocaleTimeString();
    const eventCount = activityStats.solution.eventCount;
    
    let type: 'initial' | 'throttled' | 'final';
    let message: string;
    
    if (eventCount === 0 || throttlePhase === 'final') {
      type = 'initial';
      message = '🟢 Initial update';
      setThrottlePhase('initial');
    } else {
      type = 'throttled';
      message = '🟡 Throttled update';
      setThrottlePhase('throttled');
    }
    
    setThrottledLogs(prev => [...prev.slice(-4), { message, type, timestamp }]);
    setIsMonitoring(prev => ({ ...prev, throttled: true }));
    
    const endTime = performance.now();
    setActivityStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.solution.eventCount + 1,
      },
    }));

    setTimeout(() => {
      setThrottlePhase(null);
      setIsMonitoring(prev => ({ ...prev, throttled: false }));
    }, 300);
  }, 3000, {
    leading: true,
    trailing: true,
    onTrailing: () => {
      const timestamp = new Date().toLocaleTimeString();
      setThrottledLogs(prev => {
        const withoutFinal = prev.filter(log => log.type !== 'final');
        return [
          ...withoutFinal.slice(-4),
          { message: '🔵 Final update', type: 'final', timestamp }
        ];
      });
      setThrottlePhase('final');
      setTimeout(() => setThrottlePhase(null), 300);
    }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Leading-Trailing Throttle Examples</h1>
      
      {/* User Activity Monitor */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User Activity Monitor</h2>
        <ScenarioInfo info={DEMO_INFO.leadingTrailingThrottle.scenarios.activity} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Regular Monitor */}
              <div
                className="bg-white rounded-lg shadow-md p-6 relative"
                onMouseMove={handleRegularActivity}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity className={`w-4 h-4 ${isMonitoring.regular ? 'text-indigo-600 animate-pulse' : 'text-gray-400'}`} />
                  <h3 className="font-medium">Regular Monitor</h3>
                </div>
                <div className="space-y-2">
                  {regularLogs.map((log, index) => (
                    <p
                      key={index}
                      className="text-sm text-indigo-600"
                    >
                      {log.message} at {log.timestamp}
                    </p>
                  ))}
                </div>
                {isMonitoring.regular && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-100">
                    <div className="h-full bg-indigo-500 animate-[progress_0.3s_linear]" />
                  </div>
                )}
              </div>

              {/* Throttled Monitor */}
              <div
                className="bg-white rounded-lg shadow-md p-6 relative"
                onMouseMove={handleThrottledActivity}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity className={`w-4 h-4 ${isMonitoring.throttled ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
                  <h3 className="font-medium">Throttled Monitor</h3>
                </div>
                <div className="space-y-2">
                  {throttledLogs.map((log, index) => (
                    <p
                      key={index}
                      className={`text-sm ${
                        log.type === 'initial' ? 'text-green-600' :
                        log.type === 'throttled' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}
                    >
                      {log.message} at {log.timestamp}
                    </p>
                  ))}
                </div>
                {isMonitoring.throttled && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-100">
                    <div className="h-full bg-green-500 animate-[progress_0.3s_linear]" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Regular: Updates and logs on every mouse movement (🔄)</li>
                <li>Throttled: First movement triggers initial update (🟢)</li>
                <li>Throttled: Subsequent movements trigger throttled updates (🟡)</li>
                <li>Throttled: After 3s of no movement, triggers final update (🔵)</li>
              </ul>
            </div>
          </div>
          <StatsCard title="Activity Monitor Performance" stats={activityStats} />
        </div>
      </section>
    </div>
  );
}