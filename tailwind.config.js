/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'duck-yellow': {
          900: '#FFEB02',
          500: '#99911F',
        },
        'duck-orange': {
          800: '#FF8C6E',
          900: '#FF8001',
        },
        'duck-red': {
          900: '#FF686D',
        },
        'duck-pink': {
          900: '#FFB9D2',
        },
        'duck-blue': {
          800: '#0096E6',
          900: '#3C37D2',
        },
        'duck-teal': {
          700: '#91E1E1',
          800: '#21AAA0',
          900: '#006E77',
        },
        'duck-purple': {
          900: '#7841BD',
        },
      },
    },
  },
  plugins: [],
}
