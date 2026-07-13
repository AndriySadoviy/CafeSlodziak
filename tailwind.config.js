/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          'dark-chocolate': '#2F0E09',
          'orange-zest': '#F86E04',
          'caramel-mousse': '#D3A16A',
          'espresso': '#4C1D13',
          'light-cream': '#FEF7EE',
          'orange-light': '#FFF4E8',
        }
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}