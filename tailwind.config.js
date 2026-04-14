/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        noir:  '#0a0705',
        or:    '#D4AF37',
        creme: '#faf6ee',
        card:  '#1a1310',
      },
      fontFamily: {
        bebas:    ['Bebas Neue', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        dm:       ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
