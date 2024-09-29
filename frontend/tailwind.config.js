/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0px, -3px)' },
          '50%': { transform: 'translate(2px, 3px)' },
        }
      },
      animation: {
        float: 'float 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}