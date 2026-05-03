import { useState, useCallback } from "react";

const KEY = "genai-learn:bookmarks";

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function persist(s: Set<string>) {
  try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch {}
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(load);

  const toggleBookmark = useCallback((slug: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      persist(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback((slug: string) => bookmarks.has(slug), [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked, bookmarkCount: bookmarks.size };
}
