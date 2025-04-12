/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#6366f1",
        success: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
        info: "#06b6d4",
        light: "#f3f4f6",
        dark: "#1f2937",
      },
    },
  },
  plugins: [],
} 