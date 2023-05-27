/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-color": "#F6F6F6",
        "text-color": "#290521",
        "accent-color": "#FFD600",
        "gradient-color": "linear-gradient(90deg, #7216F4 0%, #FFD600 100%)",
        "button-primary-color": "#7216F4",
        "button-secondary-color": "#FFFFFF"
      }
    },
    screens: {
      'xs': '300px',
      's': '450px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '3000px'
    }
  },
  plugins: [],
}
