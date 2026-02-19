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
        chatgpt: {
          sidebar: "#202123",
          main: "#343541",
          input: "#40414f",
          user: "#343541",
          ai: "#444654",
        }
      }
    },
  },
  plugins: [],
}
