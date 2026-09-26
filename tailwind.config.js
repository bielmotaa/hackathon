/** @type {import('tailwindcss').Config} */
const  { colors } = require("./src/styles/colors")
const  { fontFamily, fontSize } = require("./src/styles/fonts")
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily,
      fontSize
    },
  },
  plugins: [],
};
