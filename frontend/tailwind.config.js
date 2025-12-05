/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1400px',
      '3xl': '1536px',
      '4xl': '1800px',
    },
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'Manrope', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
      },

      keyframes: {
        wave: {
          '0%': { height: '12px' },
          '25%': { height: '28px' },
          '50%': { height: '18px' },
          '75%': { height: '32px' },
          '100%': { height: '12px' },
        },
      },

      animation: {
        wave: 'wave 0.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
