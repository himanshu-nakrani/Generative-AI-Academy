import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

interface KeyboardNavArgs {
  sections: { title: string }[];
  activeSection: number;
  prevSlug?: string | null;
  nextSlug?: string | null;
  onToggleComplete: () => void;
  onToggleShortcuts: () => void;
}

export function useKeyboardNav(args: KeyboardNavArgs) {
  const [, navigate] = useLocation();
  const ref = useRef(args);
  useEffect(() => { ref.current = args; });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const { activeSection, sections, prevSlug, nextSlug, onToggleComplete, onToggleShortcuts } = ref.current;

      switch (e.key) {
        case "j": {
          e.preventDefault();
          const next = Math.min(activeSection + 1, sections.length - 1);
          document.getElementById(`section-${next}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        }
        case "k": {
          e.preventDefault();
          const prev = Math.max(activeSection - 1, 0);
          document.getElementById(`section-${prev}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        }
        case "[":
          if (prevSlug) navigate(`/topic/${prevSlug}`);
          break;
        case "]":
          if (nextSlug) navigate(`/topic/${nextSlug}`);
          break;
        case "c":
          onToggleComplete();
          break;
        case "?":
          onToggleShortcuts();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
}
