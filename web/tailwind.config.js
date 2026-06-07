/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        insta: {
          DEFAULT: '#C13584',
          dark: '#833AB4',
          light: '#E1306C',
        },
      },
    },
  },
  plugins: [],
}

