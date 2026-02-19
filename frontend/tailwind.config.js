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
        fintech: {
          bg: '#0f172a',
          sidebar: '#020617',
          card: '#1e293b',
          input: '#1e293b',
          up: '#22c55e',
          down: '#ef4444',
          accent: '#3b82f6'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
