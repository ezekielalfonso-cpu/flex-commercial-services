/** @type {import('tailwindcss').Config} */
// NOTE: This project uses Tailwind CSS v4. Custom colors are defined via @theme
// in src/styles/global.css — this file documents the brand color palette.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#141414',
          accent: '#E8394A',
          'accent-dark': '#C41E3A',
          dark: '#0a0a0a',
          light: '#f1f5f9',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Mulish', 'system-ui', 'sans-serif'],
      }
    }
  }
}
