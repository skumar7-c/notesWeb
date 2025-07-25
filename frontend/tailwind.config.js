/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  darkMode: 'class', // 👈 Required for toggle
  theme: {
    extend: {
      colors: {
        day: {
          300: '#D1D5DB' // Example gray value, update as needed
        },
        primary: '#2563EB',
        secondary: '#6B7280'
      },
    },
  },
  plugins: [],
}
