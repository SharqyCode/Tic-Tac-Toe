/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
    "./src/**.{html,js}",
    "./title.html"
  ],
  theme: {
    fontFamily: {
      'Inter': ['Inter'],
    },
    extend: {
      colors: {
        'main': '#26355D',
        'shadow': '#182137',
        'deep': '#0F1422',
        'accent': '#AF47D2',
        'yellow': '#FFDB00',
        'red': '#F02D2D',
      },
      boxShadow: {
        'btn': '0 0px 10px 5px rgba(0, 0, 0, 0.3)',
      },
    },
    plugins: [],

  }
}