import { useState, useEffect } from "react";

const THEME_KEY = "genai-learn:theme";

export type Theme = "light" | "dark" | "auto";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "auto";
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    return stored || "auto";
  });

  useEffect(() => {
    // Determine effective theme (what's actually applied)
    let effectiveTheme = theme;
    if (theme === "auto") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    // Apply to DOM
    const isDark = effectiveTheme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Store preference
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Listen to system preference changes when theme is "auto"
  useEffect(() => {
    if (theme !== "auto") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const isDark = mediaQuery.matches;
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => {
      if (current === "auto") return "dark";
      if (current === "dark") return "light";
      return "auto";
    });
  };

  const getEffectiveTheme = (): "light" | "dark" => {
    if (theme === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  };

  return { theme, toggleTheme, getEffectiveTheme };
}
