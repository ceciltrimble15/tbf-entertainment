/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          blue:        '#1A3A8F',
          'blue-light': '#2A4EAF',
          'blue-dark':  '#0F2460',
          surface:     '#F0F2F7',
          silver:      '#B0B8C8',
          'silver-light': '#D4DAE6',
          text:        '#1A1A2E',
          slate:       '#4A5068',
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(26,58,143,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 40px rgba(26,58,143,0.14), 0 2px 8px rgba(0,0,0,0.06)',
        cta:  '0 8px 32px rgba(26,58,143,0.32)',
        phone: '0 24px 64px rgba(15,36,96,0.45)',
      },
      borderRadius: {
        card: '16px',
        btn:  '10px',
      },
      letterSpacing: {
        label: '0.12em',
        btn:   '0.10em',
      },
    },
  },
  plugins: [],
};
