import React, { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { StatsCard } from '../components/StatsCard';
import { ScenarioInfo } from '../components/ScenarioInfo';
import { DEMO_INFO } from '../data/demoInfo';
import { Globe, MousePointer2, Menu, Save } from 'lucide-react';

// Simulated API call
const fetchData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { message: 'Data fetched successfully!' };
};

export default function LeadingDebounce() {
  // Double Click Prevention
  const [submissionCount, setSubmissionCount] = useState({ regular: 0, debounced: 0 });
  const [submitting, setSubmitting] = useState({ regular: false, debounced: false });
  const [doubleClickStats, setDoubleClickStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });

  const handleSubmit = async (type: 'regular' | 'debounced') => {
    // Update stats first to capture ALL click attempts
    setDoubleClickStats(prev => ({
      ...prev,
      [type === 'regular' ? 'problem' : 'solution']: {
        executionTime: 0,
        memoryUsage: 0,
        eventCount: prev[type === 'regular' ? 'problem' : 'solution'].eventCount + 1,
      },
    }));

    // For regular submit, always process
    if (type === 'regular') {
      setSubmitting(prev => ({ ...prev, [type]: true }));
      setSubmissionCount(prev => ({ ...prev, [type]: prev[type] + 1 }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitting(prev => ({ ...prev, [type]: false }));
      return;
    }

    // For debounced submit, only process if not already submitting
    if (!submitting.debounced) {
      setSubmitting(prev => ({ ...prev, [type]: true }));
      setSubmissionCount(prev => ({ ...prev, [type]: prev[type] + 1 }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitting(prev => ({ ...prev, [type]: false }));
    }
  };

  const debouncedSubmit = useDebounce(() => handleSubmit('debounced'), 1000, { 
    leading: true,
    trailing: false
  });

  // Menu Toggle Protection
  const [menuOpen, setMenuOpen] = useState(false);
  const [toggleCount, setToggleCount] = useState({ regular: 0, debounced: 0 });
  const [menuStats, setMenuStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });

  const handleMenuToggle = (type: 'regular' | 'debounced') => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setMenuOpen(prev => !prev);
    setToggleCount(prev => ({ ...prev, [type]: prev[type] + 1 }));
    
    const endTime = performance.now();
    setMenuStats(prev => ({
      ...prev,
      [type === 'regular' ? 'problem' : 'solution']: {
        executionTime: endTime - startTime,
        memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
        eventCount: prev[type === 'regular' ? 'problem' : 'solution'].eventCount + 1,
      },
    }));
  };

  const debouncedMenuToggle = useDebounce(() => handleMenuToggle('debounced'), 500, { 
    leading: true,
    trailing: false
  });

  // API Call Protection
  const [requestCount, setRequestCount] = useState({ regular: 0, debounced: 0 });
  const [loading, setLoading] = useState({ regular: false, debounced: false });
  const [apiStats, setApiStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });

  const handleFetch = async (type: 'regular' | 'debounced') => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setLoading(prev => ({ ...prev, [type]: true }));
    setRequestCount(prev => ({ ...prev, [type]: prev[type] + 1 }));
    
    try {
      await fetchData();
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
      
      const endTime = performance.now();
      setApiStats(prev => ({
        ...prev,
        [type === 'regular' ? 'problem' : 'solution']: {
          executionTime: endTime - startTime,
          memoryUsage: ((performance.memory?.usedJSHeapSize || 0) - memoryStart) / 1024 / 1024,
          eventCount: prev[type === 'regular' ? 'problem' : 'solution'].eventCount + 1,
        },
      }));
    }
  };

  const debouncedFetch = useDebounce(() => handleFetch('debounced'), 1000, { 
    leading: true,
    trailing: false
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Leading Debounce Examples</h1>
      
      {/* Form Submit Protection */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Submit Protection</h2>
        <ScenarioInfo info={DEMO_INFO.leadingDebounce.scenarios.doubleClick} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              {/* Regular Submit Button */}
              <button
                onClick={() => handleSubmit('regular')}
                disabled={submitting.regular}
                className="relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-75 transition-all"
              >
                <Save className={`w-4 h-4 ${submitting.regular ? 'animate-spin' : ''}`} />
                Regular Submit
                <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                  {submissionCount.regular} processed
                </span>
                {submitting.regular && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-white/40 animate-[progress_1s_linear]" />
                  </div>
                )}
              </button>

              {/* Protected Submit Button */}
              <button
                onClick={debouncedSubmit}
                disabled={submitting.debounced}
                className="relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-75 transition-all"
              >
                <Save className={`w-4 h-4 ${submitting.debounced ? 'animate-spin' : ''}`} />
                Protected Submit
                <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                  {submissionCount.debounced} processed
                </span>
                {submitting.debounced && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-white/40 animate-[progress_1s_linear]" />
                  </div>
                )}
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Regular: Attempts to submit on every click</li>
                <li>Protected: First click processes immediately</li>
                <li>Protected: Blocks subsequent clicks for 1 second</li>
                <li>Stats show total clicks vs processed submissions</li>
              </ul>
            </div>
          </div>
          <StatsCard title="Click Attempts vs Processed" stats={doubleClickStats} />
        </div>
      </section>

      {/* Rest of the sections stay the same */}
    </div>
  );
}