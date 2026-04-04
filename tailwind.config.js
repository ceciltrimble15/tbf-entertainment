/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Barlow Condensed', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        tbf: {
          black:   '#0A0A0A',
          blue:    '#1E90FF',
          'blue-dim': '#1570CC',
          'blue-glow': 'rgba(30,144,255,0.25)',
          silver:  '#C0C0C0',
          'silver-dim': '#A9A9A9',
          dark:    '#2B2B2B',
          'dark-2': '#111111',
          'dark-3': '#1A1A1A',
        },
      },
      boxShadow: {
        'blue-glow':  '0 0 24px rgba(30,144,255,0.35), 0 0 8px rgba(30,144,255,0.2)',
        'blue-glow-lg': '0 0 48px rgba(30,144,255,0.4), 0 0 16px rgba(30,144,255,0.25)',
        'card-dark':  '0 4px 32px rgba(0,0,0,0.6)',
        'card-hover': '0 8px 48px rgba(0,0,0,0.8), 0 0 24px rgba(30,144,255,0.15)',
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.3em',
      },
    },
  },
  plugins: [],
};
