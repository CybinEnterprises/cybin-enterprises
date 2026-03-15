import { useTheme } from "@/src/contexts/ThemeContext";

export function useThemeColors() {
  const { resolved } = useTheme();
  const isLight = resolved === "light";

  return {
    accent: isLight ? "var(--cybin-mint)" : "var(--cybin-mint)",
    accentSecondary: isLight ? "var(--cybin-aurora)" : "var(--cybin-aurora)",
    textPrimary: isLight
      ? "var(--cybin-text-primary)"
      : "var(--cybin-text-primary)",
    textSecondary: isLight
      ? "var(--cybin-text-secondary)"
      : "rgba(232,237,248,0.65)",
    textMuted: isLight ? "var(--cybin-text-muted)" : "rgba(232,237,248,0.45)",
    bgPrimary: isLight ? "var(--cybin-surface)" : "#0a0f1e",
    bgSecondary: isLight ? "#F9FAFF" : "#080d1a",
    bgTertiary: isLight ? "#f0f3fa" : "#080d1a",
    cardBg: isLight ? "var(--cybin-surface)" : "rgba(255,255,255,0.03)",
    cardBorder: isLight ? "var(--cybin-border)" : "rgba(255,255,255,0.07)",
    border: isLight ? "var(--cybin-border)" : "rgba(110,247,212,0.08)",
    accentBorder: isLight ? "rgba(0,212,184,0.2)" : "rgba(110,247,212,0.12)",
    success: isLight ? "#10b981" : "#00d4b8",
    error: isLight ? "#ef4444" : "#ff6b6b",
    warning: isLight ? "#f59e0b" : "#fbbf24",
    inputBg: isLight ? "rgba(248,249,252,0.8)" : "rgba(22, 30, 58, 0.8)",
    inputBorder: isLight ? "rgba(0,212,184,0.15)" : "rgba(110,247,212,0.15)",
    inputBorderFocus: isLight ? "rgba(0,212,184,0.4)" : "rgba(110,247,212,0.4)",
    inputText: isLight ? "#0a0f1e" : "#e8edf8",
    gradient: isLight
      ? "linear-gradient(135deg, rgba(0,212,184,0.08), rgba(124,92,191,0.06))"
      : "linear-gradient(135deg, rgba(110,247,212,0.06), rgba(26, 10, 46, 0.5))",
    isLight,
  };
}
