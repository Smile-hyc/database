/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#10213f",
        pitch: "#0b6b53",
        gold: "#d8a939",
        mist: "#eef3f8"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(16, 33, 63, 0.12)"
      }
    }
  },
  plugins: []
};
