/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        primaryHover: "var(--primary-hover)",
        primaryLight: "var(--primary-light)",
        secondary: "#f0a22e",
        muted: "#f1f4f6",
        footerDark: "#0b0f14",
      },
    },
  },
  plugins: [],
};
