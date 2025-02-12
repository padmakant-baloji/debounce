import React, { useState, useEffect, useRef } from 'react';
import { StatsCard } from '../components/StatsCard';
import { AlertTriangle, RefreshCcw, Clock, Activity, Info } from 'lucide-react';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';

// Explanatory tooltips for each scenario
const SCENARIO_INFO = {
  event: {
    title: 'Event Listener Memory Leak',
    description: `Event listeners that aren't properly cleaned up remain in memory even after a component is removed. This is like forgetting to unsubscribe from a newsletter - you keep getting emails even after you've moved away.`,
    problem: `In this example, we're continuously adding mouse move listeners without removing them. Each new listener captures memory and stays active, leading to a gradual memory increase.`,
    solution: `The fix is to always remove event listeners when they're no longer needed, typically in the cleanup function of useEffect. This is like properly unsubscribing from services you no longer use.`,
    impact: `Without cleanup, each page visit adds more listeners, slowly consuming more memory and potentially affecting performance.`,
  },
  timer: {
    title: 'Timer/Interval Memory Leak',
    description: `Timers and intervals that continue running after a component is unmounted can cause memory leaks. It's like leaving a tap running after you've left the room.`,
    problem: `Here, we start an interval that continuously adds data to an array but never stops it. The array grows indefinitely, consuming more and more memory.`,
    solution: `Always clear intervals when the component unmounts using the cleanup function in useEffect. This ensures all timers are properly stopped, like turning off the tap when you're done.`,
    impact: `Uncleaned intervals continue running in the background, consuming CPU cycles and memory, potentially causing performance issues or unexpected behavior.`,
  },
  closure: {
    title: 'Closure Memory Leak',
    description: `Closures can accidentally hold references to large data structures, preventing them from being garbage collected. This is like keeping a reference to an entire library when you only need one book.`,
    problem: `This example creates a large array and keeps a reference to it in a closure. Even when we don't need the data anymore, it stays in memory because the closure maintains a reference to it.`,
    solution: `Properly scope your data and clean up references when they're no longer needed. Only keep references to data you actually need, and clear them in cleanup functions.`,
    impact: `Retained references prevent garbage collection, leading to memory bloat and reduced application performance over time.`,
  },
};

// Component with event listener memory leak
const ProblematicEventComponent = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const listenerCountRef = useRef(0);
  const [listenerCount, setListenerCount] = useState(0);
  const leakedListeners = useRef<Array<(e: MouseEvent) => void>>([]);
  
  useEffect(() => {
    // Create a new handler each time to simulate memory leak
    const handleMouseMove = (e: MouseEvent) => {
      // Create new object on every move to simulate memory allocation
      const positions = Array(1000).fill({ x: e.clientX, y: e.clientY });
      setMousePosition(positions[0]);
    };

    // Add listener and store reference
    window.addEventListener('mousemove', handleMouseMove);
    leakedListeners.current.push(handleMouseMove);
    listenerCountRef.current += 1;
    setListenerCount(listenerCountRef.current);

    // No cleanup! This is what causes the memory leak
  }, []); // Only run once on mount

  return (
    <div className="h-40 bg-white rounded-lg shadow-md p-4">
      <p>Mouse position: ({mousePosition.x}, {mousePosition.y})</p>
      <p className="text-sm text-red-500 mt-2">Active listeners: {listenerCount}</p>
      <div className="mt-4 h-1 bg-red-100 rounded overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${Math.min(listenerCount * 10, 100)}%` }}
        />
      </div>
      <p className="text-xs text-red-400 mt-2">
        Each mount adds a new listener without cleanup
      </p>
    </div>
  );
};

// Component with proper event listener cleanup
const OptimizedEventComponent = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [listenerCount, setListenerCount] = useState(0);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setListenerCount(1); // Always one listener

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      setListenerCount(0);
    };
  }, []); // Only run once on mount

  return (
    <div className="h-40 bg-white rounded-lg shadow-md p-4">
      <p>Mouse position: ({mousePosition.x}, {mousePosition.y})</p>
      <p className="text-sm text-green-500 mt-2">Active listeners: {listenerCount}</p>
      <div className="mt-4 h-1 bg-green-100 rounded overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${listenerCount * 100}%` }}
        />
      </div>
      <p className="text-xs text-green-400 mt-2">
        Single listener with proper cleanup
      </p>
    </div>
  );
};

