/** @type {import('tailwindcss').Config} */
// NOTE: This project uses Tailwind CSS v4. Custom colors are defined via @theme
// in src/styles/global.css — this file documents the brand color palette.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1a2744',
          accent: '#2563eb',
          dark: '#0f1827',
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
