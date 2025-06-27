/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Logo-Based Colors (extracted from your logo)
        'logo-primary': '#00b4d8',      // Cyan blue from logo
        'logo-secondary': '#0077b6',    // Darker blue from logo  
        'logo-accent': '#00f5ff',       // Electric cyan accent
        'logo-electric': '#00ffff',     // Electric cyan (Infinita-inspired)
        'logo-dark': '#003054',         // Dark blue from logo
        'logo-mint': '#7fffd4',         // Mint complement
        'logo-gold': '#ffd700',         // Gold accent for highlights
        'logo-orange': '#ff6b1a',       // Brighter sunny orange from logo (warm accent)
        'logo-orange-bright': '#ff5500', // Even brighter orange variant

        // Infinita City Inspired Colors
        'infinita-neon': '#39ff14',     // Bright neon green
        'infinita-purple': '#8a2be2',   // Blue violet
        'infinita-pink': '#ff1493',     // Deep pink
        'infinita-orange': '#ff4500',   // Orange red

        // Dark Theme Base
        'dark-bg': '#000000',           // Pure black background
        'dark-surface': '#0a0a0a',      // Card/surface background
        'dark-elevated': '#1a1a1a',     // Elevated surfaces
        'dark-border': '#2a2a2a',       // Border colors
        'dark-muted': '#404040',        // Muted elements

        // Text Colors
        'text-primary': '#ffffff',      // Primary text (white)
        'text-secondary': '#b3b3b3',    // Secondary text (light gray)
        'text-muted': '#666666',        // Muted text
        'text-accent': '#00ffff',       // Accent text (electric)

        // Semantic Colors
        'success': '#22c55e',
        'warning': '#f59e0b', 
        'danger': '#ef4444',
        'info': '#3b82f6',
      },

      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(10,10,10,0.8) 0%, rgba(26,26,26,0.9) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #00b4d8 0%, #00f5ff 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00ffff 0%, #39ff14 100%)',
        'gradient-warm': 'linear-gradient(135deg, #ff6b1a 0%, #ff5500 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #00b4d8 0%, #ff6b1a 50%, #00f5ff 100%)',
      },

      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { textShadow: '0 0 5px #00ffff, 0 0 10px #00ffff' },
          '100%': { textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      boxShadow: {
        'glow': '0 0 20px rgba(0, 255, 255, 0.3)',
        'electric': '0 0 30px rgba(0, 245, 255, 0.5)',
        'warm-glow': '0 0 25px rgba(255, 107, 26, 0.4)',
        'sunset-glow': '0 0 35px rgba(255, 107, 26, 0.3), 0 0 60px rgba(0, 255, 255, 0.2)',
      },
    },
  },
  plugins: [],
}
