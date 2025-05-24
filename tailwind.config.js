/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
      colors: {
        soft: {
          background: "#FAFAFA",
          text: "#4A4A4A",
          accent: "#A78E74",      // ミルクティー系
          border: "#E6E6E6",
          muted: "#D9D9D9",
        },
        dark: {
          background: "#2F2F2F",
          text: "#ECECEC",
          accent: "#A78E74",
        },
      },
    },
  },
  darkMode: 'class', // クラスでダークモード制御
  plugins: [],
};
