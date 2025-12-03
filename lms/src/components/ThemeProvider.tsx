"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("theme") as Theme | null) : null;
    const initial = stored ?? getSystemTheme();
    setThemeState(initial);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.setAttribute("data-theme", theme);
      // Add/remove the 'dark' class so Tailwind dark: variants work site-wide
      if (theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const api = useMemo<ThemeContextType>(() => ({
    theme,
    toggle: () => setThemeState((t) => (t === "light" ? "dark" : "light")),
    setTheme: (t) => setThemeState(t),
  }), [theme]);

  return <ThemeContext.Provider value={api}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
