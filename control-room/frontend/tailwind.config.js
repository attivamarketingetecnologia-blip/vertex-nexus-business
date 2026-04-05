/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vertex: {
          blue: '#0066FF',
          purple: '#8A2BE2',
          cyan: '#00D4FF',
          green: '#00FF88',
          amber: '#FFAA00',
          danger: '#FF3366',
          dark: '#0A0A0F',
          surface: '#121218',
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'particle': 'particle 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(0, 102, 255, 0.5)' },
          '50%': { 'box-shadow': '0 0 40px rgba(0, 102, 255, 0.8), 0 0 60px rgba(138, 43, 226, 0.6)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        particle: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--tx), var(--ty)) scale(0)', opacity: '0' },
        },
      },
      backgroundImage: {
        'holographic': 'linear-gradient(45deg, rgba(0, 102, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
        'grid': 'linear-gradient(rgba(0, 102, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 102, 255, 0.1) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}