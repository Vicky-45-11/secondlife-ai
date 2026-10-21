import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0C0C0C",
        "brand-dark": "#0C0C0C",
        "brand-light": "#D7E2EA",
        "brand-muted": "rgba(215, 226, 234, 0.65)",
        "brand-white": "#FFFFFF",
        surface: "#121418",
        "surface-raised": "#181B22",
        "surface-card": "rgba(18, 20, 26, 0.75)",
        "surface-glass": "rgba(18, 20, 26, 0.65)",
        border: "rgba(215, 226, 234, 0.12)",
        "border-light": "rgba(215, 226, 234, 0.2)",
        "border-accent": "rgba(204, 255, 0, 0.35)",
        lime: {
          300: "#e5ff66",
          400: "#d4ff1a",
          500: "#CCFF00",
          600: "#b3e600",
        },
        cyan: {
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#00E5FF",
          600: "#00b8cc",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          bright: "#00FF88",
        },
        // SecondLife editorial palette: forest, charcoal, ivory and natural tones
        forest: {
          950: "#07120D",
          900: "#0B1A13",
          800: "#10261C",
          700: "#173527",
          600: "#214A37",
          500: "#2E6249",
        },
        charcoal: {
          950: "#0A0B0A",
          900: "#111311",
          800: "#1A1D1A",
          700: "#262A26",
        },
        ivory: {
          50: "#FBF9F3",
          100: "#F4F0E5",
          200: "#E8E2D2",
          300: "#D6CDB6",
        },
        moss: "#7C8B5E",
        clay: "#B48A5E",
        stone: {
          400: "#9A9C8F",
          500: "#76786C",
          600: "#55574D",
        },
      },
      maxWidth: {
        page: "88rem",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Instrument Serif", "Georgia", "serif"],
        editorial: ["var(--font-display)", "Instrument Serif", "Georgia", "serif"],
        display: ["var(--font-display)", "Instrument Serif", "Georgia", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        kanit: ["var(--font-kanit)", "Kanit", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-lime": "0 0 25px rgba(204, 255, 0, 0.25)",
        "glow-lime-lg": "0 0 50px rgba(204, 255, 0, 0.35)",
        "glow-cyan": "0 0 25px rgba(0, 229, 255, 0.25)",
        "glow-emerald": "0 0 25px rgba(0, 255, 136, 0.25)",
        "glass-inner": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanLine 3s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        scanLine: {
          "0%, 100%": { transform: "translateY(-100%)", opacity: "0" },
          "50%": { transform: "translateY(100%)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
