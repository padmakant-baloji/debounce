import React, { useState } from 'react';
import { Code, BookOpen, Zap, Shield, Cpu, Search, MousePointer, Save, Activity, Clock, ArrowDown, AlertTriangle } from 'lucide-react';

// Reusable components for documentation
const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6 text-abbyy-primary" />
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-medium text-abbyy-gray-800">{title}</h3>
    {children}
  </div>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
    <code>{children}</code>
  </pre>
);

const TechnicalNote = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
    <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
      <Zap className="w-4 h-4" />
      Technical Note
    </div>
    <div className="text-blue-600 text-sm">{children}</div>
  </div>
);

const BestPractice = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
    <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
      <Shield className="w-4 h-4" />
      Best Practice
    </div>
    <div className="text-green-600 text-sm">{children}</div>
  </div>
);

const Warning = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
    <div className="flex items-center gap-2 text-red-700 font-medium mb-1">
      <AlertTriangle className="w-4 h-4" />
      Warning
    </div>
    <div className="text-red-600 text-sm">{children}</div>
  </div>
);

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-abbyy-primary text-white'
        : 'bg-white text-abbyy-gray-600 hover:bg-abbyy-gray-50'
    }`}
  >
    {children}
  </button>
);

const ExampleCard = ({ 
  title, 
  icon: Icon, 
  description, 
  code, 
  notes,
  warnings = [],
  bestPractices = []
}: { 
  title: string; 
  icon: any; 
  description: string; 
  code: string; 
  notes: string[];
  warnings?: string[];
  bestPractices?: string[];
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-abbyy-primary" />
      <h4 className="font-medium text-lg">{title}</h4>
    </div>
    <p className="text-gray-600">{description}</p>
    <CodeBlock>{code}</CodeBlock>
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h5 className="font-medium text-gray-700 mb-2">Implementation Notes:</h5>
        <ul className="space-y-2">
          {notes.map((note, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-abbyy-primary">•</span>
              {note}
            </li>
          ))}
        </ul>
      </div>
      {warnings.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h5 className="font-medium text-red-700 mb-2">Common Pitfalls:</h5>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
      {bestPractices.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h5 className="font-medium text-green-700 mb-2">Best Practices:</h5>
          <ul className="space-y-2">
            {bestPractices.map((practice, index) => (
              <li key={index} className="text-sm text-green-600 flex items-start gap-2">
                <Shield className="w-4 h-4 flex-shrink-0" />
                {practice}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

export default function Documentation() {
  const [activeTab, setActiveTab] = useState<'concepts' | 'examples'>('concepts');

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Performance Optimization Documentation</h1>
        <p className="text-lg text-abbyy-gray-600">
          A comprehensive guide to implementing debouncing, throttling, and other performance
          optimization techniques in React applications.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <TabButton
          active={activeTab === 'concepts'}
          onClick={() => setActiveTab('concepts')}
        >
          Core Concepts
        </TabButton>
        <TabButton
          active={activeTab === 'examples'}
          onClick={() => setActiveTab('examples')}
        >
          Implementation Examples
        </TabButton>
      </div>

      {activeTab === 'concepts' ? (
        <Section title="Core Concepts" icon={BookOpen}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SubSection title="Debouncing">
                <div className="space-y-4">
                  <p className="text-abbyy-gray-700">
                    Debouncing is a programming practice that limits the rate at which a function
                    can fire. It ensures that time-consuming tasks don't fire so often that they
                    paralyze the browser.
                  </p>

                  <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                    <h4 className="font-medium">Types of Debouncing</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-abbyy-primary mb-1">Leading (Immediate)</div>
                        <p className="text-gray-600">
                          Executes the function immediately, then ignores subsequent calls for the
                          specified delay period.
                        </p>
                        <CodeBlock>
{`useDebounce(fn, 500, {
  leading: true,
  trailing: false
})`}
                        </CodeBlock>
                      </div>
                      <div>
                        <div className="font-medium text-abbyy-primary mb-1">Trailing (Delayed)</div>
                        <p className="text-gray-600">
                          Waits for the specified delay period of inactivity before executing
                          the function.
                        </p>
                        <CodeBlock>
{`useDebounce(fn, 500, {
  leading: false,
  trailing: true
})`}
                        </CodeBlock>
                      </div>
                    </div>
                  </div>

                  <Warning>
                    Be careful with memory usage in debounced functions. Any variables captured
                    in the closure will be retained in memory until the debounced function is
                    either executed or cleared.
                  </Warning>

                  <BestPractice>
                    Always clean up debounced functions in useEffect's cleanup function to
                    prevent memory leaks and unexpected behavior.
                  </BestPractice>
                </div>
              </SubSection>

              <SubSection title="Throttling">
                <div className="space-y-4">
                  <p className="text-abbyy-gray-700">
                    Throttling guarantees a function won't be called more often than the specified
                    time limit. Unlike debouncing, throttled functions execute at a regular interval.
                  </p>

                  <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                    <h4 className="font-medium">Throttling Patterns</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium text-abbyy-primary mb-1">Leading Edge</div>
                        <p className="text-gray-600">
                          Executes immediately and then enforces the delay. Perfect for
                          immediate feedback with rate limiting.
                        </p>
                        <CodeBlock>
{`useThrottle(fn, 200, {
  leading: true,
  trailing: false
})`}
                        </CodeBlock>
                      </div>
                      <div>
                        <div className="font-medium text-abbyy-primary mb-1">Trailing Edge</div>
                        <p className="text-gray-600">
                          Waits for the delay period before executing. Good for collecting
                          and processing batched updates.
                        </p>
                        <CodeBlock>
{`useThrottle(fn, 200, {
  leading: false,
  trailing: true
})`}
                        </CodeBlock>
                      </div>
                      <div>
                        <div className="font-medium text-abbyy-primary mb-1">Leading & Trailing</div>
                        <p className="text-gray-600">
                          Executes immediately and guarantees a final call after the delay.
                          Best for complete event handling.
                        </p>
                        <CodeBlock>
{`useThrottle(fn, 200, {
  leading: true,
  trailing: true
})`}
                        </CodeBlock>
                      </div>
                    </div>
                  </div>

                  <TechnicalNote>
                    Throttling maintains a more consistent execution rate compared to
                    debouncing, making it better suited for real-time updates and
                    continuous events.
                  </TechnicalNote>
                </div>
              </SubSection>
            </div>

            <div className="space-y-6">
              <SubSection title="Implementation Guidelines">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                    <h4 className="font-medium">When to Use Each Technique</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-abbyy-primary">Use Debouncing For:</h5>
                        <ul className="mt-2 space-y-2 text-sm text-gray-600">
                          <li className="flex items-start gap-2">
                            <Search className="w-4 h-4 mt-0.5 text-abbyy-primary" />
                            Search inputs (wait for typing to finish)
                          </li>
                          <li className="flex items-start gap-2">
                            <Save className="w-4 h-4 mt-0.5 text-abbyy-primary" />
                            Form auto-save (prevent rapid saves)
                          </li>
                          <li className="flex items-start gap-2">
                            <ArrowDown className="w-4 h-4 mt-0.5 text-abbyy-primary" />
                            Window resize calculations
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-abbyy-primary">Use Throttling For:</h5>
                        <ul className="mt-2 space-y-2 text-sm text-gray-600">
                          <li className="flex items-start gap-2">
                            <MousePointer className="w-4 h-4 mt-0.5 text-abbyy-primary" />
                            Mouse move/scroll events
                          </li>
                          <li className="flex items-start gap-2">
                            <Activity className="w-4 h-4 mt-0.5 text-abbyy-primary" />
                            Game loop/animation updates
                          </li>
                          <li className="flex items-start gap-2">
                            <Clock className="w-4 h-4 mt-0.5 text-abbyy-primary" />
                            Regular polling/updates
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                    <h4 className="font-medium">Recommended Delay Times</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-600">Search Input</span>
                          <p className="text-xs text-gray-500">Balance between responsiveness and performance</p>
                        </div>
                        <span className="text-abbyy-primary">300-500ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-600">Window Resize</span>
                          <p className="text-xs text-gray-500">Prevent layout thrashing</p>
                        </div>
                        <span className="text-abbyy-primary">200-300ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-600">Scroll Events</span>
                          <p className="text-xs text-gray-500">Smooth scrolling experience</p>
                        </div>
                        <span className="text-abbyy-primary">100-200ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-600">Button Clicks</span>
                          <p className="text-xs text-gray-500">Prevent double submissions</p>
                        </div>
                        <span className="text-abbyy-primary">300-500ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-600">Auto Save</span>
                          <p className="text-xs text-gray-500">Balance between data safety and performance</p>
                        </div>
                        <span className="text-abbyy-primary">1000-2000ms</span>
                      </div>
                    </div>
                  </div>

                  <Warning>
                    <div className="space-y-2">
                      <p>Common mistakes to avoid:</p>
                      <ul className="list-disc list-inside text-sm">
                        <li>Not cleaning up timers in useEffect</li>
                        <li>Using leading debounce for search inputs</li>
                        <li>Using trailing throttle for button clicks</li>
                        <li>Setting delay times too short or too long</li>
                        <li>Not handling edge cases (e.g., component unmount)</li>
                      </ul>
                    </div>
                  </Warning>
                </div>
              </SubSection>
            </div>
          </div>
        </Section>
      ) : (
        <Section title="Implementation Examples" icon={Cpu}>
          <div className="space-y-8">
            {/* Search Input Example */}
            <ExampleCard
              title="Search Input Optimization"
              icon={Search}
              description="Implement a search input that efficiently handles user typing and API calls."
              code={`function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounce the search to wait for user to stop typing
  const debouncedSearch = useDebounce(async (value) => {
    if (!value.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchAPI(value);
      onSearch(results);
    } finally {
      setIsSearching(false);
    }
  }, 500, {
    leading: false,  // Don't search immediately
    trailing: true   // Wait for typing to finish
  });

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedSearch(e.target.value);
        }}
        placeholder="Search..."
        className="w-full px-4 py-2 rounded-lg border"
      />
      {isSearching && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}`}
              notes={[
                "Uses trailing debounce to wait for user to finish typing",
                "500ms delay provides good balance between responsiveness and performance",
                "Prevents unnecessary API calls while user is still typing",
                "Updates only after user has stopped typing for 500ms",
                "Shows loading indicator during API calls"
              ]}
              warnings={[
                "Don't use leading debounce for search - it will trigger unnecessary initial searches",
                "Be careful with race conditions in API calls",
                "Don't forget to handle empty search queries"
              ]}
              bestPractices={[
                "Always show loading state during searches",
                "Consider minimum query length before searching",
                "Handle API errors gracefully",
                "Cache recent search results if possible"
              ]}
            />

            {/* Mouse Movement Example */}
            <ExampleCard
              title="Mouse Movement Tracking"
              icon={MousePointer}
              description="Track mouse movement efficiently without overwhelming the application."
              code={`function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);

  const handleMouseMove = useThrottle(
    (e) => {
      setIsTracking(true);
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Reset tracking indicator after movement stops
      const timeout = setTimeout(() => setIsTracking(false), 100);
      return () => clearTimeout(timeout);
    },
    16, // ~60fps for smooth animation
    { 
      leading: true,   // Immediate response
      trailing: true,  // Catch final position
      onTrailing: () => setIsTracking(false)
    }
  );

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative h-40 bg-gray-100 rounded-lg"
    >
      <div 
        className={\`absolute w-4 h-4 bg-blue-500 rounded-full transition-all duration-75
          \${isTracking ? 'scale-100' : 'scale-75'}\`}
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)'
        }}
      />
      <div className="absolute bottom-2 right-2 text-sm">
        ({position.x}, {position.y})
      </div>
    </div>
  );
}`}
              notes={[
                "Uses throttling to limit updates to ~60fps (16ms)",
                "Leading execution provides immediate feedback",
                "Trailing execution ensures final position is captured",
                "Visual feedback shows active tracking state",
                "Smooth transitions between position updates"
              ]}
              warnings={[
                "Don't use debounce for continuous tracking - it will feel laggy",
                "Be careful with performance in animation frames",
                "Watch out for jank when processing too much data"
              ]}
              bestPractices={[
                "Use requestAnimationFrame for smoother animations",
                "Keep transform calculations simple",
                "Consider using CSS transforms for better performance",
                "Implement bounds checking for container"
              ]}
            />

            {/* Auto-save Example */}
            <ExampleCard
              title="Smart Auto-save Implementation"
              icon={Save}
              description="Implement an efficient auto-save feature with both immediate and delayed saves."
              code={`function AutoSaveInput() {
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [progress, setProgress] = useState(0);

  // Quick draft save (throttled)
  const saveDraft = useThrottle(
    async (value) => {
      setSaveStatus('Saving draft...');
      setProgress(50);
      await saveToDraft(value);
      setSaveStatus('Draft saved');
      setProgress(75);
    },
    2000, // Save draft every 2s
    { leading: true }
  );

  // Full save (debounced)
  const saveContent = useDebounce(
    async (value) => {
      setSaveStatus('Preparing full save...');
      setProgress(90);
      await saveToServer(value);
      setSaveStatus('All changes saved');
      setProgress(100);
      
      setTimeout(() => {
        setSaveStatus('');
        setProgress(0);
      }, 1000);
    },
    5000, // Full save after 5s of no changes
    { leading: false, trailing: true }
  );

  return (
    <div className="relative">
      <textarea
        value={content}
        onChange={(e) => {
          const newContent = e.target.value;
          setContent(newContent);
          setProgress(25);
          setSaveStatus('Changes detected');
          saveDraft(newContent);
          saveContent(newContent);
        }}
        className="w-full p-4 rounded-lg border"
      />
      {saveStatus && (
        <div className="absolute top-2 right-2 bg-white shadow-lg px-3 py-1.5 rounded-full text-sm">
          {saveStatus}
        </div>
      )}
      {progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: \`\${progress}%\`,
              backgroundColor: progress < 50 ? '#FCD34D' :
                             progress < 90 ? '#60A5FA' :
                             '#34D399'
            }}
          />
        </div>
      )}
    </div>
  );
}`}
              notes={[
                "Combines throttling for drafts and debouncing for full saves",
                "Throttled draft saves provide regular checkpoints",
                "Debounced full save prevents overwhelming the server",
                "Visual feedback shows save progress and status",
                "Color-coded progress bar indicates save phase"
              ]}
              warnings={[
                "Don't save too frequently - it can impact performance",
                "Handle network errors and retry logic",
                "Be careful with large content and memory usage"
              ]}
              bestPractices={[
                "Show clear visual feedback for each save phase",
                "Implement conflict resolution for concurrent edits",
                "Consider offline support with localStorage",
                "Compress data before saving if possible"
              ]}
            />

            {/* Activity Monitor Example */}
            <ExampleCard
              title="User Activity Monitoring"
              icon={Activity}
              description="Track user activity efficiently with combined optimization techniques."
              code={`function ActivityMonitor() {
  const [status, setStatus] = useState('active');
  const [lastActive, setLastActive] = useState(Date.now());
  const [events, setEvents] = useState<string[]>([]);
  const activityTimeout = useRef();

  // Immediate activity registration (throttled)
  const handleActivity = useThrottle(
    (type: string) => {
      const now = Date.now();
      setStatus('active');
      setLastActive(now);
      setEvents(prev => [
        ...prev.slice(-4),
        \`\${type} at \${new Date(now).toLocaleTimeString()}\`
      ]);
      
      // Reset inactivity timer
      clearTimeout(activityTimeout.current);
      activityTimeout.current = setTimeout(() => {
        setStatus('inactive');
      }, 5000);
    },
    1000, // Update at most every 1s
    { 
      leading: true,   // Immediate status update
      trailing: true,  // Ensure final state is captured
      onTrailing: () => {
        setEvents(prev => [
          ...prev.slice(-4),
          \`Final update at \${new Date().toLocaleTimeString()}\`
        ]);
      }
    }
  );

  useEffect(() => {
    // Clean up on unmount
    return () => clearTimeout(activityTimeout.current);
  }, []);

  return (
    <div 
      className="space-y-4 p-4 bg-white rounded-lg"
      onMouseMove={() => handleActivity('Mouse move')}
      onClick={() => handleActivity('Click')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={\`w-2 h-2 rounded-full \${
            status === 'active' ? 'bg-green-500' : 'bg-red-500'
          }\`} />
          <span>Status: {status}</span>
        </div>
        <span className="text-sm text-gray-500">
          Last active: {new Date(lastActive).toLocaleTimeString()}
        </span>
      </div>
      <div className="space-y-1">
        {events.map((event, i) => (
          <p key={i} className="text-sm text-gray-600">{event}</p>
        ))}
      </div>
    </div>
  );
}`}
              notes={[
                "Throttles activity updates to prevent excessive state changes",
                "Leading execution ensures immediate status update",
                "Trailing execution captures final activity state",
                "Maintains activity log with timestamps",
                "Auto-clears status after inactivity period"
              ]}
              warnings={[
                "Don't track too many event types - it can impact performance",
                "Be careful with memory usage in activity logs",
                "Watch out for timer cleanup on unmount"
              ]}
              bestPractices={[
                "Keep activity logs bounded in size",
                "Use appropriate timeout periods",
                "Implement proper cleanup",
                "Consider using Web Workers for heavy processing"
              ]}
            />
          </div>
        </Section>
      )}
    </div>
  );
}