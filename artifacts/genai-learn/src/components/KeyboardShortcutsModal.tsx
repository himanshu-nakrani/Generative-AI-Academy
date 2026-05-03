import { useState, useEffect } from "react";
import { X, Keyboard } from "lucide-react";
import { GLOBAL_SHORTCUTS, TOPIC_LIST_SHORTCUTS, TOPIC_DETAIL_SHORTCUTS } from "@/hooks/useKeyboardShortcuts";

export function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    const handleCustomEvent = () => {
      setOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("open-shortcuts", handleCustomEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("open-shortcuts", handleCustomEvent);
    };
  }, []);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-primary" />
              Keyboard Shortcuts
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Global */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Global</h3>
              <div className="space-y-2">
                {GLOBAL_SHORTCUTS.map((s) => (
                  <div key={s.key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.description}</span>
                    <kbd className="px-2 py-1 rounded bg-muted border border-border text-foreground text-xs font-mono">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Lists */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Topic Lists</h3>
              <div className="space-y-2">
                {TOPIC_LIST_SHORTCUTS.map((s) => (
                  <div key={s.key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.description}</span>
                    <kbd className="px-2 py-1 rounded bg-muted border border-border text-foreground text-xs font-mono">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Detail */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Topic Detail</h3>
              <div className="space-y-2">
                {TOPIC_DETAIL_SHORTCUTS.map((s) => (
                  <div key={s.key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.description}</span>
                    <kbd className="px-2 py-1 rounded bg-muted border border-border text-foreground text-xs font-mono">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                💡 Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground text-xs font-mono">?</kbd> anytime to open this guide
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
