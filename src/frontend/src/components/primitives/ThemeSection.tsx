/**
 * ThemeSection - Standardized section container with built-in theming
 * Uses CSS variables - no isLight/isDark logic needed
 */

import type { ReactNode } from "react";

type SectionBackground = "default" | "surface" | "elevated" | "hero";
type SectionPadding = "none" | "small" | "medium" | "large";

interface ThemeSectionProps {
  /** Section content */
  children: ReactNode;

  /** Background variant */
  background?: SectionBackground;

  /** Section padding */
  padding?: SectionPadding;

  /** Full width without container */
  fullWidth?: boolean;

  /** Optional id for anchors */
  id?: string;

  /** Additional className */
  className?: string;

  /** Additional inline styles */
  style?: React.CSSProperties;
}

const backgroundMap: Record<SectionBackground, string> = {
  default: "var(--color-background)",
  surface: "var(--color-surface)",
  elevated: "var(--color-surface-elevated)",
  hero: "var(--color-hero-bg)",
};

const paddingMap: Record<SectionPadding, string> = {
  none: "0",
  small: "40px 0",
  medium: "80px 0",
  large: "120px 0",
};

export function ThemeSection({
  children,
  background = "default",
  padding = "medium",
  fullWidth = false,
  id,
  className = "",
  style = {},
}: ThemeSectionProps) {
  return (
    <section
      id={id}
      className={className}
      style={{
        background: backgroundMap[background],
        padding: paddingMap[padding],
        ...style,
      }}
    >
      {fullWidth ? (
        children
      ) : (
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}
        >
          {children}
        </div>
      )}
    </section>
  );
}

export default ThemeSection;
