/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-focus': 'rgb(var(--color-primary-focus) / <alpha-value>)',
        gold: {
          light: 'rgb(var(--color-gold-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-gold-default) / <alpha-value>)',
          dark: 'rgb(var(--color-gold-dark) / <alpha-value>)',
        },
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'header-background': 'rgb(var(--color-header-background) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'dark-header-background': 'rgb(var(--color-dark-header-background) / <alpha-value>)',
        'dark-background': 'rgb(var(--color-dark-background) / <alpha-value>)',
        'dark-surface': 'rgb(var(--color-dark-surface) / <alpha-value>)',
        'dark-text-primary': 'rgb(var(--color-dark-text-primary) / <alpha-value>)',
        'dark-text-secondary': 'rgb(var(--color-dark-text-secondary) / <alpha-value>)',
      }
    }
  },
  plugins: [],
}
