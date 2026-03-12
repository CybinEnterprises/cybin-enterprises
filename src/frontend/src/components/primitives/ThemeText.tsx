/**
 * ThemeText - Zero-logic text component
 * Automatically uses CSS variables for theming - no isLight/isDark needed
 */

import type { ReactNode } from "react";

type TextVariant =
  | "display"
  | "heading"
  | "subheading"
  | "body"
  | "caption"
  | "label"
  | "lead";
type TextColor = "primary" | "secondary" | "muted" | "accent" | "inverse";

interface ThemeTextProps {
  /** Content */
  children: ReactNode;

  /** HTML element */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "small" | "li";

  /** Text variant controls size and weight */
  variant?: TextVariant;

  /** Text color from theme */
  color?: TextColor;

  /** Additional className */
  className?: string;

  /** Additional inline styles */
  style?: React.CSSProperties;
}

const variantStyles: Record<TextVariant, React.CSSProperties> = {
  display: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    lineHeight: 1.1,
  },
  heading: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    fontWeight: 600,
    lineHeight: 1.2,
  },
  subheading: {
    fontFamily: "var(--font-display)",
    fontSize: "1.25rem",
    fontWeight: 500,
    lineHeight: 1.4,
  },
  body: {
    fontFamily: "var(--font-body)",
    fontSize: "1rem",
    lineHeight: 1.7,
  },
  caption: {
    fontFamily: "var(--font-body)",
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  label: {
    fontFamily: "var(--font-body)",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  lead: {
    fontFamily: "var(--font-body)",
    fontSize: "1.125rem",
    lineHeight: 1.6,
  },
};

const colorStyles: Record<TextColor, string> = {
  primary: "var(--color-text-primary)",
  secondary: "var(--color-text-secondary)",
  muted: "var(--color-text-muted)",
  accent: "var(--color-brand-accent)",
  inverse: "var(--color-text-inverse)",
};

export function ThemeText({
  children,
  as: Component = "p",
  variant = "body",
  color = "primary",
  className = "",
  style = {},
}: ThemeTextProps) {
  return (
    <Component
      className={className}
      style={{
        color: colorStyles[color],
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </Component>
  );
}

export default ThemeText;
