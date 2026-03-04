/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        "dr-tri": {
          primary: "#2d5a3d",
          "primary-hover": "#3a6f4a",
          "light-green": "#e8f0eb",
          background: "#f8f6f3",
          dark: "#1a1a1a",
          muted: "#6b7280",
          border: "#d1d5db",
        },
      },
      borderRadius: {
        "dr-tri": "0.75rem",
        "dr-tri-lg": "1rem",
      },
    },
  },
  plugins: [],
}