// Component with timer memory leak
const ProblematicTimerComponent = () => {
  const [count, setCount] = useState(0);
  const leakedData = useRef<number[]>([]);
  const [memoryUsage, setMemoryUsage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate memory leak by continuously adding data
      leakedData.current = [...leakedData.current, ...Array(1000).fill(Math.random())];
      setCount(c => c + 1);
      setMemoryUsage(leakedData.current.length * 8 / (1024 * 1024)); // Approximate MB
    }, 1000);
    // No cleanup!
  }, []);

  return (
    <div className="h-40 bg-white rounded-lg shadow-md p-4">
      <p>Timer ticks: {count}</p>
      <p className="text-sm text-red-500 mt-2">
        Memory usage: {memoryUsage.toFixed(2)} MB
        <br />
        Array size: {leakedData.current.length.toLocaleString()} items
      </p>
    </div>
  );
};

// Component with proper timer cleanup
const OptimizedTimerComponent = () => {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      setIsRunning(false);
    };
  }, []);

  return (
    <div className="h-40 bg-white rounded-lg shadow-md p-4">
      <p>Timer ticks: {count}</p>
      <p className="text-sm text-green-500 mt-2">
        Timer status: {isRunning ? 'Running (will cleanup on unmount)' : 'Cleaned up'}
      </p>
    </div>
  );
};

// Component with closure memory leak
const ProblematicClosureComponent = () => {
  const [data, setData] = useState<string[]>([]);
  const heavyData = useRef<number[]>([]);
  const [memoryUsage, setMemoryUsage] = useState(0);

  useEffect(() => {
    // Create large array that will be captured in closure
    heavyData.current = Array(100000).fill(0).map(() => Math.random());

    const processData = () => {
      // This closure captures heavyData reference
      const newItem = `Processed ${heavyData.current.length.toLocaleString()} items at ${new Date().toLocaleTimeString()}`;
      setData(prev => [...prev, newItem]);
      setMemoryUsage(heavyData.current.length * 8 / (1024 * 1024)); // Approximate MB
    };

    const interval = setInterval(processData, 1000);
    // No cleanup of heavyData!
  }, []);

  return (
    <div className="h-40 overflow-y-auto bg-white rounded-lg shadow-md p-4">
      <p className="text-sm text-red-500 mb-2">Memory usage: {memoryUsage.toFixed(2)} MB</p>
      {data.map((item, i) => (
        <div key={i} className="py-1 border-b last:border-0">{item}</div>
      ))}
    </div>
  );
};

// Component with proper closure cleanup
const OptimizedClosureComponent = () => {
  const [data, setData] = useState<string[]>([]);
  const [memoryUsage, setMemoryUsage] = useState(0);
  
  useEffect(() => {
    const processData = () => {
      const newItem = `Processed at ${new Date().toLocaleTimeString()}`;
      setData(prev => {
        const newData = [...prev, newItem];
        return newData.slice(-5); // Keep only last 5 items
      });
      setMemoryUsage(0.1); // Minimal memory usage
    };

    const interval = setInterval(processData, 1000);
    return () => {
      clearInterval(interval);
      setData([]); // Clear data on cleanup
    };
  }, []);

  return (
    <div className="h-40 overflow-y-auto bg-white rounded-lg shadow-md p-4">
      <p className="text-sm text-green-500 mb-2">Memory usage: {memoryUsage.toFixed(2)} MB (bounded)</p>
      {data.map((item, i) => (
        <div key={i} className="py-1 border-b last:border-0">{item}</div>
      ))}
    </div>
  );
};

