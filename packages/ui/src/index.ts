/**
 * Shared Design Tokens & Theme Definitions for NITI AI
 */
export const DESIGN_TOKENS = {
  colors: {
    brand: {
      primary: "#F07000",
      light: "#FF8800",
      dark: "#C85800",
      surface: "rgba(240, 112, 0, 0.12)",
    },
    teal: {
      primary: "#14B8A6",
      light: "#2DD4BF",
      dark: "#0F766E",
      surface: "rgba(20, 184, 166, 0.12)",
    },
    glass: {
      lightBg: "rgba(255, 255, 255, 0.08)",
      darkBg: "rgba(15, 23, 42, 0.75)",
      border: "rgba(255, 255, 255, 0.12)",
      subtleBorder: "rgba(255, 255, 255, 0.06)",
    }
  },
  typography: {
    fontSans: "Inter, system-ui, sans-serif",
    fontDevanagari: "Noto Sans Devanagari, sans-serif",
    fontMono: "Geist Mono, monospace",
  },
  animation: {
    spring: "cubic-bezier(0.16, 1, 0.3, 1)",
    fast: "150ms",
    normal: "300ms",
    slow: "500ms"
  }
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
