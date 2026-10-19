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
          dark: "#0b111e",
          panel: "#111b2d",
          card: "#16233b",
          cardBorder: "#23385d",
          accent: "#3b82f6",
          accentHover: "#2563eb",
          amber: "#f59e0b",
          emerald: "#10b981",
          rose: "#f43f5e",
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          muted: "#94a3b8",
          text: "#f8fafc",
        },
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(0, 0, 0, 0.45)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;
