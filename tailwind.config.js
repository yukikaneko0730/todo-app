/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    fontFamily: {
      raleway: ["Raleway", "sans-serif"],
      cormorant: ["Cormorant Garamond", "serif"],
    },
    extend: {
      colors: {
        base: "#F9F5F0",
        surface: "#EFE7DD",
        accent: "#8B6F4E",
        secondary: "#CBAA8A",
        text: "#4E4035",
        success: "#A3B18A",
        warning: "#C86B48",
        error: "#A15C58",
        highlight: "#A78C70",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
