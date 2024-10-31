/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js}"
  ],
  theme: {
    fontFamily: {
      'sans': ['Poppins']
    },
    extend: {
      backgroundImage: {
        "home": "url('/assets/header background.png')"
      }
    },
  },
  plugins: [],
}

