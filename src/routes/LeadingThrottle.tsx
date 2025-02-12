import React, { useState, useRef, useEffect } from 'react';
import { useThrottle } from '../hooks/useThrottle';
import { StatsCard } from '../components/StatsCard';
import { ScenarioInfo } from '../components/ScenarioInfo';
import { DEMO_INFO } from '../data/demoInfo';
import { MousePointer2, ArrowDown, MousePointer, Activity } from 'lucide-react';

export default function LeadingThrottle() {
  // Button Click Demo
  const [regularAttempts, setRegularAttempts] = useState(0);
  const [throttledAttempts, setThrottledAttempts] = useState(0);
  const [clickStats, setClickStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });
  const throttleTimeoutRef = useRef<boolean>(false);
  const [isProcessing, setIsProcessing] = useState({ regular: false, throttled: false });

  // Regular click handler
  const handleRegularClick = async () => {
    if (isProcessing.regular) return;

    setIsProcessing(prev => ({ ...prev, regular: true }));
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;

    // Increment total attempts shown on button
    setRegularAttempts((prev) => prev + 1);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update performance stats with processed click
    setClickStats((prev) => ({
      ...prev,
      problem: {
        executionTime: performance.now() - startTime,
        memoryUsage:
          ((performance.memory?.usedJSHeapSize || 0) - memoryStart) /
          1024 /
          1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));

    setIsProcessing(prev => ({ ...prev, regular: false }));
  };

  // Throttled click handler
  const handleThrottledClick = async () => {
    // Increment total attempts shown on button
    setThrottledAttempts((prev) => prev + 1);

    // Only process click if not in throttle timeout
    if (!throttleTimeoutRef.current && !isProcessing.throttled) {
      setIsProcessing(prev => ({ ...prev, throttled: true }));
      const startTime = performance.now();
      const memoryStart = performance.memory?.usedJSHeapSize || 0;

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update performance stats with successfully processed click
      setClickStats((prev) => ({
        ...prev,
        solution: {
          executionTime: performance.now() - startTime,
          memoryUsage:
            ((performance.memory?.usedJSHeapSize || 0) - memoryStart) /
            1024 /
            1024,
          eventCount: prev.solution.eventCount + 1,
        },
      }));

      // Set throttle timeout
      throttleTimeoutRef.current = true;
      setTimeout(() => {
        throttleTimeoutRef.current = false;
      }, 1000);

      setIsProcessing(prev => ({ ...prev, throttled: false }));
    }
  };

  // Scroll Position Tracking
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollStats, setScrollStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });
  const [isScrolling, setIsScrolling] = useState({ regular: false, throttled: false });

  const handleRegularScroll = () => {
    if (!contentRef.current || isScrolling.regular) return;

    setIsScrolling(prev => ({ ...prev, regular: true }));
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;

    setScrollPosition(contentRef.current.scrollTop);

    const endTime = performance.now();
    setScrollStats((prev) => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage:
          ((performance.memory?.usedJSHeapSize || 0) - memoryStart) /
          1024 /
          1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));

    setTimeout(() => {
      setIsScrolling(prev => ({ ...prev, regular: false }));
    }, 100);
  };

  const handleThrottledScroll = useThrottle(
    () => {
      if (!contentRef.current || isScrolling.throttled) return;

      setIsScrolling(prev => ({ ...prev, throttled: true }));
      const startTime = performance.now();
      const memoryStart = performance.memory?.usedJSHeapSize || 0;

      setScrollPosition(contentRef.current.scrollTop);

      const endTime = performance.now();
      setScrollStats((prev) => ({
        ...prev,
        solution: {
          executionTime: endTime - startTime,
          memoryUsage:
            ((performance.memory?.usedJSHeapSize || 0) - memoryStart) /
            1024 /
            1024,
          eventCount: prev.solution.eventCount + 1,
        },
      }));

      setTimeout(() => {
        setIsScrolling(prev => ({ ...prev, throttled: false }));
      }, 100);
    },
    1000,
    { leading: true, trailing: false }
  );

  // Mouse Movement Tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseStats, setMouseStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });
  const [isTracking, setIsTracking] = useState({ regular: false, throttled: false });

  const handleRegularMouseMove = (e: React.MouseEvent) => {
    if (isTracking.regular) return;

    setIsTracking(prev => ({ ...prev, regular: true }));
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;

    setMousePosition({ x: e.clientX, y: e.clientY });

    const endTime = performance.now();
    setMouseStats((prev) => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage:
          ((performance.memory?.usedJSHeapSize || 0) - memoryStart) /
          1024 /
          1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));

    setTimeout(() => {
      setIsTracking(prev => ({ ...prev, regular: false }));
    }, 50);
  };

  const handleThrottledMouseMove = useThrottle(
    (e: React.MouseEvent) => {
      if (isTracking.throttled) return;

      setIsTracking(prev => ({ ...prev, throttled: true }));
      const startTime = performance.now();
      const memoryStart = performance.memory?.usedJSHeapSize || 0;

      setMousePosition({ x: e.clientX, y: e.clientY });

      const endTime = performance.now();
      setMouseStats((prev) => ({
        ...prev,
        solution: {
          executionTime: endTime - startTime,
          memoryUsage:
            ((performance.memory?.usedJSHeapSize || 0) - memoryStart) /
            1024 /
            1024,
          eventCount: prev.solution.eventCount + 1,
        },
      }));

      setTimeout(() => {
        setIsTracking(prev => ({ ...prev, throttled: false }));
      }, 50);
    },
    1000,
    { leading: true, trailing: false }
  );

  // User Interaction Logger
  const [regularInteractions, setRegularInteractions] = useState<string[]>([]);
  const [throttledInteractions, setThrottledInteractions] = useState<string[]>([]);
  const [interactionStats, setInteractionStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });
  const [isLogging, setIsLogging] = useState({ regular: false, throttled: false });

  const logRegularInteraction = (type: string) => {
    if (isLogging.regular) return;

    setIsLogging(prev => ({ ...prev, regular: true }));
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    const timestamp = new Date().toLocaleTimeString();
    setRegularInteractions(prev => [...prev.slice(-4), `${type} at ${timestamp}`]);
    
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
    if (isLogging.throttled) return;

    setIsLogging(prev => ({ ...prev, throttled: true }));
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    const timestamp = new Date().toLocaleTimeString();
    setThrottledInteractions(prev => [...prev.slice(-4), `${type} at ${timestamp}`]);
    
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
    }, 100);
  }, 1000, { leading: true, trailing: false });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Leading Throttle Examples</h1>

      {/* User Interaction Logger */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User Interaction Logger</h2>
        <ScenarioInfo info={DEMO_INFO.leadingThrottle.scenarios.buttonClick} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Regular Interaction Area */}
              <div
                className="bg-white rounded-lg shadow-md p-6 relative"
                onMouseMove={() => logRegularInteraction('Regular Move')}
                onClick={() => logRegularInteraction('Regular Click')}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity className={`w-4 h-4 ${isLogging.regular ? 'text-indigo-600 animate-pulse' : 'text-gray-400'}`} />
                  <h3 className="font-medium">Regular Logging</h3>
                </div>
                <div className="space-y-2">
                  {regularInteractions.map((interaction, index) => (
                    <p key={index} className="text-sm text-gray-600">{interaction}</p>
                  ))}
                </div>
              </div>

              {/* Throttled Interaction Area */}
              <div
                className="bg-white rounded-lg shadow-md p-6 relative"
                onMouseMove={() => logThrottledInteraction('Throttled Move')}
                onClick={() => logThrottledInteraction('Throttled Click')}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity className={`w-4 h-4 ${isLogging.throttled ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
                  <h3 className="font-medium">Throttled Logging</h3>
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
                <li>Throttled: First interaction logs immediately</li>
                <li>Throttled: Subsequent interactions within 1s are ignored</li>
                <li>Both keep only the last 5 interactions</li>
              </ul>
            </div>
          </div>
          <StatsCard title="Interaction Performance" stats={interactionStats} />
        </div>
      </section>

      {/* Button Click Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Click Protection</h2>
        <ScenarioInfo info={DEMO_INFO.leadingThrottle.scenarios.buttonClick} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Regular Button */}
              <button
                onClick={handleRegularClick}
                disabled={isProcessing.regular}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors relative overflow-hidden disabled:opacity-75"
              >
                <MousePointer2 className={`w-4 h-4 ${isProcessing.regular ? 'animate-spin' : ''}`} />
                <span>Attempts: {regularAttempts}</span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400" />
              </button>

              {/* Throttled Button */}
              <button
                onClick={handleThrottledClick}
                disabled={isProcessing.throttled}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors relative overflow-hidden disabled:opacity-75"
              >
                <MousePointer2 className={`w-4 h-4 ${isProcessing.throttled ? 'animate-spin' : ''}`} />
                <span>Attempts: {throttledAttempts}</span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600">
                  {throttleTimeoutRef.current && (
                    <div
                      className="h-full bg-green-400 animate-[progress_1s_linear]"
                      style={{ width: '100%' }}
                    />
                  )}
                </div>
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">
                How Leading Throttle Works:
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-2">
                <li>
                  <span className="font-medium">Button Display:</span>
                  <br />
                  Shows total click attempts (including throttled ones)
                </li>
                <li>
                  <span className="font-medium">Performance Stats:</span>
                  <br />
                  Event count shows successfully processed clicks only
                </li>
                <li>
                  <span className="font-medium">Throttle Window (1000ms):</span>
                  <br />
                  Green progress bar shows when clicks are being throttled
                </li>
              </ul>
            </div>
          </div>
          <StatsCard title="Click Performance" stats={clickStats} />
        </div>
      </section>

      {/* Scroll Position Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Scroll Position Tracking</h2>
        <ScenarioInfo info={DEMO_INFO.leadingThrottle.scenarios.scroll} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Regular Scroll */}
              <div
                ref={contentRef}
                onScroll={handleRegularScroll}
                className="h-40 overflow-y-auto bg-white rounded-lg shadow-md relative"
              >
                <div className="p-4 space-y-4">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <p key={i} className="text-gray-600">
                      Regular scroll content line {i + 1}
                    </p>
                  ))}
                </div>
                <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">
                  <ArrowDown className="inline-block w-4 h-4 mr-1" />
                  Position: {scrollPosition}px
                </div>
              </div>

              {/* Throttled Scroll */}
              <div
                onScroll={handleThrottledScroll}
                className="h-40 overflow-y-auto bg-white rounded-lg shadow-md relative"
              >
                <div className="p-4 space-y-4">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <p key={i} className="text-gray-600">
                      Throttled scroll content line {i + 1}
                    </p>
                  ))}
                </div>
                <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  <ArrowDown className="inline-block w-4 h-4 mr-1" />
                  Position: {scrollPosition}px
                </div>
              </div>
            </div>
          </div>
          <StatsCard title="Scroll Performance" stats={scrollStats} />
        </div>
      </section>

      {/* Mouse Movement Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Mouse Movement Tracking</h2>
        <ScenarioInfo info={DEMO_INFO.leadingThrottle.scenarios.mouseMove} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Regular Mouse Move */}
              <div
                className="h-40 bg-white rounded-lg shadow-md relative overflow-hidden"
                onMouseMove={handleRegularMouseMove}
              >
                <div
                  className="absolute w-4 h-4 bg-indigo-600 rounded-full transition-all duration-75 ease-out"
                  style={{
                    left: mousePosition.x,
                    top: mousePosition.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">
                  <MousePointer className="inline-block w-4 h-4 mr-1" />(
                  {mousePosition.x}, {mousePosition.y})
                </div>
              </div>

              {/* Throttled Mouse Move */}
              <div
                className="h-40 bg-white rounded-lg shadow-md relative overflow-hidden"
                onMouseMove={handleThrottledMouseMove}
              >
                <div
                  className="absolute w-4 h-4 bg-green-600 rounded-full transition-all duration-75 ease-out"
                  style={{
                    left: mousePosition.x,
                    top: mousePosition.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  <MousePointer className="inline-block w-4 h-4 mr-1" />(
                  {mousePosition.x}, {mousePosition.y})
                </div>
              </div>
            </div>
          </div>
          <StatsCard title="Mouse Movement Performance" stats={mouseStats} />
        </div>
      </section>
    </div>
  );
}