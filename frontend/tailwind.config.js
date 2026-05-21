// FILE: frontend/tailwind.config.js
// Tailwind config — extend with our brand colors

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:    '#0d1520',
        'navy-2':'#162032',
        'navy-3':'#1e2d42',
        cream:   '#f4efe6',
        'cream-2':'#ebe5da',
        rust:    '#c84b2f',
        'rust-h':'#e05a38',
        gold:    '#c9a84c',
        muted:   '#7a8fa8',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
