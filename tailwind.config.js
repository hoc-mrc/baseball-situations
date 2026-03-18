export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'field-green': '#3a7d44',
        'field-dirt': '#c8a96e',
        'navy': '#0f172a',
        // Brand theme — Easton/modern baseball energy
        'brand-pink':       '#e91e8c',
        'brand-pink-light': '#ff5cb8',
        'brand-lime':       '#b5f23d',
        'brand-lime-dark':  '#8bc828',
        'brand-cyan':       '#00d4ff',
        'bg-base':          '#0d0d0f',
        'surface':          '#1a1a2e',
        'surface-2':        '#16213e',
      }
    },
  },
  plugins: [],
}
