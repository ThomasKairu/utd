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
        primary: '#007cba',
        secondary: '#f39c12',
        'text-primary': '#2c3e50',
        'text-secondary': '#7f8c8d',
        'bg-light': '#ecf0f1',
        'dark-gray': '#34495e',
        'medium-gray': '#95a5a6',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}