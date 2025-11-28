/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0a837f",
        primaryDark: "#066b64",
        secondary: "#f0a22e",
        muted: "#f1f4f6",
        footerDark: "#0b0f14",
      },
    },
  },
  plugins: [],
};
