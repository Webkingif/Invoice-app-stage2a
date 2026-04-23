/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#7c5dfa',
        'primary-light': '#9277ff',
        'sidebar': '#1e2139',
        'ebony-clay': '#252945',
        'selago': '#Dfe3fa',
        'bali-hai': '#888eb0',
        'ship-cove': '#7e88c3',
        'vulcan': '#0c0E16',
        'burnt-sienna': '#ec5757',
        'mona-lisa': '#FF9797',
        'ghost-white': '#f8f8fb',
        'rich-black': '#141625',
      },
      fontFamily: {
        'spartan': ['"League Spartan"', 'sans-serif'],
      },
      fontSize: {
        'heading-l': ['36px', { lineHeight: '33px', letterSpacing: '-1px', fontWeight: '700' }],
        'heading-m': ['24px', { lineHeight: '22px', letterSpacing: '-0.75px', fontWeight: '700' }],
        'heading-s': ['15px', { lineHeight: '24px', letterSpacing: '-0.25px', fontWeight: '700' }],
        'heading-s-variant': ['15px', { lineHeight: '15px', letterSpacing: '-0.25px', fontWeight: '700' }],
        'body': ['13px', { lineHeight: '18px', letterSpacing: '-0.1px', fontWeight: '500' }],
        'body-variant': ['11px', { lineHeight: '15px', letterSpacing: '-0.25px', fontWeight: '500' }],
      }
    },
  },
  plugins: [],
}
