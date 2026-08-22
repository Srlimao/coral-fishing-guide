/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cg: {
          bg: '#13181b',
          card: '#f7f2e8',
          subtle: '#ede6db',
          border: '#e2d3be',
          text: '#5a4627',
          muted: '#8c785b',
          accent: '#d89e43',
          coral: '#e76f51',
          gifting: '#ed7b67',
          teal: '#2a9d8f',
          spring: '#f472b6',
          summer: '#f59e0b',
          fall: '#f97316',
          winter: '#38bdf8',
          osmium: '#c084fc'
        },
        merino: {
          DEFAULT: '#f7f2e8',
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#ede6db',
          300: '#dabf97',
          800: '#774c35',
          900: '#613f2d',
          950: '#342016'
        }
      },
      fontFamily: {
        coral: ['QTVagaRound', 'Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['QTVagaRound', 'Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
