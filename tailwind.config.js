/** @type {import('tailwindcss').Config} */


module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [ {mytheme: {}} ],
  },
};