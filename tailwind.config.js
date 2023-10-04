/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent-color)',
        'dark-accent': 'var(--dark-accent-color)'
      },
      fontFamily: {
        title: 'Gabarito, Inter, sans-serif',
        body: 'Poppins, Inter, sans-serif'
      }
    }
  },
  plugins: []
}
