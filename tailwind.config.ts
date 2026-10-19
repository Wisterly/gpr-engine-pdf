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
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          dark: "#08080b",        // Ônix / Obsidian puro
          panel: "#0f0f15",       // Painel escuro nobre
          card: "#15151f",        // Superfície de card escuro
          cardBorder: "#2a2318",  // Borda refinada com tom ouro envelhecido / bronze
          borderGold: "rgba(245, 158, 11, 0.28)",
          accent: "#f59e0b",      // Dourado Nobre
          accentHover: "#d97706", // Âmbar Intenso
          orange: "#f97316",      // Laranja Real
          orangeHover: "#ea580c",
          gold: "#eab308",        // Ouro Vivo
          goldLight: "#fde68a",   // Champanhe / Marfim
          bronze: "#b45309",      // Bronze
          amber: "#f59e0b",
          emerald: "#10b981",
          rose: "#f43f5e",
          purple: "#a855f7",
          cyan: "#06b6d4",
          muted: "#9ca3af",       // Cinza neutro elegante
          mutedGold: "#a3907c",   // Muted dourado sutil
          text: "#fbfbfb",        // Branco puro suave
        },
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
        goldGlow: "0 0 25px -4px rgba(245, 158, 11, 0.28)",
        goldGlowLg: "0 0 40px -2px rgba(245, 158, 11, 0.4)",
        orangeGlow: "0 0 25px -4px rgba(249, 115, 22, 0.3)",
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #d97706 100%)',
        'gold-metallic': 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #b45309 100%)',
        'dark-luxury': 'radial-gradient(ellipse at top, #1c1813 0%, #08080b 70%)',
      },
    },
  },
  plugins: [],
};

export default config;
