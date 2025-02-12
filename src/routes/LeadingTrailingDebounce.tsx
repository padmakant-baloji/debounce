import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { StatsCard } from '../components/StatsCard';
import { ScenarioInfo } from '../components/ScenarioInfo';
import { DEMO_INFO } from '../data/demoInfo';
import { Activity, Save, Clock } from 'lucide-react';

export default function LeadingTrailingDebounce() {
  // User Activity Detection
  const [lastActivity, setLastActivity] = useState<string>('No activity');
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [activityStats, setActivityStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });

  // Regular activity handler - updates on every event
  const handleRegularActivity = () => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    setLastActivity(`Active at ${timestamp}`);
    setActivityLog(prev => [...prev.slice(-4), `Regular update at ${timestamp}`]);
    
    const endTime = performance.now();
    setActivityStats(prev => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));
  };

  // Leading-trailing debounced activity handler
  const handleDebouncedActivity = useDebounce(() => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    const message = activityStats.solution.eventCount === 0 
      ? `🟢 Leading update at ${timestamp}` 
      : `🔵 Trailing update at ${timestamp}`;
    
    setLastActivity(`Active at ${timestamp}`);
    setActivityLog(prev => [...prev.slice(-4), message]);
    
    const endTime = performance.now();
    setActivityStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.solution.eventCount + 1,
      },
    }));
  }, 1000, { leading: true, trailing: true });

  // Form Submission Example
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [submissionCount, setSubmissionCount] = useState({ regular: 0, debounced: 0 });
  const [formStats, setFormStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });
  const [saveStatus, setSaveStatus] = useState('');

  const handleRegularSubmit = async () => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setSaveStatus('Saving...');
    await new Promise(resolve => setTimeout(resolve, 500));
    setSubmissionCount(prev => ({ ...prev, regular: prev.regular + 1 }));
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 1000);
    
    const endTime = performance.now();
    setFormStats(prev => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.problem.eventCount + 1,
      },
    }));
  };

  const handleDebouncedSubmit = useDebounce(async () => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setSaveStatus('Saving...');
    await new Promise(resolve => setTimeout(resolve, 500));
    setSubmissionCount(prev => ({ ...prev, debounced: prev.debounced + 1 }));
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 1000);
    
    const endTime = performance.now();
    setFormStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev.solution.eventCount + 1,
      },
    }));
  }, 1000, { leading: true, trailing: true });

  // Clear logs when component unmounts
  useEffect(() => {
    return () => {
      setActivityLog([]);
      setLastActivity('No activity');
    };
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Leading-Trailing Debounce Examples</h1>
      
      {/* User Activity Monitor */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User Activity Detection</h2>
        <ScenarioInfo info={DEMO_INFO.leadingTrailingDebounce.scenarios.activity} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Regular Updates */}
              <div className="space-y-4">
                <div
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg relative overflow-hidden group"
                  onMouseMove={handleRegularActivity}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="text-red-500 animate-pulse" />
                    <h3 className="font-medium">Regular Updates</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{lastActivity}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-100">
                    <div className="h-full bg-red-500 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Update Log
                  </h4>
                  <div className="space-y-1">
                    {activityLog.filter(log => log.includes('Regular')).map((log, i) => (
                      <p key={i} className="text-xs text-red-600">{log}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Debounced Updates */}
              <div className="space-y-4">
                <div
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg relative overflow-hidden group"
                  onMouseMove={handleDebouncedActivity}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="text-green-500 animate-pulse" />
                    <h3 className="font-medium">Optimized Updates</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{lastActivity}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-100">
                    <div className="h-full bg-green-500 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Update Log
                  </h4>
                  <div className="space-y-1">
                    {activityLog.filter(log => !log.includes('Regular')).map((log, i) => (
                      <p key={i} className="text-xs text-green-600">{log}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <StatsCard title="Activity Monitor Performance" stats={activityStats} />
        </div>
      </section>

      {/* Form Submission */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Submission</h2>
        <ScenarioInfo info={DEMO_INFO.leadingTrailingDebounce.scenarios.form} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Regular Form */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Regular Form</h3>
                    <span className="text-xs text-gray-500">
                      {submissionCount.regular} submissions
                    </span>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full px-3 py-2 border rounded-lg"
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, title: e.target.value }));
                        handleRegularSubmit();
                      }}
                    />
                    <textarea
                      placeholder="Content"
                      className="w-full px-3 py-2 border rounded-lg h-20"
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, content: e.target.value }));
                        handleRegularSubmit();
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Debounced Form */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Protected Form</h3>
                    <span className="text-xs text-gray-500">
                      {submissionCount.debounced} submissions
                    </span>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full px-3 py-2 border rounded-lg"
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, title: e.target.value }));
                        handleDebouncedSubmit();
                      }}
                    />
                    <textarea
                      placeholder="Content"
                      className="w-full px-3 py-2 border rounded-lg h-20"
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, content: e.target.value }));
                        handleDebouncedSubmit();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {saveStatus && (
              <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <Save className="w-4 h-4" />
                {saveStatus}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Regular: Saves on every keystroke</li>
                <li>Protected: First change saves immediately</li>
                <li>Protected: Additional changes within 1s are batched</li>
                <li>Protected: Final save occurs after 1s of no changes</li>
              </ul>
            </div>
          </div>
          <StatsCard title="Form Submission Performance" stats={formStats} />
        </div>
      </section>
    </div>
  );
}