// Logo-Inspired Color Palette for CivicAI
// Updated to blend with user's custom logo
export const colors = {
  // Logo-Based Primary Colors (adaptable)
  logo: {
    primary: '#0ea5e9',      // Extracted from logo - update this
    secondary: '#8b5cf6',    // Complementary to logo - update this  
    accent: '#00ffff',       // Highlight color from logo - update this
    background: '#1a1a1a',   // Background that complements logo
    text: '#ffffff',         // Text color that works with logo
  },

  // Extended Primary Colors
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
    electric: '#00ffff',     // Electric cyan - can match logo accent
    neon: '#39ff14',         // Neon green - complementary 
    purple: '#8b5cf6',       // Deep purple - can match logo secondary
    orange: '#f97316',       // Vibrant orange - warm contrast
    gold: '#fbbf24',         // Digital gold - luxury accent
    silver: '#94a3b8',       // Silver - neutral metallic
  },

  // Adaptive Dark Theme Colors
  dark: {
    bg: '#000000',           // Pure black background
    surface: '#0a0a0a',      // Card backgrounds
    elevated: '#1a1a1a',     // Elevated surfaces - matches logo.background
    border: '#2a2a2a',       // Borders
    muted: '#404040',        // Muted elements
    hover: '#2d2d2d',        // Hover states
  },

  // Logo-Adaptive Text Colors
  text: {
    primary: '#ffffff',      // Primary text - matches logo.text
    secondary: '#a3a3a3',    // Secondary text
    muted: '#737373',        // Muted text
    accent: '#00ffff',       // Accent text - matches logo.accent
    onLogo: '#ffffff',       // Text that sits on logo background
  },

  // Semantic Colors
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b', 
    danger: '#ef4444',
    info: '#3b82f6',
  },

  // Logo-Inspired Gradients
  gradients: {
    primary: 'linear-gradient(135deg, var(--logo-primary) 0%, var(--logo-secondary) 100%)',
    accent: 'linear-gradient(135deg, var(--logo-accent) 0%, var(--accent-neon) 100%)',
    dark: 'linear-gradient(135deg, #000000 0%, var(--logo-background) 100%)',
    card: 'linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
    logo: 'linear-gradient(135deg, var(--logo-primary) 0%, var(--logo-accent) 50%, var(--logo-secondary) 100%)',
  }
};

// CSS Custom Properties for easy theme switching
export const cssVariables = {
  '--logo-primary': colors.logo.primary,
  '--logo-secondary': colors.logo.secondary,
  '--logo-accent': colors.logo.accent,
  '--logo-background': colors.logo.background,
  '--logo-text': colors.logo.text,
  '--accent-electric': colors.accent.electric,
  '--accent-neon': colors.accent.neon,
  '--accent-purple': colors.accent.purple,
  '--accent-orange': colors.accent.orange,
  '--accent-gold': colors.accent.gold,
};

export default colors;
