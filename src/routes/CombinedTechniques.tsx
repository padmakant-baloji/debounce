import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';
import { StatsCard } from '../components/StatsCard';
import { ScenarioInfo } from '../components/ScenarioInfo';
import { DEMO_INFO } from '../data/demoInfo';
import { Save, Keyboard, Activity } from 'lucide-react';

export default function CombinedTechniques() {
  // Auto-save Demo
  const [regularContent, setRegularContent] = useState('');
  const [optimizedContent, setOptimizedContent] = useState('');
  const [regularSaveStatus, setRegularSaveStatus] = useState('');
  const [optimizedSaveStatus, setOptimizedSaveStatus] = useState('');
  const [autoSaveStats, setAutoSaveStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });
  const [isSaving, setIsSaving] = useState({ regular: false, optimized: false });
  const [saveProgress, setSaveProgress] = useState(0);

  // Regular save implementation
  const handleRegularSave = async (content: string) => {
    if (isSaving.regular) return;

    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setIsSaving(prev => ({ ...prev, regular: true }));
    setRegularSaveStatus('Saving...');
    setRegularContent(content);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRegularSaveStatus('Saved!');
    setIsSaving(prev => ({ ...prev, regular: false }));
    setTimeout(() => setRegularSaveStatus(''), 1000);
    
    const endTime = performance.now();
    setAutoSaveStats(prev => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));
  };

  // Smart auto-save implementation with clearer status updates
  const handleSmartSave = (content: string) => {
    // Update content immediately for responsiveness
    setOptimizedContent(content);
    setOptimizedSaveStatus('Changes detected');
    setSaveProgress(25);
    
    // Trigger the optimized save process
    handleOptimizedSave(content);
  };

  // Throttled draft save with clearer status progression
  const handleOptimizedSave = useThrottle(async (content: string) => {
    if (isSaving.optimized) return;

    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setIsSaving(prev => ({ ...prev, optimized: true }));
    
    // Quick draft save
    setOptimizedSaveStatus('Saving draft...');
    setSaveProgress(50);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Schedule a full save
    handleFullSave(content);
    
    const endTime = performance.now();
    setAutoSaveStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.solution.eventCount + 1,
      },
    }));
  }, 2000);

  // Debounced full save with clearer status updates
  const handleFullSave = useDebounce(async (content: string) => {
    setOptimizedSaveStatus('Preparing full save...');
    setSaveProgress(75);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setOptimizedSaveStatus('Saving all changes...');
    setSaveProgress(90);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setOptimizedSaveStatus('All changes saved');
    setSaveProgress(100);
    setIsSaving(prev => ({ ...prev, optimized: false }));
    
    setTimeout(() => {
      setOptimizedSaveStatus('');
      setSaveProgress(0);
    }, 1000);
  }, 3000);

  // Active Typing Indicator
  const [regularTyping, setRegularTyping] = useState(false);
  const [optimizedTyping, setOptimizedTyping] = useState(false);
  const [typingStats, setTypingStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });

  const handleRegularTyping = () => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setRegularTyping(true);
    setTimeout(() => setRegularTyping(false), 1000);
    
    const endTime = performance.now();
    setTypingStats(prev => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));
  };

  // Improved throttled typing indicator
  const handleThrottledTyping = useThrottle((e: React.ChangeEvent<HTMLInputElement>) => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setOptimizedTyping(true);
    
    // Clear typing indicator after 1.5s of no typing
    const timeout = setTimeout(() => setOptimizedTyping(false), 1500);
    
    const endTime = performance.now();
    setTypingStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.solution.eventCount + 1,
      },
    }));

    return () => clearTimeout(timeout);
  }, 500, { leading: true, trailing: true });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Combined Optimization Techniques</h1>
      
      {/* Auto-save Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Google Docs Style Auto-save</h2>
        <ScenarioInfo info={DEMO_INFO.combinedTechniques.scenarios.autoSave} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Regular Auto-save */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Regular Auto-save</h3>
                <div className="relative">
                  <textarea
                    className="w-full h-40 p-4 border rounded-lg"
                    placeholder="Type to trigger regular auto-save..."
                    value={regularContent}
                    onChange={(e) => handleRegularSave(e.target.value)}
                  />
                  {regularSaveStatus && (
                    <div className="absolute top-2 right-2 bg-white shadow-lg px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                      <Save className={`w-4 h-4 ${isSaving.regular ? 'animate-spin' : ''}`} />
                      {regularSaveStatus}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Saves on every keystroke
                </div>
              </div>

              {/* Optimized Auto-save */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Smart Auto-save</h3>
                <div className="relative">
                  <textarea
                    className="w-full h-40 p-4 border rounded-lg"
                    placeholder="Type to see smart auto-save..."
                    value={optimizedContent}
                    onChange={(e) => handleSmartSave(e.target.value)}
                  />
                  {optimizedSaveStatus && (
                    <div className="absolute top-2 right-2 bg-white shadow-lg px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                      <Save className={`w-4 h-4 ${isSaving.optimized ? 'animate-spin' : ''}`} />
                      {optimizedSaveStatus}
                    </div>
                  )}
                  {saveProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                      <div
                        className="h-full transition-all duration-300 ease-out"
                        style={{
                          width: `${saveProgress}%`,
                          backgroundColor: saveProgress < 50 ? '#FCD34D' :
                                         saveProgress < 90 ? '#60A5FA' :
                                         '#34D399'
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Throttled draft saves (2s) + debounced full saves (3s pause)
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Regular: Saves on every keystroke (resource intensive)</li>
                <li>Smart: Content updates immediately, draft saves every 2s</li>
                <li>Full save happens after 3s of no typing</li>
                <li>Progress bar shows current save state and type</li>
              </ul>
            </div>
          </div>
          <StatsCard title="Auto-save Performance" stats={autoSaveStats} />
        </div>
      </section>

      {/* Active Typing Indicator */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Intelligent Typing Indicator</h2>
        <ScenarioInfo info={DEMO_INFO.combinedTechniques.scenarios.typing} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative">
                  <Keyboard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    placeholder="Regular typing..."
                    onChange={handleRegularTyping}
                  />
                  {regularTyping && (
                    <div className="absolute top-2 right-2 bg-white shadow-lg px-3 py-1.5 rounded-full text-sm flex items-center gap-2 text-indigo-600">
                      <Activity className="w-4 h-4 animate-pulse" />
                      Typing...
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Keyboard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    placeholder="Optimized typing..."
                    onChange={handleThrottledTyping}
                  />
                  {optimizedTyping && (
                    <div className="absolute top-2 right-2 bg-white shadow-lg px-3 py-1.5 rounded-full text-sm flex items-center gap-2 text-green-600">
                      <Activity className="w-4 h-4 animate-pulse" />
                      Typing...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <StatsCard title="Typing Indicator Performance" stats={typingStats} />
        </div>
      </section>
    </div>
  );
}