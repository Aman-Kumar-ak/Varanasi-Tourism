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
        // Custom color palette from design
        primary: {
          blue: "#00ABE7",      // Fresh Sky - Login/Register, primary buttons
          orange: "#FE9000",    // Deep Saffron - Main body accents, CTAs
          teal: "#5B9279",      // Jungle Teal - Success states, secondary actions
          dark: "#183446",      // Deep Space Blue - Headers, text, dark elements
        },
        background: {
          parchment: "#EDE6E3", // Parchment - Main body background, cards
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

