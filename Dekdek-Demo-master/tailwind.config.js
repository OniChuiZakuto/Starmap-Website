/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ph: {
          blue: '#0038A8',
          red: '#CE1126',
          yellow: '#FCD116',
          'blue-light': '#1a4fc8',
          'red-light': '#e8192c',
        }
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 5px #0038A8' }, '50%': { boxShadow: '0 0 20px #0038A8, 0 0 40px #0038A8' } },
        slideInRight: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      }
    }
  },
  plugins: []
}
