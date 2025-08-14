/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,css}",
    "./components/**/*.{js,ts,jsx,tsx,css}",
    "./app/**/*.{js,ts,jsx,tsx,css}",
    "./src/**/*.{js,ts,jsx,tsx,css}", // 👈 thêm dòng này
    "./styles/**/*.{js,ts,jsx,tsx,css}" // 👈 thêm dòng này
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
