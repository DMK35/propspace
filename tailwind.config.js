// tailwind.config.js
// This tells Tailwind which files to scan for class names like "bg-blue-500"
// If a file isn't listed here, Tailwind won't generate styles used inside it.

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  plugins: [],
};