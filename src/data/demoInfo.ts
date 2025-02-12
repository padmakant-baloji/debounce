import { DemoInfo } from '../types';

export const DEMO_INFO: { [key: string]: DemoInfo } = {
  trailingDebounce: {
    title: 'Trailing Debounce',
    description: 'Trailing debounce waits until after the last event in a series before executing, perfect for search inputs and auto-save features.',
    scenarios: {
      search: {
        title: 'Search Optimization',
        description: 'Real-time search with API calls can overwhelm servers and create a poor user experience if not optimized.',
        problem: 'Every keystroke triggers an immediate API call, causing unnecessary server load and potential race conditions with results.',
        solution: 'Debouncing waits until the user stops typing before making the API call, reducing server load and ensuring more relevant results.',
        impact: 'Reduces API calls by up to 90% while maintaining responsiveness and improving result accuracy.',
      },
      autoSave: {
        title: 'Auto-save Form',
        description: 'Automatic saving of form content helps prevent data loss but needs to be implemented efficiently.',
        problem: 'Saving on every keystroke creates excessive server requests and can lead to data consistency issues.',
        solution: 'Debouncing saves only after the user stops typing, ensuring efficient updates and better data consistency.',
        impact: 'Reduces server load while maintaining data safety, with up to 80% fewer save operations.',
      },
      resize: {
        title: 'Window Resize Handling',
        description: 'Window resize events fire rapidly and can impact performance if not handled properly.',
        problem: 'Processing every resize event causes excessive calculations and potential layout thrashing.',
        solution: 'Debouncing ensures layout updates happen only after the resize is complete, optimizing performance.',
        impact: 'Reduces layout calculations by up to 95% during window resizing operations.',
      },
    },
  },
  leadingDebounce: {
    title: 'Leading Debounce',
    description: 'Leading debounce executes immediately on the first event and blocks subsequent events until the delay period has passed. Perfect for scenarios requiring immediate action with protection against rapid repetition.',
    scenarios: {
      doubleClick: {
        title: 'Form Submit Protection',
        description: 'Preventing duplicate form submissions while maintaining immediate user feedback.',
        problem: 'Multiple rapid clicks can trigger multiple form submissions, leading to duplicate transactions or data corruption.',
        solution: 'Leading debounce processes the first click immediately while blocking subsequent clicks, ensuring exactly one submission.',
        impact: 'Eliminates duplicate submissions while maintaining instant user feedback.',
      },
      dropdown: {
        title: 'Menu Toggle Protection',
        description: 'Protecting menu toggles from rapid state changes while maintaining responsive interaction.',
        problem: 'Rapid toggling of menus can cause UI flicker and poor user experience.',
        solution: 'Leading debounce allows immediate toggle but prevents rapid subsequent toggles, ensuring smooth interaction.',
        impact: 'Provides immediate feedback while preventing UI flicker and erratic behavior.',
      },
      apiCall: {
        title: 'Critical API Call Protection',
        description: 'Protecting critical API endpoints from rapid repeated calls while maintaining immediate response.',
        problem: 'Rapid API calls can overwhelm servers and create race conditions, but delayed response is unacceptable.',
        solution: 'Leading debounce sends the first request immediately while preventing duplicate calls, ensuring responsive yet safe operation.',
        impact: 'Maintains immediate response while preventing server overload and race conditions.',
      },
    },
  },
  leadingTrailingDebounce: {
    title: 'Leading-Trailing Debounce',
    description: 'Combines immediate execution with a final update, perfect for user activity monitoring and form submissions.',
    scenarios: {
      activity: {
        title: 'User Activity Detection',
        description: 'Tracking user activity requires both immediate response and efficient updates.',
        problem: 'Continuous activity events can flood the system with updates.',
        solution: 'Leading-trailing debounce provides immediate feedback and final state updates.',
        impact: 'Balances responsiveness with system efficiency, reducing updates by up to 75%.',
      },
      form: {
        title: 'Form Submission',
        description: 'Form submissions need to be both responsive and safe from duplicate submissions.',
        problem: 'Multiple submissions can create duplicate data and poor user experience.',
        solution: 'Leading-trailing debounce ensures immediate feedback and prevents duplicates.',
        impact: 'Eliminates duplicate submissions while providing immediate user feedback.',
      },
    },
  },
  leadingThrottle: {
    title: 'Leading Throttle',
    description: 'Leading throttle executes immediately and then ensures a controlled rate of execution, perfect for scenarios requiring immediate feedback with rate-limited updates.',
    scenarios: {
      buttonClick: {
        title: 'Button Click Protection',
        description: 'Protecting button clicks from rapid-fire events while maintaining immediate response.',
        problem: 'Rapid button clicks can trigger too many actions, leading to performance issues or unintended behavior.',
        solution: 'Leading throttle allows immediate first click while limiting subsequent clicks to a controlled rate.',
        impact: 'Maintains responsive UI while preventing action spam and reducing server load.',
      },
      scroll: {
        title: 'Scroll Position Tracking',
        description: 'Efficiently tracking scroll position with immediate feedback and controlled updates.',
        problem: 'Continuous scroll events can overwhelm performance with excessive position calculations and updates.',
        solution: 'Leading throttle provides immediate position feedback while limiting update frequency.',
        impact: 'Smooth scroll tracking with significantly reduced performance overhead.',
      },
      mouseMove: {
        title: 'Mouse Movement Tracking',
        description: 'Real-time mouse position tracking with optimized update frequency.',
        problem: 'Mouse move events fire rapidly, causing excessive updates and potential UI jank.',
        solution: 'Leading throttle captures immediate movement while controlling update frequency.',
        impact: 'Smooth mouse tracking with minimal performance impact.',
      },
    },
  },
  trailingThrottle: {
    title: 'Trailing Throttle',
    description: 'Trailing throttle ensures events are processed at a steady rate, executing after the delay period.',
    scenarios: {
      resize: {
        title: 'Window Resize Optimization',
        description: 'Window resizing needs to be smooth while maintaining UI responsiveness.',
        problem: 'Continuous resize events can cause performance issues and janky animations.',
        solution: 'Trailing throttle ensures smooth updates at a controlled rate.',
        impact: 'Improves performance during resize operations while maintaining visual smoothness.',
      },
      interaction: {
        title: 'User Interaction Logger',
        description: 'Logging user interactions needs to be efficient while capturing important events.',
        problem: 'Logging every interaction can overwhelm storage and processing.',
        solution: 'Trailing throttle captures interactions at a manageable rate.',
        impact: 'Reduces log volume while maintaining meaningful interaction tracking.',
      },
      input: {
        title: 'Input Value Tracking',
        description: 'Tracking input values needs to balance responsiveness with efficiency.',
        problem: 'Processing every input change can cause performance issues.',
        solution: 'Trailing throttle ensures steady updates without overwhelming the system.',
        impact: 'Maintains smooth input handling while reducing processing overhead.',
      },
    },
  },
  leadingTrailingThrottle: {
    title: 'Leading-Trailing Throttle',
    description: 'Combines immediate execution with steady updates, perfect for infinite scroll and activity monitoring.',
    scenarios: {
      activity: {
        title: 'User Activity Monitor',
        description: 'Monitoring user activity needs both immediate response and efficient ongoing updates.',
        problem: 'Continuous activity monitoring can impact performance.',
        solution: 'Leading-trailing throttle provides immediate feedback with controlled updates.',
        impact: 'Balances responsiveness with system resources, reducing overhead by up to 60%.',
      },
      scroll: {
        title: 'Infinite Scroll',
        description: 'Infinite scroll needs to be responsive while preventing excessive API calls.',
        problem: 'Scroll events can trigger too many data fetches, impacting performance.',
        solution: 'Leading-trailing throttle ensures smooth scrolling with efficient data loading.',
        impact: 'Reduces API calls while maintaining smooth scroll experience.',
      },
      request: {
        title: 'Request Lifecycle',
        description: 'Managing request lifecycles needs to balance user feedback with server load.',
        problem: 'Rapid requests can overwhelm servers and create poor user experience.',
        solution: 'Leading-trailing throttle provides immediate feedback with controlled request rates.',
        impact: 'Improves user experience while protecting server resources.',
      },
    },
  },
  combinedTechniques: {
    title: 'Combined Techniques',
    description: 'Combining different debounce and throttle patterns to achieve optimal performance and user experience in complex scenarios.',
    scenarios: {
      autoSave: {
        title: 'Smart Auto-save',
        description: 'Implementing Google Docs style auto-save with both immediate and delayed saves.',
        problem: 'Simple auto-save implementations either save too frequently (wasting resources) or wait too long (risking data loss).',
        solution: 'Combine leading-trailing debounce to save immediately on first change and after user stops typing.',
        impact: 'Provides immediate feedback while ensuring efficient resource usage and data safety.',
      },
      typing: {
        title: 'Intelligent Typing Indicator',
        description: 'Real-time typing indicator with optimized network updates.',
        problem: 'Basic typing indicators either update too frequently or feel unresponsive to users.',
        solution: 'Use throttle for local UI updates and debounce for server notifications.',
        impact: 'Creates smooth local experience while preventing server overload.',
      },
      saveStatus: {
        title: 'Progressive Save Status',
        description: 'Advanced save status management with optimized updates.',
        problem: 'Status updates can become overwhelming with frequent saves, leading to UI flicker and poor performance.',
        solution: 'Combine throttle for immediate status changes with debounce for cleanup.',
        impact: 'Maintains responsive feedback while preventing status message spam.',
      },
    },
  },
};