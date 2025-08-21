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
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        dmserif: ['"DM Serif Display"', 'serif'],
      },
      colors: {
        brand: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          line: "var(--line)",
          text: "var(--text)",
          muted: "var(--text-muted)",
          accent: "var(--accent)", 
        },

        
        soft: {
          background: "#F5F5F4", 
          text: "#3C3C3C",       
          accent: "#9AA0A6",     
          border: "#E5E4E2",
          muted: "#D7D7D7",
        },
        dark: {
          background: "#1F1F1F",
          text: "#ECECEC",
          accent: "#6B6B6B",     
          border: "#3A3A3A",
          muted: "#2C2C2C",
        },
      },
      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
