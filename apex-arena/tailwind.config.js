/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        sans: ["Rajdhani", "sans-serif"],
      },
      colors: {
        gold: "#f59e0b",
        cosmic: "#0f0a1a",
      },
    },
  },
  plugins: [],
};
