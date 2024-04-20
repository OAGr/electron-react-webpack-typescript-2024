import tailwindForms from '@tailwindcss/forms';
import tailwindTypography from '@tailwindcss/typography';
import tailwindSquiggle from '@quri/squiggle-components/tailwind-plugin';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/**.{html,jsx,tsx,css}',
    './src/renderer/components/Application.tsx',
    './src/renderer/styles/app.css',
    './src/main',
    './**/*.html',
    './**/*.css',
  ],
  theme: {},
  variants: {},
  plugins: [
    tailwindSquiggle,
    tailwindTypography,
    tailwindForms({
      strategy: 'class', // strategy: 'base' interferes with react-select styles
    }),
  ],
};
