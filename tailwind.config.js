/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#153BAA',
        secondary: '#00BFFF',
        border: '#e5e7eb',
        muted: '#f3f4f6',
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
