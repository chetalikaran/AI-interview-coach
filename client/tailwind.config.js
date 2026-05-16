/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0b1020',
        panel: '#111827',
        accent: '#38bdf8',
        mint: '#34d399',
      },
      boxShadow: {
        glow: '0 20px 80px rgba(56, 189, 248, 0.18)',
      },
    },
  },
  plugins: [],
};
