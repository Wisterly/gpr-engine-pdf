import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        obsidian: {
          bg: "#0A0A0C",        // Preto Obsidiana puro
          panel: "#121316",     // Grafite Escuro Fosco 1
          panelDark: "#18191E", // Grafite Escuro Fosco 2
          border: "#26272F",    // Borda e divisória
          borderGold: "rgba(212, 175, 55, 0.18)",
          card: "#15161C",
          hover: "#1F2027",
        },
        gold: {
          metallic: "#D4AF37",  // Dourado Metálico clássico
          amber: "#F59E0B",     // Âmbar claro
          light: "#FDE047",
        },
        orange: {
          vibrant: "#FF7A00",   // Laranja Vibrante
          primary: "#FF6B00",
        },
        brand: {
          dark: "#0A0A0C",
          panel: "#121316",
          card: "#18191E",
          cardBorder: "#26272F",
          accent: "#D4AF37",
          accentHover: "#FF6B00",
          orange: "#FF7A00",
          gold: "#D4AF37",
          amber: "#F59E0B",
          emerald: "#10B981",
          rose: "#EF4444",
          muted: "#8E919F",
          mutedGold: "#A39371",
          text: "#F5F5F7",
        },
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(0, 0, 0, 0.8)",
        goldGlow: "0 0 20px -3px rgba(212, 175, 55, 0.25)",
        goldGlowLg: "0 0 35px -2px rgba(212, 175, 55, 0.35)",
        orangeGlow: "0 0 25px -4px rgba(255, 107, 0, 0.3)",
      },
      backgroundImage: {
        'gradient-orange-gold': 'linear-gradient(135deg, #FF6B00 0%, #D4AF37 100%)',
        'gradient-gold-metallic': 'linear-gradient(135deg, #FDE047 0%, #D4AF37 50%, #B45309 100%)',
        'gradient-tab-active': 'linear-gradient(to right, #FF6B00, #D4AF37)',
      },
    },
  },
  plugins: [],
};

export default config;
