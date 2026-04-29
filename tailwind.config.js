/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211b",
        saffron: "#f59e0b",
        mint: "#0f766e",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 33, 27, 0.08)",
      },
    },
  },
  plugins: [],
};

module.exports = config;
