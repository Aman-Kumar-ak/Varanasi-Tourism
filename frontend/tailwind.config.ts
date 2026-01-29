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
        primary: {
          gold: "#FFB800",
          saffron: "#FF6B35",
          deepOrange: "#FF8C00",
          blue: "#1E3A8A",
          teal: "#5B9279",
          dark: "#1A1A2E",
          maroon: "#8B0000",
        },
        background: {
          parchment: "#FFF8DC",
          cream: "#FFF8E7",
          white: "#FFFFFF",
          gradient: { start: "#FFF8DC", end: "#FFF8E7" },
        },
        temple: {
          gold: { light: "#FFD700", DEFAULT: "#FFB800", dark: "#D4AF37" },
          saffron: { light: "#FF8C42", DEFAULT: "#FF6B35", dark: "#E55A2B" },
        },
        premium: {
          peach: "#FDF6ED",
          "peach-deep": "#F5E6D8",
          teal: "#0F766E",
          "teal-light": "#14B8A6",
          orange: "#C2410C",
          "orange-soft": "#EA580C",
          "section-text": "#1E293B",
          "section-muted": "#64748B",
        },
      },
      boxShadow: {
        'temple': '0 10px 40px rgba(255, 184, 0, 0.15)',
        'temple-lg': '0 20px 60px rgba(255, 184, 0, 0.2)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'premium': '0 4px 24px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255,255,255,0.5)',
        'premium-hover': '0 12px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'gradient-temple': 'linear-gradient(135deg, #FFD700 0%, #FFB800 50%, #FF6B35 100%)',
        'gradient-sacred': 'linear-gradient(135deg, #FFF8DC 0%, #FFF8E7 100%)',
        'gradient-overlay': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
        'gradient-premium-peach': 'linear-gradient(160deg, #FDF6ED 0%, #F5E6D8 50%, #FFF8E7 100%)',
        'gradient-premium-teal': 'linear-gradient(165deg, #0F766E 0%, #0D9488 50%, #0F766E 100%)',
        'gradient-premium-orange': 'linear-gradient(165deg, #C2410C 0%, #EA580C 40%, #B45309 100%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

