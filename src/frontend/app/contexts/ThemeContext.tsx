// Reference ID: shared.contexts.ThemeContext
// Dependencies: react
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

export type ThemeMode = "light" | "dark";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  resolved: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggle: () => void;
  // Keep cycle for any legacy callers
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  resolved: "dark",
  setTheme: () => {},
  toggle: () => {},
  cycle: () => {},
});

const STORAGE_KEY = "cybin-theme-mode";

function detectDefaultTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  if (typeof window !== "undefined") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (prefersDark) return "dark";
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    if (prefersLight) return "light";
  }
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(detectDefaultTheme);

  useLayoutEffect(() => {
      const root = window.document.documentElement;

      // Apply data-theme for legacy compatibility
      root.setAttribute("data-theme", mode);

      // Apply tailwind 'dark' class
      if (mode === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch {}
    }, [mode]);

  useEffect(() => {
    // Listen for OS preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if the user hasn't manually set a preference locally
      if (!localStorage.getItem(STORAGE_KEY)) {
        setModeState(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    // When manually setting mode, save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme: mode, resolved: mode, setTheme: setMode, toggle, cycle: toggle }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
