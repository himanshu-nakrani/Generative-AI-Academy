import { useEffect } from "react";
import { useLocation } from "wouter";

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutHandler[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = (e.ctrlKey || e.metaKey) === (shortcut.ctrl ?? false);
        const shiftMatch = e.shiftKey === (shortcut.shift ?? false);
        const altMatch = e.altKey === (shortcut.alt ?? false);

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.handler();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export const GLOBAL_SHORTCUTS = [
  { key: "?", description: "Show keyboard shortcuts" },
  { key: "/", description: "Focus search" },
];

export const TOPIC_LIST_SHORTCUTS = [
  { key: "j", description: "Next topic" },
  { key: "k", description: "Previous topic" },
];

export const TOPIC_DETAIL_SHORTCUTS = [
  { key: "b", description: "Toggle bookmark" },
  { key: "m", description: "Toggle sidebar" },
  { key: "r", description: "Read aloud" },
];
