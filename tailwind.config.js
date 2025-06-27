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
        // Logo-Based Primary Colors (easily adaptable)
        logo: {
          primary: '#0ea5e9',      // Update this to match your logo's main color
          secondary: '#8b5cf6',    // Update this to match your logo's secondary color  
          accent: '#00ffff',       // Update this to match your logo's accent color
          background: '#1a1a1a',   // Background that complements your logo
          text: '#ffffff',         // Text color that works with your logo
        },

        // Extended Primary Colors (based on logo.primary)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Matches logo.primary
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49'
        },
        
        // Logo-Harmonized Accent Colors
        accent: {
          electric: '#00ffff',     // Can match logo accent
          neon: '#39ff14',         // Complementary green
          purple: '#8b5cf6',       // Can match logo secondary
          orange: '#f97316',       // Warm contrast
          gold: '#fbbf24',         // Luxury accent
          silver: '#94a3b8',       // Neutral metallic
        },

        // Adaptive Dark Theme Colors
        dark: {
          bg: '#000000',           // Pure black background
          surface: '#0a0a0a',      // Card backgrounds
          elevated: '#1a1a1a',     // Elevated surfaces
          border: '#2a2a2a',       // Borders
          muted: '#404040',        // Muted elements
          hover: '#2d2d2d',        // Hover states
        },

        // Logo-Adaptive Text Colors
        text: {
          primary: '#ffffff',      // Primary text
          secondary: '#a3a3a3',    // Secondary text
          muted: '#737373',        // Muted text
          accent: '#00ffff',       // Accent text
          onLogo: '#ffffff',       // Text on logo background
        },

        // Semantic Colors
        success: '#22c55e',
        warning: '#f59e0b', 
        danger: '#ef4444',
        info: '#3b82f6',

        // Legacy colors for backward compatibility
        infinita: {
          electric: '#00ffff',
          neon: '#39ff14',
          purple: '#8b5cf6',
          orange: '#f97316',
          gold: '#fbbf24',
        },
        civic: {
          blue: '#0ea5e9',
          green: '#39ff14',
          orange: '#f97316',
          purple: '#8b5cf6',
          gray: '#737373',
        },
        governance: {
          primary: '#0ea5e9',
          secondary: '#22c55e',
          accent: '#00ffff',
          neutral: '#404040',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        display: ['Lexend', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-light': 'bounce 1s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff' },
          '100%': { boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, theme("colors.logo.primary") 0%, theme("colors.logo.secondary") 100%)',
        'gradient-accent': 'linear-gradient(135deg, theme("colors.logo.accent") 0%, theme("colors.accent.neon") 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, theme("colors.logo.background") 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
        'gradient-logo': 'linear-gradient(135deg, theme("colors.logo.primary") 0%, theme("colors.logo.accent") 50%, theme("colors.logo.secondary") 100%)',
        'gradient-hero': 'linear-gradient(135deg, theme("colors.logo.background") 0%, rgba(0, 0, 0, 0.8) 100%)',
      },
      animationDelay: {
        '200': '200ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
        '2000': '2000ms',
        '4000': '4000ms',
      },
    },
  },
  plugins: [],
}