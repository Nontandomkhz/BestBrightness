/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#cc5500', // Burnt Orange
        'secondary-orange': '#b34700',
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #e67300, #cc5500)',
        'gradient-primary': 'linear-gradient(135deg, #cc5500, #b34700)',
        'gradient-rainbow': 'linear-gradient(135deg, #cc5500, #b34700, #8b5cf6)',
      },
      backdropBlur: {
        'xs': '2px',
        '4xl': '72px',
        '5xl': '96px',
      },
      backdropSaturate: {
        '25': '.25',
        '75': '.75',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(204, 85, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(204, 85, 0, 0.8)' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        // Light glass
        '.glass-light': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-medium': {
          'background': 'rgba(255, 255, 255, 0.15)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.25)',
        },
        '.glass-strong': {
          'background': 'rgba(255, 255, 255, 0.25)',
          'backdrop-filter': 'blur(24px)',
          '-webkit-backdrop-filter': 'blur(24px)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
        },

        // Dark glass
        '.glass-dark-light': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark-medium': {
          'background': 'rgba(0, 0, 0, 0.15)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.15)',
        },
        '.glass-dark-strong': {
          'background': 'rgba(0, 0, 0, 0.25)',
          'backdrop-filter': 'blur(24px)',
          '-webkit-backdrop-filter': 'blur(24px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },

        // Colored glass effects
        '.glass-orange': {
          'background': 'rgba(204, 85, 0, 0.2)',
          'backdrop-filter': 'blur(20px) saturate(1.5)',
          '-webkit-backdrop-filter': 'blur(20px) saturate(1.5)',
          'border': '1px solid rgba(204, 85, 0, 0.3)',
        },

        // Hover
        '.glass-hover': {
          'transition': 'all 0.3s ease',
        },
        '.glass-hover:hover': {
          'background': 'rgba(255, 255, 255, 0.2)',
          'transform': 'translateY(-2px)',
          'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.2)',
        },
      });
    },
  ],
}
