/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {

      colors: {
        'baby-yellow': {
          900: '#FFEB02',
          500: '#99911F',
        },
        'baby-orange': {
          800: '#FF8C6E',
          900: '#FF8001',
        },
        'baby-red': {
          900: '#FF686D',
        },
        'baby-pink': {
          900: '#FFB9D2',
        },
        'baby-blue': {
          800: '#0096E6',
          900: '#3C37D2',
        },
        'baby-teal': {
          700: '#91E1E1',
          800: '#21AAA0',
          900: '#006E77',
        },
        'baby-purple': {
          900: '#7841BD',
        },
      },
    },
  },
  plugins: [],
}

