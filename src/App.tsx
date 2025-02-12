import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Cpu } from 'lucide-react';

// Lazy load route components
const TrailingDebounce = React.lazy(() => import('./routes/TrailingDebounce'));
const LeadingDebounce = React.lazy(() => import('./routes/LeadingDebounce'));
const LeadingTrailingDebounce = React.lazy(() =>
  import('./routes/LeadingTrailingDebounce')
);
const LeadingThrottle = React.lazy(() => import('./routes/LeadingThrottle'));
const TrailingThrottle = React.lazy(() => import('./routes/TrailingThrottle'));
const LeadingTrailingThrottle = React.lazy(() =>
  import('./routes/LeadingTrailingThrottle')
);
const CombinedTechniques = React.lazy(() =>
  import('./routes/CombinedTechniques')
);
const MemoryLeak = React.lazy(() => import('./routes/MemoryLeak'));
const Documentation = React.lazy(() => import('./routes/Documentation'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin">
        <Cpu className="w-8 h-8 text-indigo-600" />
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="prose max-w-none">
      <h1>React Performance Optimization Techniques</h1>
      <p>
        This application demonstrates various performance optimization
        techniques in React. Each route showcases different scenarios with both
        problematic and optimized implementations.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[
          {
            title: 'Trailing Debounce',
            description:
              'Learn how to optimize search, auto-save, and resize events.',
            path: '/trailing-debounce',
          },
          {
            title: 'Leading Debounce',
            description:
              'Explore double-click prevention and dropdown optimization.',
            path: '/leading-debounce',
          },
          {
            title: 'Leading-Trailing Debounce',
            description:
              'See user activity detection and form submission optimization.',
            path: '/leading-trailing-debounce',
          },
          {
            title: 'Leading Throttle',
            description:
              'Discover button click and scroll position optimization.',
            path: '/leading-throttle',
          },
          {
            title: 'Trailing Throttle',
            description:
              'Learn about window resize and user interaction optimization.',
            path: '/trailing-throttle',
          },
          {
            title: 'Leading-Trailing Throttle',
            description:
              'Explore activity monitoring and infinite scroll optimization.',
            path: '/leading-trailing-throttle',
          },
          {
            title: 'Combined Techniques',
            description:
              'See how to combine different optimization techniques.',
            path: '/combined-techniques',
          },
          {
            title: 'Memory Leak Prevention',
            description: 'Learn about proper cleanup and memory management.',
            path: '/memory-leak',
          },
          {
            title: 'Documentation',
            description:
              'In-depth guide to performance optimization techniques and best practices.',
            path: '/documentation',
          },
        ].map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow no-underline"
          >
            <h3 className="text-lg font-semibold text-gray-900 mt-0">
              {item.title}
            </h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trailing-debounce" element={<TrailingDebounce />} />
              <Route path="/leading-debounce" element={<LeadingDebounce />} />
              <Route
                path="/leading-trailing-debounce"
                element={<LeadingTrailingDebounce />}
              />
              <Route path="/leading-throttle" element={<LeadingThrottle />} />
              <Route path="/trailing-throttle" element={<TrailingThrottle />} />
              <Route
                path="/leading-trailing-throttle"
                element={<LeadingTrailingThrottle />}
              />
              <Route
                path="/combined-techniques"
                element={<CombinedTechniques />}
              />
              <Route path="/memory-leak" element={<MemoryLeak />} />
              <Route path="/documentation" element={<Documentation />} />
            </Routes>
          </React.Suspense>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;