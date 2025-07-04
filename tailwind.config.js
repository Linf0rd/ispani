/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neo-brutalism': '8px 8px 0 0 #000',
        'neo-brutalism-lg': '12px 12px 0 0 #000',
      },
      borderWidth: {
        3: '3px',
        6: '6px',
        8: '8px',
      },
      colors: {
        bybYellow: '#FFE066',
        bybPink: '#FF6F91',
        bybBlue: '#6A89CC',
        bybGreen: '#6FCF97',
        bybBlack: '#222',
        bybWhite: '#fff',
      },
      borderRadius: {
        'neo': '1.5rem',
      },
    },
  },
  plugins: [],
}
