/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-blue': 'hsl(209, 23%, 22%)', // Dark Mode Elements
        'very-dark-blue-dm': 'hsl(207, 26%, 17%)', // Dark Mode Background
        'very-dark-blue-lm': 'hsl(200, 15%, 8%)', // Light Mode Text
        'dark-gray': 'hsl(0, 0%, 52%)', // Light Mode Input
        'very-light-gray': 'hsl(0, 0%, 98%)', // Light Mode Background
        'white': 'hsl(0, 0%, 100%)', // Dark Mode Text & Light Mode Elements
      },
      fontFamily: {
        'nunito': ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 