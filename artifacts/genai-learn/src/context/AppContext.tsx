import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

const PROGRESS_KEY = "genai-learn:completed";
const THEME_KEY    = "genai-learn:theme";

function loadCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function getInitialDark(): boolean {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored !== null) return stored === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  } catch { return false; }
}

interface AppContextType {
  dark: boolean;
  toggleDark: () => void;
  completed: Set<string>;
  completedCount: number;
  isComplete: (slug: string) => boolean;
  toggleComplete: (slug: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [dark, setDark]           = useState(getInitialDark);
  const [completed, setCompleted] = useState<Set<string>>(loadCompleted);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem(THEME_KEY, dark ? "dark" : "light"); } catch {}
  }, [dark]);

  const toggleDark = useCallback(() => setDark(d => !d), []);

  const toggleComplete = useCallback((slug: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      try { localStorage.setItem(PROGRESS_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const isComplete = useCallback((slug: string) => completed.has(slug), [completed]);

  return (
    <AppContext.Provider value={{ dark, toggleDark, completed, completedCount: completed.size, isComplete, toggleComplete }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
