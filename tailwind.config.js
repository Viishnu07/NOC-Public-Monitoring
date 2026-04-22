/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',   /* Deep midnight indigo */
        card: '#0f172a',         /* Dark slate for cards */
        border: '#1e293b',       /* Subtle dark border */
        success: '#10b981',      /* Vibrant Neon Mint */
        danger: '#f43f5e',       /* Vibrant Neon Rose */
        accent: '#38bdf8',       /* Vibrant Sky Blue */
        warning: '#eab308',      /* Vibrant Yellow */
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'], /* New font for headers/metrics */
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-bounce': 'bounce 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: 0.5, transform: 'scale(1)' },
          '100%': { opacity: 0.8, transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