export default function MemoryLeak() {
  const [showProblematic, setShowProblematic] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);
  const [demoType, setDemoType] = useState<'event' | 'timer' | 'closure'>('event');

  const {
    metrics: memoryStats,
    measure: measureMemory,
    reset: resetMemoryStats
  } = usePerformanceMetrics();

  // Reset stats when changing demo type
  useEffect(() => {
    resetMemoryStats();
  }, [demoType, resetMemoryStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setShowProblematic(false);
      setShowOptimized(false);
      resetMemoryStats();
    };
  }, [resetMemoryStats]);

  const renderDemo = () => {
    switch (demoType) {
      case 'event':
        return {
          problematic: <ProblematicEventComponent />,
          optimized: <OptimizedEventComponent />,
          title: SCENARIO_INFO.event.title,
          icon: <Activity className="w-6 h-6" />,
          info: SCENARIO_INFO.event,
        };
      case 'timer':
        return {
          problematic: <ProblematicTimerComponent />,
          optimized: <OptimizedTimerComponent />,
          title: SCENARIO_INFO.timer.title,
          icon: <Clock className="w-6 h-6" />,
          info: SCENARIO_INFO.timer,
        };
      case 'closure':
        return {
          problematic: <ProblematicClosureComponent />,
          optimized: <OptimizedClosureComponent />,
          title: SCENARIO_INFO.closure.title,
          icon: <RefreshCcw className="w-6 h-6" />,
          info: SCENARIO_INFO.closure,
        };
    }
  };

  const demo = renderDemo();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-abbyy-dark">Memory Leak Prevention</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setDemoType('event')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              demoType === 'event' ? 'bg-abbyy-primary text-white' : 'bg-white text-abbyy-gray-600'
            }`}
          >
            <Activity className="w-4 h-4" />
            Event Listeners
          </button>
          <button
            onClick={() => setDemoType('timer')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              demoType === 'timer' ? 'bg-abbyy-primary text-white' : 'bg-white text-abbyy-gray-600'
            }`}
          >
            <Clock className="w-4 h-4" />
            Timers
          </button>
          <button
            onClick={() => setDemoType('closure')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              demoType === 'closure' ? 'bg-abbyy-primary text-white' : 'bg-white text-abbyy-gray-600'
            }`}
          >
            <RefreshCcw className="w-4 h-4" />
            Closures
          </button>
        </div>
      </div>

      {/* Scenario Information */}
      <div className="bg-abbyy-primary bg-opacity-5 rounded-lg p-6 border border-abbyy-primary border-opacity-20">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-abbyy-primary flex-shrink-0 mt-1" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-abbyy-primary">{demo.info.description}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-abbyy-dark mb-2">The Problem</h4>
                <p className="text-sm text-abbyy-gray-600">{demo.info.problem}</p>
              </div>
              <div>
                <h4 className="font-medium text-abbyy-dark mb-2">The Solution</h4>
                <p className="text-sm text-abbyy-gray-600">{demo.info.solution}</p>
              </div>
              <div>
                <h4 className="font-medium text-abbyy-dark mb-2">The Impact</h4>
                <p className="text-sm text-abbyy-gray-600">{demo.info.impact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          {demo.icon}
          <h2 className="text-2xl font-semibold text-abbyy-dark">{demo.title}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Problematic Implementation
              </h3>
              <button
                onClick={() => {
                  measureMemory(async () => {
                    setShowOptimized(false);
                    setShowProblematic(!showProblematic);
                  }, 'problem');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Toggle Component
              </button>
            </div>
            {showProblematic && demo.problematic}
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Memory Leak Risk</h4>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                <li>No cleanup of event listeners/timers</li>
                <li>Accumulating data without bounds</li>
                <li>References retained in closures</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-abbyy-secondary flex items-center gap-2">
                <RefreshCcw className="w-5 h-5" />
                Optimized Implementation
              </h3>
              <button
                onClick={() => {
                  measureMemory(async () => {
                    setShowProblematic(false);
                    setShowOptimized(!showOptimized);
                  }, 'solution');
                }}
                className="px-4 py-2 bg-abbyy-secondary text-white rounded-lg hover:bg-abbyy-primary transition-colors"
              >
                Toggle Component
              </button>
            </div>
            {showOptimized && demo.optimized}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Best Practices</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Proper cleanup in useEffect</li>
                <li>Bounded data structures</li>
                <li>Clear references on unmount</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <StatsCard title="Memory Usage Comparison" stats={memoryStats} showMemory />
    </div>
  );
}