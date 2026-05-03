import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const KEY = "genai-learn:prefs";

export type FontSize   = "sm" | "base" | "lg";
export type LineHeight = "compact" | "normal" | "relaxed";

export interface Prefs {
  fontSize:    FontSize;
  lineHeight:  LineHeight;
  focusMode:   boolean;
  wideColumn:  boolean;
}

const DEFAULTS: Prefs = { fontSize: "base", lineHeight: "normal", focusMode: false, wideColumn: false };

function load(): Prefs {
  try { const r = localStorage.getItem(KEY); return r ? { ...DEFAULTS, ...JSON.parse(r) } : DEFAULTS; }
  catch { return DEFAULTS; }
}

interface PrefsCtx extends Prefs {
  setFontSize:     (v: FontSize) => void;
  setLineHeight:   (v: LineHeight) => void;
  toggleFocusMode: () => void;
  toggleWideCol:   () => void;
}

const Ctx = createContext<PrefsCtx | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Prefs>(load);

  const save = useCallback((next: Prefs) => {
    setP(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }, []);

  return (
    <Ctx.Provider value={{
      ...p,
      setFontSize:     (v) => save({ ...p, fontSize: v }),
      setLineHeight:   (v) => save({ ...p, lineHeight: v }),
      toggleFocusMode: ()  => save({ ...p, focusMode: !p.focusMode }),
      toggleWideCol:   ()  => save({ ...p, wideColumn: !p.wideColumn }),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePrefs() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePrefs must be within PrefsProvider");
  return c;
}

// CSS value helpers
export const fontSizePx:   Record<FontSize, string>   = { sm: "0.875rem", base: "0.9375rem", lg: "1.0625rem" };
export const lineHeightVal: Record<LineHeight, string> = { compact: "1.6", normal: "1.85", relaxed: "2.1" };
