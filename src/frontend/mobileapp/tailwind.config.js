/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#3b82f6', dark: '#2563eb', light: '#60a5fa' },
        secondary: { DEFAULT: '#f97316', dark: '#ea580c', light: '#fb923c' },
      },
    },
  },
  plugins: [],
}
