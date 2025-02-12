import React, { useState, useEffect, useRef } from 'react';
import { useThrottle } from '../hooks/useThrottle';
import { StatsCard } from '../components/StatsCard';
import { ScenarioInfo } from '../components/ScenarioInfo';
import { DEMO_INFO } from '../data/demoInfo';
import { ArrowUpDown as ArrowsUpDown, Activity, Keyboard } from 'lucide-react';

export default function TrailingThrottle() {
  // Window Resize Demo
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [resizeStats, setResizeStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });

  const handleRegularResize = () => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const endTime = performance.now();
    setResizeStats(prev => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));
  };

  const handleThrottledResize = useThrottle(() => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const endTime = performance.now();
    setResizeStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.solution.eventCount + 1,
      },
    }));
  }, 3000, { leading: false, trailing: true });

  useEffect(() => {
    window.addEventListener('resize', handleRegularResize);
    window.addEventListener('resize', handleThrottledResize);
    return () => {
      window.removeEventListener('resize', handleRegularResize);
      window.removeEventListener('resize', handleThrottledResize);
    };
  }, []);

  // User Interaction Logger
  const [regularInteractions, setRegularInteractions] = useState<string[]>([]);
  const [throttledInteractions, setThrottledInteractions] = useState<string[]>([]);
  const [interactionStats, setInteractionStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });
  const [isLogging, setIsLogging] = useState({ regular: false, throttled: false });
  const [activeArea, setActiveArea] = useState<'regular' | 'throttled' | null>(null);

  const logRegularInteraction = (type: string) => {
    if (isLogging.regular || activeArea !== 'regular') return;

    setIsLogging(prev => ({ ...prev, regular: true }));
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    const timestamp = new Date().toLocaleTimeString();
    setRegularInteractions(prev => [...prev.slice(-4), `Regular ${type} at ${timestamp}`]);
    
    const endTime = performance.now();
    setInteractionStats(prev => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));

    setTimeout(() => {
      setIsLogging(prev => ({ ...prev, regular: false }));
    }, 100);
  };

  const logThrottledInteraction = useThrottle((type: string) => {
    if (isLogging.throttled || activeArea !== 'throttled') return;

    setIsLogging(prev => ({ ...prev, throttled: true }));
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    const timestamp = new Date().toLocaleTimeString();
    setThrottledInteractions(prev => [...prev.slice(-4), `Throttled ${type} at ${timestamp}`]);
    
    const endTime = performance.now();
    setInteractionStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.solution.eventCount + 1,
      },
    }));

    setTimeout(() => {
      setIsLogging(prev => ({ ...prev, throttled: false }));
    }, 300);
  }, 3000, { 
    leading: false, 
    trailing: true,
    onTrailing: () => {
      if (activeArea === 'throttled') {
        const timestamp = new Date().toLocaleTimeString();
        setThrottledInteractions(prev => [...prev.slice(-4), `🔵 Final update at ${timestamp}`]);
      }
    }
  });

  // Input Value Tracking
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [inputStats, setInputStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });
  const [isThrottling, setIsThrottling] = useState(false);
  const pendingValueRef = useRef('');

  const handleRegularInput = (value: string) => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setInputValue(value);
    setDisplayValue(value);
    
    const endTime = performance.now();
    setInputStats(prev => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));
  };

  const handleThrottledInput = useThrottle((value: string) => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    // Update display value with the latest value
    setDisplayValue(value);
    setIsThrottling(false);
    
    const endTime = performance.now();
    setInputStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.solution.eventCount + 1,
      },
    }));
  }, 1000, { 
    leading: false, 
    trailing: true,
    onTrailing: () => {
      // Ensure we display the very latest value
      setDisplayValue(pendingValueRef.current);
      setIsThrottling(false);
    }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Trailing Throttle Examples</h1>
      
      {/* Window Resize Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Window Resize Optimization</h2>
        <ScenarioInfo info={DEMO_INFO.trailingThrottle.scenarios.resize} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <ArrowsUpDown className="text-gray-600" />
              <span>Current window size:</span>
            </div>
            <p className="text-lg font-medium">
              {windowSize.width}px × {windowSize.height}px
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Try resizing your browser window to see the difference
            </p>
          </div>
          <StatsCard title="Resize Performance" stats={resizeStats} />
        </div>
      </section>

      {/* User Interaction Logger */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User Interaction Logger</h2>
        <ScenarioInfo info={DEMO_INFO.trailingThrottle.scenarios.interaction} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Regular Interaction Area */}
              <div
                className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 ${activeArea === 'regular' ? 'ring-2 ring-indigo-500' : ''}`}
                onMouseEnter={() => setActiveArea('regular')}
                onMouseLeave={() => setActiveArea(null)}
                onMouseMove={() => logRegularInteraction('Move')}
                onClick={() => logRegularInteraction('Click')}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity className={`w-4 h-4 ${isLogging.regular ? 'text-indigo-600 animate-pulse' : 'text-gray-400'}`} />
                  <h3 className="font-medium">Regular Monitor</h3>
                </div>
                <div className="space-y-2">
                  {regularInteractions.map((interaction, index) => (
                    <p key={index} className="text-sm text-gray-600">{interaction}</p>
                  ))}
                </div>
              </div>

              {/* Throttled Interaction Area */}
              <div
                className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 ${activeArea === 'throttled' ? 'ring-2 ring-green-500' : ''}`}
                onMouseEnter={() => setActiveArea('throttled')}
                onMouseLeave={() => setActiveArea(null)}
                onMouseMove={() => logThrottledInteraction('Move')}
                onClick={() => logThrottledInteraction('Click')}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity className={`w-4 h-4 ${isLogging.throttled ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
                  <h3 className="font-medium">Throttled Monitor</h3>
                </div>
                <div className="space-y-2">
                  {throttledInteractions.map((interaction, index) => (
                    <p key={index} className="text-sm text-gray-600">{interaction}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Regular: Logs every interaction immediately</li>
                <li>Throttled: Collects interactions for 1 second</li>
                <li>Throttled: Updates with final state after delay</li>
                <li>Both areas track interactions independently</li>
              </ul>
            </div>
          </div>
          <StatsCard title="Interaction Performance" stats={interactionStats} />
        </div>
      </section>

      {/* Input Value Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input Value Tracking</h2>
        <ScenarioInfo info={DEMO_INFO.trailingThrottle.scenarios.input} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Regular Input */}
              <div className="space-y-4">
                <div className="relative">
                  <Keyboard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    placeholder="Regular input..."
                    onChange={(e) => handleRegularInput(e.target.value)}
                  />
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-sm text-gray-600">
                    Current Value: <span className="font-medium">{displayValue || 'Empty'}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Updates immediately</p>
                </div>
              </div>

              {/* Throttled Input */}
              <div className="space-y-4">
                <div className="relative">
                  <Keyboard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    placeholder="Throttled input (1s)..."
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputValue(value);
                      pendingValueRef.current = value;
                      setIsThrottling(true);
                      handleThrottledInput(value);
                    }}
                    value={inputValue}
                  />
                  {isThrottling && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Display Value: <span className="font-medium">{displayValue || 'Empty'}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Updates after 1s of inactivity</p>
                    </div>
                    {isThrottling && (
                      <span className="text-xs text-green-600">Waiting for typing to finish...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Regular: Updates display value on every keystroke</li>
                <li>Throttled: Collects changes for 1 second</li>
                <li>Throttled: Updates with final value after 1s of no typing</li>
                <li>Shows loading indicator while waiting for update</li>
              </ul>
            </div>
          </div>
          <StatsCard title="Input Performance" stats={inputStats} />
        </div>
      </section>
    </div>
  );
}