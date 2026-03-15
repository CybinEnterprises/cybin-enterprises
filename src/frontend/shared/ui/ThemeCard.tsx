/**
 * ThemeCard - Consistent card component with built-in theming
 * Uses CSS variables - no isLight/isDark logic needed
 */

import type { ReactNode } from "react";

interface ThemeCardProps {
  /** Card content */
  children: ReactNode;

  /** Make card clickable */
  onClick?: () => void;

  /** Elevated appearance with stronger shadow */
  elevated?: boolean;

  /** Padding size */
  padding?: "none" | "small" | "medium" | "large";

  /** Additional className */
  className?: string;

  /** Additional inline styles */
  style?: React.CSSProperties;
}

const paddingMap = {
  none: "0",
  small: "16px",
  medium: "24px",
  large: "32px",
};

export function ThemeCard({
  children,
  onClick,
  elevated = false,
  padding = "medium",
  className = "",
  style = {},
}: ThemeCardProps) {
  const baseStyle: React.CSSProperties = {
    backgroundColor: elevated
      ? "var(--color-surface-elevated)"
      : "var(--color-card-bg)",
    border: `1px solid ${
      elevated ? "var(--color-border)" : "var(--color-card-border)"
    }`,
    borderRadius: "var(--radius-lg)",
    padding: paddingMap[padding],
    transition:
      "transform var(--transition-base), box-shadow var(--transition-base)",
    cursor: onClick ? "pointer" : "default",
    ...style,
  };

  return (
    <div
      style={baseStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = elevated
            ? "var(--shadow-lg)"
            : "var(--shadow-md)";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }
      }}
    >
      {children}
    </div>
  );
}

export default ThemeCard;
