import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        't1-red': '#E4002B',
        't1-dark': '#111111',
        't1-gray': '#222222',
        't1-text': '#f4f4f4',
      },
      fontFamily: {
        't1-body': ['Inter', 'sans-serif'],
        't1-heading': ['Oswald', 'sans-serif'],
      }
    }
  },
  plugins: []
}

export default config