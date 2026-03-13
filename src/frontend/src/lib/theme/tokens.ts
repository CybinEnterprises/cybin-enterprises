/**
 * Design Tokens - TypeScript Constants
 * Provides IDE autocomplete and type safety for design tokens
 */

export const tokens = {
  colors: {
    brand: {
      primary: "#00d4b8",
      accent: "#00d4b8",
      accentWarm: "#00d4b8",
    },
    dark: {
      background: "#00d4b8",
      surface: "#00d4b8",
      surfaceElevated: "#00d4b8",
      heroBg: "#00d4b8",
      textPrimary: "#ffffff",
      textSecondary: "#ffffff",
      textMuted: "rgba(255, 255, 255, 0.55)",
      textInverse: "#00d4b8",
      border: "rgba(255, 255, 255, 0.08)",
      borderSubtle: "rgba(255, 255, 255, 0.04)",
      borderAccent: "rgba(255, 255, 255, 0.12)",
      cardBg: "rgba(255, 255, 255, 0.03)",
      cardBorder: "rgba(255, 255, 255, 0.07)",
    },
    light: {
      background: "#ffffff",
      surface: "#f8fafc",
      surfaceElevated: "#ffffff",
      heroBg: "#f8fafc",
      textPrimary: "#00d4b8",
      textSecondary: "rgba(0, 212, 184, 0.75)",
      textMuted: "rgba(0, 212, 184, 0.55)",
      textInverse: "#ffffff",
      border: "#00d4b8",
      borderSubtle: "#f1f5f9",
      borderAccent: "rgba(0, 212, 184, 0.2)",
      cardBg: "rgba(0, 212, 184, 0.06)",
      cardBorder: "rgba(0, 212, 184, 0.15)",
    },
  },
  fonts: {
    display: "'Sora', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
    serif: "'Playfair Display', Georgia, serif",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "80px",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },
  transitions: {
    fast: "150ms ease",
    base: "200ms ease",
    slow: "300ms ease",
  },
} as const;

/** CSS variable names for dynamic usage */
export const cssVars = {
  colors: {
    background: "--color-background",
    surface: "--color-surface",
    surfaceElevated: "--color-surface-elevated",
    heroBg: "--color-hero-bg",
    textPrimary: "--color-text-primary",
    textSecondary: "--color-text-secondary",
    textMuted: "--color-text-muted",
    textInverse: "--color-text-inverse",
    border: "--color-border",
    borderSubtle: "--color-border-subtle",
    borderAccent: "--color-border-accent",
    cardBg: "--color-card-bg",
    cardBorder: "--color-card-border",
    brandAccent: "--color-brand-accent",
    brandAccentWarm: "--color-brand-accent-warm",
    buttonPrimaryBg: "--color-button-primary-bg",
    buttonPrimaryText: "--color-button-primary-text",
    link: "--color-link",
    linkHover: "--color-link-hover",
  },
  fonts: {
    display: "--font-display",
    body: "--font-body",
    serif: "--font-serif",
  },
  neuron: {
    color: "--neuron-color",
    secondary: "--neuron-secondary",
    opacity: "--neuron-opacity",
  },
} as const;

/** Type for theme mode */
export type ThemeMode = "light" | "dark";

/** Helper to get CSS variable value */
export function varValue(name: string): string {
  return `var(${name})`;
}
