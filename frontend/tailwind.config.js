/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */

/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      tooltip: {
        colors: {
          DEFAULT: "rgba(0, 0, 0, 0.8)",
        },
      },
      colors: {
        c_tbar: "#a9c2d6",
        c_main: "#d4e1e8",
      },
    },
  },

  plugins: [],
};
