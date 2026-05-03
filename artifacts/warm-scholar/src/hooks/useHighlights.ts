import { useState, useCallback } from "react";

const KEY = "genai-learn:highlights";

export const HIGHLIGHT_COLORS = [
  { id: "yellow", label: "Yellow", bg: "#fef08a", border: "#eab308" },
  { id: "blue",   label: "Blue",   bg: "#bfdbfe", border: "#3b82f6" },
  { id: "green",  label: "Green",  bg: "#bbf7d0", border: "#22c55e" },
  { id: "pink",   label: "Pink",   bg: "#fbcfe8", border: "#ec4899" },
];

export interface Highlight {
  id:           string;
  slug:         string;
  selectedText: string;
  color:        string;
  note:         string;
  timestamp:    number;
}

function load(): Highlight[] {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}

function save(hs: Highlight[]) {
  try { localStorage.setItem(KEY, JSON.stringify(hs)); } catch {}
}

export function useHighlights(slug: string) {
  const [all, setAll] = useState<Highlight[]>(load);

  const topicHighlights = all.filter(h => h.slug === slug);

  const add = useCallback((selectedText: string, color: string, note = "") => {
    const h: Highlight = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      slug, selectedText, color, note, timestamp: Date.now(),
    };
    const next = [h, ...all];
    setAll(next); save(next);
    return h;
  }, [slug, all]);

  const remove = useCallback((id: string) => {
    const next = all.filter(h => h.id !== id);
    setAll(next); save(next);
  }, [all]);

  const updateNote = useCallback((id: string, note: string) => {
    const next = all.map(h => h.id === id ? { ...h, note } : h);
    setAll(next); save(next);
  }, [all]);

  return { topicHighlights, allHighlights: all, add, remove, updateNote };
}
