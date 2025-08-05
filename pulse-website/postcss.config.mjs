/**
 * PostCSS configuration for TailwindCSS in Next.js 15
 * GitHub Pages requires plain CSS output, so we also add autoprefixer.
 */

const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
