import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ─── Design Tokens ────────────────────────────────────────────
      colors: {
        // Brand – Deep Indian Saffron to Teal
        brand: {
          50:  "#fff8f0",
          100: "#ffe8cc",
          200: "#ffcd99",
          300: "#ffaa55",
          400: "#ff8800",
          500: "#f07000", // primary
          600: "#c85800",
          700: "#9e4200",
          800: "#6e2d00",
          900: "#3d1800",
          950: "#1e0900",
        },
        teal: {
          50:  "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6", // accent
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        // Surface / Glass
        glass: {
          white: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.12)",
          dark:  "rgba(0,0,0,0.30)",
        },
      },

      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-cal-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
        devanagari: ["var(--font-noto-sans-devanagari)", ...fontFamily.sans],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },

      borderRadius: {
        "2xl":  "1rem",
        "3xl":  "1.5rem",
        "4xl":  "2rem",
      },

      backgroundImage: {
        "gradient-radial":     "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":      "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":       "linear-gradient(135deg, #ff8800 0%, #14b8a6 100%)",
        "glass-gradient":      "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
        "card-glass":          "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
      },

      boxShadow: {
        glass:      "0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
        "glass-lg": "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
        "glow-sm":  "0 0 12px rgba(240,112,0,0.35)",
        "glow-md":  "0 0 24px rgba(240,112,0,0.45)",
        "glow-teal":"0 0 24px rgba(20,184,166,0.40)",
      },

      animation: {
        "fade-in":        "fadeIn 0.4s ease-out",
        "slide-up":       "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.16,1,0.3,1)",
        "scale-in":       "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)",
        "shimmer":        "shimmer 2.5s linear infinite",
        "pulse-glow":     "pulseGlow 2s ease-in-out infinite",
        "float":          "float 3s ease-in-out infinite",
        "border-beam":    "borderBeam 4s linear infinite",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(20px)", opacity: "0" },
          to:   { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          from: { transform: "translateX(24px)", opacity: "0" },
          to:   { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          from: { transform: "scale(0.95)", opacity: "0" },
          to:   { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 12px rgba(240,112,0,0.3)" },
          "50%":     { boxShadow: "0 0 28px rgba(240,112,0,0.6)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-6px)" },
        },
        borderBeam: {
          "0%":   { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },

      backdropBlur: {
        xs: "2px",
      },

      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};

export default config;
