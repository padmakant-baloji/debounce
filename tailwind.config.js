/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        abbyy: {
          primary: '#0066B3',
          secondary: '#00A0E3',
          accent: '#FFB81C',
          dark: '#1A1A1A',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'abbyy': '0 4px 6px -1px rgba(0, 102, 179, 0.1), 0 2px 4px -1px rgba(0, 102, 179, 0.06)',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'content': 'var(--max-width)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'var(--max-width)',
            color: 'inherit',
            a: {
              color: 'inherit',
              '&:hover': {
                color: '#0066B3',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
};