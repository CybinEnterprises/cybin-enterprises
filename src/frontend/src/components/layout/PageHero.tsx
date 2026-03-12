/**
 * PageHero - Standardized page hero with built-in neuron background
 * Uses CSS variables - automatic light/dark mode support
 */

import NeuronCanvas from "@/components/NeuronCanvas";
import { Link } from "@/lib/router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeText } from "../primitives/ThemeText";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  /** Page title */
  title: string;

  /** Optional subtitle */
  subtitle?: string;

  /** Breadcrumb trail */
  breadcrumb?: BreadcrumbItem[];

  /** Show neuron background (default: true) */
  showNeurons?: boolean;

  /** Additional content after title/subtitle */
  children?: ReactNode;

  /** Additional className */
  className?: string;
}

export function PageHero({
  title,
  subtitle,
  breadcrumb,
  showNeurons = true,
  children,
  className = "",
}: PageHeroProps) {
  return (
    <section
      className={`page-hero ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "80px 0 60px",
        backgroundColor: "var(--color-hero-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Neuron background - auto-detects theme from CSS */}
      {showNeurons && (
        <NeuronCanvas
          style={{
            position: "absolute",
            inset: 0,
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            style={{
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {breadcrumb.map((item, index) => (
              <span
                key={index}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {index > 0 && (
                  <ChevronRight
                    size={14}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                )}
                {item.href ? (
                  <Link
                    to={item.href}
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      transition: "color var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-link)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--color-text-muted)";
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title */}
        <ThemeText as="h1" variant="display">
          {title}
        </ThemeText>

        {/* Subtitle */}
        {subtitle && (
          <ThemeText
            as="p"
            variant="lead"
            color="secondary"
            className="mt-4"
            style={{ maxWidth: "640px" }}
          >
            {subtitle}
          </ThemeText>
        )}

        {/* Additional content */}
        {children}
      </div>
    </section>
  );
}

export default PageHero;
