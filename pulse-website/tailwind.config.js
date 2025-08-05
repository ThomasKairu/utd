/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pulse-red': '#d32f2f',
        'pulse-red-dark': '#b71c1c',
        'pulse-red-light': '#ef5350',
        primary: '#d32f2f',
        secondary: '#f39c12',
        'text-primary': '#333333',
        'text-secondary': '#666666',
        'bg-light': '#f5f5f5',
        'dark-gray': '#222222',
        'medium-gray': '#95a5a6',
        'border-gray': '#e0e0e0',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      animation: {
        'scroll-left': 'scroll-left 30s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'modern': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'modern-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}