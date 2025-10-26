/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C41E3A',
          blue: '#4A6FA5',
        },
      },
    },
  },
  plugins: [],
};
