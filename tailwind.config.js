/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0E14',
        surface: 'rgba(18,24,38,0.88)',
        text: '#F8FAFC',
        indigo: {
          500: '#6366F1',
          400: '#818CF8',
          600: '#4F46E5',
        },
        emerald: {
          500: '#10B981',
          400: '#34D399',
        },
      },
      fontFamily: {
        heading: ['Bebas Neue', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
}
