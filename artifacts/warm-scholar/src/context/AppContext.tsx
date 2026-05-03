import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";

const PROGRESS_KEY    = "warm-scholar:completed";
const RECENT_KEY      = "warm-scholar:recent";
const STREAK_KEY      = "warm-scholar:streak";
const LAST_DATE_KEY   = "warm-scholar:last-date";
const BEST_STREAK_KEY = "warm-scholar:best-streak";

const MAX_RECENT = 8;

function loadCompleted(): Set<string> {
  try { const r = localStorage.getItem(PROGRESS_KEY); return r ? new Set(JSON.parse(r)) : new Set(); }
  catch { return new Set(); }
}
function loadRecent(): string[] {
  try { const r = localStorage.getItem(RECENT_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function loadStreak(): { count: number; best: number; lastDate: string } {
  try {
    return {
      count:    Number(localStorage.getItem(STREAK_KEY) ?? 0),
      best:     Number(localStorage.getItem(BEST_STREAK_KEY) ?? 0),
      lastDate: localStorage.getItem(LAST_DATE_KEY) ?? "",
    };
  } catch { return { count: 0, best: 0, lastDate: "" }; }
}
function todayStr(): string { return new Date().toISOString().split("T")[0]; }
function yesterdayStr(): string {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

interface AppContextType {
  completed: Set<string>;
  completedCount: number;
  isComplete: (slug: string) => boolean;
  toggleComplete: (slug: string) => void;
  recentlyRead: string[];
  recordVisit: (slug: string) => void;
  streak: number;
  bestStreak: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted]       = useState<Set<string>>(loadCompleted);
  const [recentlyRead, setRecentlyRead] = useState<string[]>(loadRecent);
  const streakRef = useRef(loadStreak());
  const [streak, setStreak]             = useState(streakRef.current.count);
  const [bestStreak, setBestStreak]     = useState(streakRef.current.best);

  const bumpStreak = useCallback(() => {
    const { count, best, lastDate } = streakRef.current;
    const today = todayStr();
    if (lastDate === today) return;
    const newCount = lastDate === yesterdayStr() ? count + 1 : 1;
    const newBest  = Math.max(newCount, best);
    streakRef.current = { count: newCount, best: newBest, lastDate: today };
    setStreak(newCount);
    setBestStreak(newBest);
    try {
      localStorage.setItem(STREAK_KEY,      String(newCount));
      localStorage.setItem(BEST_STREAK_KEY, String(newBest));
      localStorage.setItem(LAST_DATE_KEY,   today);
    } catch {}
  }, []);

  const recordVisit = useCallback((slug: string) => {
    bumpStreak();
    setRecentlyRead(prev => {
      const next = [slug, ...prev.filter(s => s !== slug)].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [bumpStreak]);

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
    <AppContext.Provider value={{
      completed, completedCount: completed.size, isComplete, toggleComplete,
      recentlyRead, recordVisit,
      streak, bestStreak,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
