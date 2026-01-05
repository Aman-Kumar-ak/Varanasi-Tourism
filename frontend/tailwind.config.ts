import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // Temple-inspired color palette
        primary: {
          gold: "#FFB800",       // Sacred Gold - Primary accents, highlights
          saffron: "#FF6B35",    // Saffron Orange - CTAs, important elements
          deepOrange: "#FF8C00",  // Deep Saffron - Hover states
          blue: "#1E3A8A",       // Sacred Blue - Trust, spirituality
          teal: "#5B9279",       // Jungle Teal - Success, nature
          dark: "#1A1A2E",       // Deep Space - Headers, text
          maroon: "#8B0000",     // Sacred Red - Important highlights
        },
        background: {
          parchment: "#FFF8DC",  // Warm Yellow Parchment - Main background
          cream: "#FFF8E7",      // Light Cream - Card backgrounds (lighter)
          white: "#FFFFFF",
          gradient: {
            start: "#FFF8DC",
            end: "#FFF8E7",
          },
        },
        temple: {
          gold: {
            light: "#FFD700",
            DEFAULT: "#FFB800",
            dark: "#D4AF37",
          },
          saffron: {
            light: "#FF8C42",
            DEFAULT: "#FF6B35",
            dark: "#E55A2B",
          },
        },
      },
      boxShadow: {
        'temple': '0 10px 40px rgba(255, 184, 0, 0.15)',
        'temple-lg': '0 20px 60px rgba(255, 184, 0, 0.2)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      backgroundImage: {
        'gradient-temple': 'linear-gradient(135deg, #FFD700 0%, #FFB800 50%, #FF6B35 100%)',
        // Adjust percentages: 0% = top color, 100% = bottom color
        // Example: '#FFF8DC 0%, #FFF8DC 40%, #FFEAA7 100%' keeps top color visible longer
        'gradient-sacred': 'linear-gradient(135deg, #FFF8DC 0%, #FFF8E7 100%)',
        'gradient-overlay': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

