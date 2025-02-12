import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { StatsCard } from '../components/StatsCard';
import { ScenarioInfo } from '../components/ScenarioInfo';
import { DEMO_INFO } from '../data/demoInfo';
import { Search, Save, ArrowDownWideNarrow } from 'lucide-react';

// Simulated API call
const searchAPI = async (query: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return Array.from({ length: 5 }, (_, i) => ({
    id: i,
    title: `Result ${i + 1} for "${query}"`,
  }));
};

export default function TrailingDebounce() {
  // Search Implementation
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Array<{ id: number; title: string }>>([]);
  const [searchStats, setSearchStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });

  // Regular search
  useEffect(() => {
    if (!searchQuery) return;
    
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    searchAPI(searchQuery).then((data) => {
      setResults(data);
      const endTime = performance.now();
      const memoryEnd = performance.memory?.usedJSHeapSize || 0;
      setSearchStats(prev => ({
        ...prev,
        problem: {
          executionTime: endTime - startTime,
          memoryUsage: (memoryEnd - memoryStart) / (1024 * 1024),
          eventCount: prev.problem.eventCount + 1,
        },
      }));
    });
  }, [searchQuery]);

  // Debounced search
  const debouncedSearch = useDebounce(async (query: string) => {
    if (!query) return;
    
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    const data = await searchAPI(query);
    setResults(data);
    
    const endTime = performance.now();
    const memoryEnd = performance.memory?.usedJSHeapSize || 0;
    setSearchStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: (memoryEnd - memoryStart) / (1024 * 1024),
        eventCount: prev.solution.eventCount + 1,
      },
    }));
  }, 500);

  // Auto-save Implementation
  const [text, setText] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [autoSaveStats, setAutoSaveStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });

  // Regular save
  const saveContent = async (content: string) => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 1000);
    
    const endTime = performance.now();
    const memoryEnd = performance.memory?.usedJSHeapSize || 0;
    setAutoSaveStats(prev => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage: (memoryEnd - memoryStart) / (1024 * 1024),
        eventCount: prev.problem.eventCount + 1,
      },
    }));
  };

  // Debounced save
  const debouncedSave = useDebounce(async (content: string) => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 1000);
    
    const endTime = performance.now();
    const memoryEnd = performance.memory?.usedJSHeapSize || 0;
    setAutoSaveStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: (memoryEnd - memoryStart) / (1024 * 1024),
        eventCount: prev.solution.eventCount + 1,
      },
    }));
  }, 1000);

  // Window Resize Example
  const [isUsingProblem, setIsUsingProblem] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [resizeStats, setResizeStats] = useState({
    problem: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
    solution: { executionTime: 0, memoryUsage: 0, eventCount: 0 },
  });

  // Regular resize handler
  const handleRegularResize = () => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const endTime = performance.now();
    const memoryEnd = performance.memory?.usedJSHeapSize || 0;
    setResizeStats(prev => ({
      ...prev,
      problem: {
        executionTime: endTime - startTime,
        memoryUsage: (memoryEnd - memoryStart) / (1024 * 1024),
        eventCount: prev.problem.eventCount + 1,
      },
    }));
  };

  // Debounced resize handler
  const debouncedResize = useDebounce(() => {
    const startTime = performance.now();
    const memoryStart = performance.memory?.usedJSHeapSize || 0;
    
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const endTime = performance.now();
    const memoryEnd = performance.memory?.usedJSHeapSize || 0;
    setResizeStats(prev => ({
      ...prev,
      solution: {
        executionTime: endTime - startTime,
        memoryUsage: (memoryEnd - memoryStart) / (1024 * 1024),
        eventCount: prev.solution.eventCount + 1,
      },
    }));
  }, 200);

  useEffect(() => {
    const handler = isUsingProblem ? handleRegularResize : debouncedResize;
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [isUsingProblem]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Trailing Debounce Examples</h1>
      
      {/* Search Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Search Optimization</h2>
        <ScenarioInfo info={DEMO_INFO.trailingDebounce.scenarios.search} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search without debounce..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search with debounce..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium mb-2">Search Results</h3>
              {results.map((result) => (
                <div key={result.id} className="py-2 border-b last:border-0">
                  {result.title}
                </div>
              ))}
            </div>
          </div>
          <StatsCard title="Search Performance" stats={searchStats} />
        </div>
      </section>

      {/* Auto-save Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Auto-save Form</h2>
        <ScenarioInfo info={DEMO_INFO.trailingDebounce.scenarios.autoSave} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative">
              <textarea
                placeholder="Type to auto-save..."
                className="w-full p-4 border rounded-lg h-40"
                onChange={(e) => {
                  const newValue = e.target.value;
                  setText(newValue);
                  if (isUsingProblem) {
                    saveContent(newValue);
                  } else {
                    debouncedSave(newValue);
                  }
                }}
                value={text}
              />
              {saveStatus && (
                <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  <Save className="inline-block w-4 h-4 mr-1" />
                  {saveStatus}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsUsingProblem(true)}
                className={`flex-1 py-2 px-4 rounded ${
                  isUsingProblem ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                }`}
              >
                Regular Save
              </button>
              <button
                onClick={() => setIsUsingProblem(false)}
                className={`flex-1 py-2 px-4 rounded ${
                  !isUsingProblem ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}
              >
                Debounced Save
              </button>
            </div>
          </div>
          <StatsCard title="Auto-save Performance" stats={autoSaveStats} />
        </div>
      </section>

      {/* Window Resize Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Window Resize Handling</h2>
        <ScenarioInfo info={DEMO_INFO.trailingDebounce.scenarios.resize} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <ArrowDownWideNarrow />
                  <span>Current window size:</span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsUsingProblem(true)}
                    className={`py-2 px-4 rounded ${
                      isUsingProblem ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Regular
                  </button>
                  <button
                    onClick={() => setIsUsingProblem(false)}
                    className={`py-2 px-4 rounded ${
                      !isUsingProblem ? 'bg-green-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Debounced
                  </button>
                </div>
              </div>
              <p className="text-lg font-medium">
                {windowSize.width}px × {windowSize.height}px
              </p>
            </div>
          </div>
          <StatsCard title="Resize Performance" stats={resizeStats} />
        </div>
      </section>
    </div>
  );
}