/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: {
          950: '#04060f',
          900: '#070b1a',
          800: '#0b1025',
          700: '#111735',
        },
        nebula: {
          900: '#1a0f3a',
          800: '#241656',
          700: '#321e73',
        },
        cosmos: {
          600: '#3b5bdb',
          500: '#4f6df5',
          400: '#6b8aff',
          300: '#8aa3ff',
        },
        cyan: {
          glow: '#22d3ee',
        },
        amber: {
          glow: '#f59e0b',
        },
        verdict: {
          verified: '#22c55e',
          conflicted: '#ef4444',
          supported: '#3b82f6',
          partial: '#f59e0b',
          insufficient: '#6b7280',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'spin-slower': 'spin 40s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
