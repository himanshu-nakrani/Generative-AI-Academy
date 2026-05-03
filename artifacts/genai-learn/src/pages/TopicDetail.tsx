import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, ArrowRight, Clock, BookOpen, ChevronRight,
  Copy, Check, ExternalLink, FileText, Globe, MessageSquare,
  Video, BookMarked, CheckCircle2, Circle, Keyboard, X, List,
  Play, Loader2, Terminal, Highlighter, SlidersHorizontal, Bookmark,
  Timer, Maximize2,
} from "lucide-react";
import { getTopicBySlug, topics, categoryColors, difficultyColors, type Reference } from "@/data/topics";
import { quizzes } from "@/data/quizzes";
import { useQuizScores } from "@/hooks/useQuizScores";
import { useApp } from "@/context/AppContext";
import { usePrefs, fontSizePx, lineHeightVal } from "@/context/PrefsContext";
import { useHighlights, HIGHLIGHT_COLORS, type Highlight } from "@/hooks/useHighlights";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { diagramRegistry } from "@/components/Diagrams";
import { InteractiveDiagram, interactiveRegistry } from "@/components/InteractiveDiagrams";
import { getPrerequisites } from "@/data/prerequisites";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAchievements } from "@/context/AchievementsContext";
import { recordTopicRead } from "@/hooks/useSpacedRepetition";
import { VoiceReader } from "@/components/VoiceReader";

/* ── Pyodide singleton ───────────────────────────────────── */
const CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/";

interface PyodideAPI {
  runPythonAsync: (c: string) => Promise<unknown>;
  setStdout: (o: { batched: (s: string) => void }) => void;
  setStderr: (o: { batched: (s: string) => void }) => void;
}
interface WindowWithPyodide {
  loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideAPI>;
}

let _py: PyodideAPI | null = null;
let _pyLoading: Promise<PyodideAPI> | null = null;

function loadPyodide(): Promise<PyodideAPI> {
  if (_py) return Promise.resolve(_py);
  if (_pyLoading) return _pyLoading;
  _pyLoading = new Promise<PyodideAPI>((res, rej) => {
    const boot = async () => {
      try {
        const win = window as unknown as WindowWithPyodide;
        const py = await win.loadPyodide!({ indexURL: CDN });
        _py = py; res(py);
      } catch(e) { rej(e); }
    };
    if ((window as unknown as WindowWithPyodide).loadPyodide) { boot(); return; }
    const s = document.createElement("script");
    s.src = CDN + "pyodide.js";
    s.onload = boot;
    s.onerror = () => rej(new Error("Failed to load Pyodide CDN script"));
    document.head.appendChild(s);
  });
  return _pyLoading;
}

/* ── ReadingProgress ─────────────────────────────────────── */
function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement;
      const sh = h.scrollHeight - h.clientHeight;
      setP(sh > 0 ? ((h.scrollTop || document.body.scrollTop) / sh) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="reading-progress" style={{ width: `${p}%` }} />;
}

/* ── CodeBlock ───────────────────────────────────────────── */
type RunStatus = "idle" | "loading" | "running" | "done" | "error";

function CodeBlock({ code, language = "python" }: { code: string; language?: string }) {
  const [copied, setCopied]         = useState(false);
  const [runStatus, setRunStatus]   = useState<RunStatus>("idle");
  const [output, setOutput]         = useState("");

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const run = async () => {
    setRunStatus("loading"); setOutput("");
    try {
      const py = await loadPyodide();
      setRunStatus("running");
      const lines: string[] = [];
      py!.setStdout({ batched: t => lines.push(t) });
      py!.setStderr({ batched: t => lines.push(`[stderr] ${t}`) });
      await py!.runPythonAsync(code);
      setOutput(lines.join("\n") || "✓ (no output)");
      setRunStatus("done");
    } catch (e: unknown) {
      setOutput(e instanceof Error ? e.message : String(e));
      setRunStatus("error");
    }
  };

  const isRunnable = language === "python";

  return (
    <div className="mt-5 rounded-md overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <div className="flex items-center gap-2">
          {isRunnable && (
            <a href="https://colab.new" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded hover:bg-muted">
              <ExternalLink className="w-3 h-3" />Colab
            </a>
          )}
          {isRunnable && runStatus === "idle" && (
            <button onClick={run}
              className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors px-2 py-0.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-medium">
              <Play className="w-3 h-3" />Run
            </button>
          )}
          {isRunnable && runStatus === "loading" && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground px-2">
              <Loader2 className="w-3 h-3 animate-spin" />Loading Python…
            </span>
          )}
          {isRunnable && runStatus === "running" && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground px-2">
              <Loader2 className="w-3 h-3 animate-spin" />Running…
            </span>
          )}
          {isRunnable && (runStatus === "done" || runStatus === "error") && (
            <button onClick={() => { setRunStatus("idle"); setOutput(""); }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded hover:bg-muted">
              <Play className="w-3 h-3" />Run again
            </button>
          )}
          <button onClick={copy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded hover:bg-muted">
            {copied ? <><Check className="w-3 h-3 text-green-500" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
          </button>
        </div>
      </div>
      <pre className="code-block rounded-none border-none overflow-x-auto"><code>{code}</code></pre>

      {/* Output */}
      {(runStatus === "done" || runStatus === "error") && (
        <div className={`border-t border-border px-4 py-3 ${runStatus === "error" ? "bg-red-50/60 dark:bg-red-900/10" : "bg-emerald-50/40 dark:bg-emerald-900/10"}`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Terminal className={`w-3 h-3 ${runStatus === "error" ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`} />
            <span className={`text-xs font-medium ${runStatus === "error" ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
              {runStatus === "error" ? "Error" : "Output"}
            </span>
          </div>
          <pre className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${runStatus === "error" ? "text-red-700 dark:text-red-300" : "text-foreground"}`}>{output}</pre>
        </div>
      )}
    </div>
  );
}

/* ── RefTypeIcon ─────────────────────────────────────────── */
function RefTypeIcon({ type }: { type: Reference["type"] }) {
  const cls = "w-3 h-3 flex-shrink-0";
  if (type === "paper")  return <FileText className={cls} />;
  if (type === "blog")   return <Globe className={cls} />;
  if (type === "tweet")  return <MessageSquare className={cls} />;
  if (type === "video")  return <Video className={cls} />;
  if (type === "docs")   return <BookMarked className={cls} />;
  return <Globe className={cls} />;
}

/* ── ReferenceList ───────────────────────────────────────── */
function ReferenceList({ refs }: { refs: Reference[] }) {
  return (
    <div className="mt-14 pt-8 border-t border-border">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">References &amp; Further Reading</h2>
      <ol className="space-y-3">
        {refs.map((ref, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-xs font-mono text-muted-foreground/50 mt-0.5 w-5 flex-shrink-0 tabular-nums">[{i + 1}]</span>
            <div className="min-w-0">
              {ref.url
                ? <a href={ref.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 group/link">
                    <span className="text-sm text-foreground group-hover/link:text-primary transition-colors leading-snug">{ref.title}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0 group-hover/link:text-primary" />
                  </a>
                : <span className="text-sm text-foreground leading-snug">{ref.title}</span>}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <RefTypeIcon type={ref.type} />
                  <span className="text-xs">{ref.authors}</span>
                </span>
                {ref.year  && <span className="text-xs text-muted-foreground/60">{ref.year}</span>}
                {ref.venue && <span className="text-xs px-1.5 py-0 rounded border border-border text-muted-foreground/70 font-mono">{ref.venue}</span>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── ContentParagraph ────────────────────────────────────── */
const HL_MAP: Record<string, { bg: string }> = {
  yellow: { bg: "#fef08acc" },
  blue:   { bg: "#bfdbfecc" },
  green:  { bg: "#bbf7d0cc" },
  pink:   { bg: "#fbcfe8cc" },
};

function ContentParagraph({ text, highlights = [] }: { text: string; highlights?: Highlight[] }) {
  const isNumbered = /^\d+\./.test(text.trim());
  const isBullet   = /^[-•]/.test(text.trim());

  if (isNumbered || isBullet) {
    const lines = text.split("\n").filter(Boolean);
    return (
      <ul className="space-y-2 my-1">
        {lines.map((line, k) => (
          <li key={k} className="flex gap-2.5">
            <span className="text-primary/50 flex-shrink-0 mt-0.5 text-sm font-mono">{isNumbered ? `${k + 1}.` : "–"}</span>
            <span className="text-[0.9375rem] text-muted-foreground leading-relaxed">
              {line.replace(/^\d+\.\s*/, "").replace(/^[-•]\s*/, "")}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  // Find matching highlights
  const active = highlights
    .map(h => ({ h, idx: text.indexOf(h.selectedText) }))
    .filter(({ idx }) => idx !== -1)
    .sort((a, b) => a.idx - b.idx);

  if (active.length === 0) {
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return (
      <p className="text-[0.9375rem] text-muted-foreground leading-[1.85]">
        {parts.map((part, j) => j % 2 === 1
          ? <strong key={j} className="text-foreground font-medium">{part}</strong>
          : part)}
      </p>
    );
  }

  // Build segments with highlight marks
  let pos = 0;
  const segments: { text: string; hl?: Highlight }[] = [];
  for (const { h, idx } of active) {
    if (idx > pos) segments.push({ text: text.slice(pos, idx) });
    segments.push({ text: h.selectedText, hl: h });
    pos = idx + h.selectedText.length;
  }
  if (pos < text.length) segments.push({ text: text.slice(pos) });

  return (
    <p className="text-[0.9375rem] text-muted-foreground leading-[1.85]">
      {segments.map((seg, i) =>
        seg.hl
          ? <mark key={i} style={{ background: HL_MAP[seg.hl.color]?.bg ?? "#fef08acc", borderRadius: "2px", padding: "0 2px" }}>{seg.text}</mark>
          : seg.text
      )}
    </p>
  );
}

/* ── PrerequisitesBanner ─────────────────────────────────── */
function PrerequisitesBanner({ slug }: { slug: string }) {
  const { isComplete } = useApp();
  const prereqs = getPrerequisites(slug);
  if (prereqs.length === 0) return null;

  const prereqTopics = prereqs
    .map(s => topics.find(t => t.slug === s))
    .filter(Boolean) as (typeof topics)[number][];

  const incomplete = prereqTopics.filter(t => !isComplete(t.slug));
  if (incomplete.length === 0) return null;

  return (
    <div className="mb-8 p-4 rounded-md border border-border bg-muted/40 fade-up">
      <p className="text-xs font-semibold text-muted-foreground mb-2.5">
        Recommended reading first
      </p>
      <div className="flex flex-wrap gap-2">
        {prereqTopics.map(t => {
          const done = isComplete(t.slug);
          return (
            <Link key={t.slug} href={`/topic/${t.slug}`}>
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                done
                  ? "border-border bg-muted text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}>
                {done
                  ? <CheckCircle2 className="w-3 h-3" />
                  : <Circle className="w-3 h-3 opacity-40" />}
                {t.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ── SelectionToolbar ────────────────────────────────────── */
function SelectionToolbar({ x, y, text, onHighlight, onDismiss }: {
  x: number; y: number; text: string;
  onHighlight: (text: string, colorId: string) => void;
  onDismiss: () => void;
}) {
  return (
    <div
      className="fixed z-[80] flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-background shadow-xl"
      style={{ left: x, top: y - 8, transform: "translate(-50%, -100%)" }}
      onMouseDown={e => e.preventDefault()}
    >
      <Highlighter className="w-3 h-3 text-muted-foreground mr-0.5 flex-shrink-0" />
      <span className="text-xs text-muted-foreground pr-1.5 border-r border-border mr-0.5">Highlight</span>
      {HIGHLIGHT_COLORS.map(c => (
        <button key={c.id} title={c.label}
          className="w-5 h-5 rounded-full border-2 hover:scale-110 transition-transform flex-shrink-0"
          style={{ background: c.bg, borderColor: c.border }}
          onClick={() => { onHighlight(text, c.id); onDismiss(); }}
        />
      ))}
      <button className="ml-0.5 p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        onClick={onDismiss}>
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ── ReadingPrefsPanel ───��───────────────────────────────── */
function ReadingPrefsPanel({ onClose }: { onClose: () => void }) {
  const { fontSize, lineHeight, focusMode, wideColumn, setFontSize, setLineHeight, toggleFocusMode, toggleWideCol } = usePrefs();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-9 z-[70] w-58 rounded-lg border border-border bg-background shadow-xl p-4 min-w-[220px]">
      <p className="text-xs font-semibold mb-3">Reading Preferences</p>

      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-1.5">Font size</p>
        <div className="flex gap-1.5">
          {(["sm", "base", "lg"] as const).map(s => (
            <button key={s} onClick={() => setFontSize(s)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                fontSize === s ? "border-primary bg-primary/8 text-primary" : "border-border text-muted-foreground hover:bg-muted"
              }`}>
              {s === "sm" ? "A−" : s === "base" ? "A" : "A+"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-1.5">Line spacing</p>
        <div className="flex gap-1.5">
          {(["compact", "normal", "relaxed"] as const).map(lh => (
            <button key={lh} onClick={() => setLineHeight(lh)}
              className={`flex-1 py-1 rounded-md text-xs font-medium border transition-all ${
                lineHeight === lh ? "border-primary bg-primary/8 text-primary" : "border-border text-muted-foreground hover:bg-muted"
              }`}>
              {lh === "compact" ? "Tight" : lh === "normal" ? "Normal" : "Loose"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 pt-2.5 border-t border-border">
        {[
          { label: "Focus mode",   active: focusMode,  toggle: toggleFocusMode },
          { label: "Wide column",  active: wideColumn, toggle: toggleWideCol   },
        ].map(({ label, active, toggle }) => (
          <button key={label} onClick={toggle}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs border transition-colors ${
              active ? "bg-primary/8 text-primary border-primary/20" : "text-muted-foreground hover:bg-muted border-transparent"
            }`}>
            <span>{label}</span>
            <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${active ? "bg-primary border-primary" : "border-muted-foreground/40"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── ShortcutsModal ──────────────────────────────────────── */
function ShortcutsModal({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { key: "j / k",  desc: "Jump to next / previous section" },
    { key: "[ / ]",  desc: "Go to previous / next topic" },
    { key: "c",      desc: "Toggle mark as complete" },
    { key: "?",      desc: "Show / hide this dialog" },
  ];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-background shadow-lg p-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Keyboard Shortcuts</p>
          </div>
          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2.5">
          {shortcuts.map(({ key, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">{desc}</span>
              <kbd className="flex-shrink-0 px-2 py-0.5 rounded border border-border bg-muted text-xs font-mono">{key}</kbd>
            </div>
          ))}
        </div>
        <p className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 rounded border border-border bg-muted font-mono">?</kbd> anywhere to toggle.
        </p>
      </div>
    </div>
  );
}

/* ── KeyTakeaways ────────────────────────────────────────── */
function KeyTakeaways({ sections }: { sections: { title: string; content: string }[] }) {
  const [open, setOpen] = useState(true);

  const takeaways = sections.map(s => {
    const first = s.content.split(/\.\s+/)[0].trim();
    return first.length > 200 ? first.slice(0, 197) + "…" : first + ".";
  });

  return (
    <div className="mb-8 rounded-md border border-primary/20 bg-primary/4 fade-up-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary/80">
          <span>⚡</span>Key Takeaways
        </span>
        <span className={`text-muted-foreground/60 text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <ul className="px-4 pb-4 space-y-2">
          {takeaways.map((t, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── FocusOverlay ────────────────────────────────────────── */
interface FocusOverlayProps {
  topic: NonNullable<ReturnType<typeof getTopicBySlug>>;
  slug: string;
  contentStyle: React.CSSProperties;
  topicHighlights: import("@/hooks/useHighlights").Highlight[];
  isComplete: boolean;
  onExit: () => void;
  onMarkComplete: () => void;
}

function PomodoroTimer() {
  const WORK = 25 * 60;
  const [secs, setSecs] = useState(WORK);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) { setRunning(false); return WORK; }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const pct = ((WORK - secs) / WORK) * 100;

  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/10" />
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={`${2 * Math.PI * 13}`}
            strokeDashoffset={`${2 * Math.PI * 13 * (1 - pct / 100)}`}
            className="text-primary transition-all" strokeLinecap="round" />
        </svg>
        <button onClick={() => setRunning(r => !r)}
          className="absolute inset-0 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          {running
            ? <span className="text-[9px] font-bold">❚❚</span>
            : <Play className="w-3 h-3 fill-current" />}
        </button>
      </div>
      <span className="text-xs font-mono tabular-nums text-white/70">{mm}:{ss}</span>
    </div>
  );
}

function FocusOverlay({ topic, slug, contentStyle, topicHighlights, isComplete, onExit, onMarkComplete }: FocusOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const fn = () => {
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? (el.scrollTop / max) * 100 : 0;
      setProgress(pct);
      if (pct >= 90 && !isComplete) setReachedEnd(true);
    };
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, [isComplete]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExit]);

  return createPortal(
    <div className="fixed inset-0 z-[300] bg-background flex flex-col overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-0.5 bg-primary transition-all duration-150 z-10"
        style={{ width: `${progress}%` }} />

      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-primary/80 uppercase tracking-wider">
            <Maximize2 className="w-3.5 h-3.5" />Focus Mode
          </span>
          <span className="hidden sm:block text-xs text-muted-foreground/60">·</span>
          <span className="hidden sm:block text-xs text-muted-foreground/70 truncate max-w-xs">{topic.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <PomodoroTimer />
          <button onClick={onExit}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted">
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
            <kbd className="hidden sm:inline ml-1 text-muted-foreground/40 font-mono">esc</kbd>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12">

          {/* Article header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-muted-foreground">
              <span className={`px-2 py-0.5 rounded-full font-medium ${categoryColors[topic.category]}`}>{topic.category}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{topic.readTime} min read</span>
              <span>{topic.sections.length} sections</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{topic.title}</h1>
            <p className="text-base text-muted-foreground leading-relaxed">{topic.description}</p>
          </header>

          {/* Sections */}
          <div className="space-y-14" style={contentStyle}>
            {topic.sections.map((section, i) => (
              <div key={i} id={`focus-section-${i}`} className="scroll-mt-10">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-xs font-mono text-muted-foreground/40 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <div className="pl-8 space-y-4">
                  {section.content.split("\n\n").map((para, j) => (
                    <ContentParagraph key={j} text={para} highlights={topicHighlights} />
                  ))}
                  {section.code && <CodeBlock code={section.code} />}
                </div>
              </div>
            ))}
          </div>

          {/* Auto-complete nudge */}
          {reachedEnd && !isComplete && (
            <div className="mt-16 p-5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-center fade-up">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3">You've read the whole article!</p>
              <button onClick={() => { onMarkComplete(); setReachedEnd(false); }}
                className="flex items-center gap-2 mx-auto px-5 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-colors">
                <CheckCircle2 className="w-4 h-4" />Mark as complete
              </button>
            </div>
          )}
          {isComplete && (
            <div className="mt-16 flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 pb-8">
              <CheckCircle2 className="w-4 h-4" />Topic completed
            </div>
          )}

          <div className="h-20" />
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── MobileTOC ───────────────────────────────────────────── */
function MobileTOC({
  sections, activeSection, onClose,
}: { sections: { title: string; code?: string }[]; activeSection: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-background border-t border-border rounded-t-2xl max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-background border-b border-border px-5 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold flex items-center gap-2"><List className="w-4 h-4 text-muted-foreground" />Contents</p>
          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <ol className="px-5 py-3 space-y-0.5">
          {sections.map((section, i) => (
            <li key={i}>
              <a href={`#section-${i}`} onClick={onClose}
                className={`flex items-center gap-3 text-sm py-2.5 px-2 rounded-md transition-colors ${
                  activeSection === i ? "text-primary bg-primary/8 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}>
                <span className={`text-xs font-mono w-5 text-right tabular-nums ${activeSection === i ? "text-primary/70" : "text-muted-foreground/40"}`}>{i + 1}</span>
                <span>{section.title}</span>
                {section.code && <span className="ml-auto text-xs font-mono text-muted-foreground/40">code</span>}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ── TopicDetail ─────────────────────────────────────────── */
export default function TopicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isComplete, toggleComplete, recordVisit } = useApp();
  const { fontSize, lineHeight, focusMode, wideColumn, toggleFocusMode } = usePrefs();
  const { topicHighlights, add: addHighlight } = useHighlights(slug);
  const { getScore } = useQuizScores();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { recheckAchievements } = useAchievements();
  const quizScore   = slug ? getScore(slug) : null;
  const hasQuiz     = slug ? (quizzes[slug]?.length ?? 0) > 0 : false;
  const bookmarked  = slug ? isBookmarked(slug) : false;

  const [activeSection,  setActiveSection]  = useState(0);
  const [showShortcuts,  setShowShortcuts]  = useState(false);
  const [showMobileTOC,  setShowMobileTOC]  = useState(false);
  const [showPrefs,      setShowPrefs]      = useState(false);
  const [selToolbar,     setSelToolbar]     = useState<{ x: number; y: number; text: string } | null>(null);

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const articleRef  = useRef<HTMLDivElement>(null);
  const topic       = getTopicBySlug(slug);

  useEffect(() => {
    if (slug && topic) {
      recordVisit(slug);
      window.dispatchEvent(new CustomEvent("genai:topic-visit", {
        detail: { slug, category: topic.category },
      }));
    }
  }, [slug, topic?.category, recordVisit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scrollspy
  useEffect(() => {
    if (!topic) return;
    sectionRefs.current = topic.sections.map((_, i) => document.getElementById(`section-${i}`));
    const obs = new IntersectionObserver(
      entries => { for (const e of entries) if (e.isIntersecting) setActiveSection(Number(e.target.id.replace("section-", ""))); },
      { rootMargin: "-15% 0px -65% 0px" }
    );
    sectionRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [topic]);

  // Text selection → highlight toolbar
  const onArticleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) { setSelToolbar(null); return; }
    const text = sel.toString().trim();
    if (text.length < 3 || text.length > 600) { setSelToolbar(null); return; }
    if (!articleRef.current) return;
    const range = sel.getRangeAt(0);
    if (!articleRef.current.contains(range.commonAncestorContainer)) { setSelToolbar(null); return; }
    const rect = range.getBoundingClientRect();
    setSelToolbar({ x: rect.left + rect.width / 2, y: rect.top, text });
  }, []);

  const dismissToolbar = useCallback(() => {
    setSelToolbar(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  const topicIndex = topics.findIndex(t => t.slug === slug);
  const prevTopic  = topicIndex > 0 ? topics[topicIndex - 1] : null;
  const nextTopic  = topicIndex < topics.length - 1 ? topics[topicIndex + 1] : null;

  useKeyboardNav({
    sections: topic?.sections ?? [],
    activeSection,
    prevSlug: prevTopic?.slug ?? null,
    nextSlug: nextTopic?.slug ?? null,
    onToggleComplete: () => { if (slug) toggleComplete(slug); },
    onToggleShortcuts: () => setShowShortcuts(s => !s),
  });

  // F key → toggle focus mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "f") { e.preventDefault(); toggleFocusMode(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleFocusMode]);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-xs font-mono text-muted-foreground mb-3">404</p>
          <h1 className="text-xl font-semibold mb-3">Topic not found</h1>
          <p className="text-sm text-muted-foreground mb-6">No topic with slug "{slug}"</p>
          <Link href="/topics" className="text-sm text-primary hover:underline">← Back to Topics</Link>
        </div>
      </div>
    );
  }

  const complete      = isComplete(slug);
  const relatedTopics = topic.relatedSlugs.map(s => topics.find(t => t.slug === s)).filter(Boolean) as typeof topics;
  const codeCount     = topic.sections.filter(s => s.code).length;

  // Content style from reading prefs
  const contentStyle = {
    fontSize:   fontSizePx[fontSize],
    lineHeight: lineHeightVal[lineHeight],
  };

  const maxW = wideColumn ? "max-w-7xl" : "max-w-6xl";

  return (
    <>
      <ReadingProgress />
      {focusMode && (
        <FocusOverlay
          topic={topic}
          slug={slug}
          contentStyle={contentStyle}
          topicHighlights={topicHighlights}
          isComplete={complete}
          onExit={toggleFocusMode}
          onMarkComplete={() => { toggleComplete(slug); recordTopicRead(slug); recheckAchievements(); }}
        />
      )}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showMobileTOC  && <MobileTOC sections={topic.sections} activeSection={activeSection} onClose={() => setShowMobileTOC(false)} />}
      {selToolbar     && (
        <SelectionToolbar
          x={selToolbar.x} y={selToolbar.y} text={selToolbar.text}
          onHighlight={(text, colorId) => addHighlight(text, colorId)}
          onDismiss={dismissToolbar}
        />
      )}

      <div className="min-h-screen py-8 px-5 sm:px-8">
        <div className={`${maxW} mx-auto`}>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 fade-up">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/topics" className="hover:text-foreground transition-colors">Topics</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{topic.title}</span>
          </nav>

          <div className="flex gap-10 xl:gap-14">

            {/* ── Main Content ────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Header */}
              <header className="mb-8 fade-up-1">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[topic.category]}`}>{topic.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[topic.difficulty]}`}>{topic.difficulty}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{topic.readTime} min read</span>
                  {topic.references && topic.references.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><FileText className="w-3 h-3" />{topic.references.length} sources</span>
                  )}
                  {complete && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3 h-3" />Completed
                    </span>
                  )}

                  {/* Reading prefs + bookmark */}
                  <div className="relative ml-auto flex items-center gap-2">
                    {slug && (
                      <button
                        onClick={() => { toggleBookmark(slug); recheckAchievements(); }}
                        title={bookmarked ? "Remove bookmark" : "Save bookmark"}
                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border transition-colors ${
                          bookmarked ? "border-primary/40 bg-primary/8 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}>
                        <Bookmark className={`w-3 h-3 ${bookmarked ? "fill-current" : ""}`} />
                        {bookmarked ? "Saved" : "Save"}
                      </button>
                    )}
                    <button onClick={() => setShowPrefs(p => !p)}
                      className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border transition-colors ${
                        showPrefs ? "border-primary bg-primary/8 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}>
                      <SlidersHorizontal className="w-3 h-3" />Aa
                    </button>
                    <button onClick={() => setShowShortcuts(true)}
                      className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                      <Keyboard className="w-3 h-3" /><span className="font-mono">?</span>
                    </button>
                    {showPrefs && <ReadingPrefsPanel onClose={() => setShowPrefs(false)} />}
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">{topic.title}</h1>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{topic.description}</p>
              </header>

              {/* Prerequisites */}
              <PrerequisitesBanner slug={slug} />

              {/* Key Takeaways */}
              <KeyTakeaways sections={topic.sections} />

              {/* Table of Contents */}
              <div className="mb-10 p-4 rounded-md border border-border bg-card/50 fade-up-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  <BookOpen className="w-3.5 h-3.5" />Contents
                </p>
                <ol className="space-y-1.5">
                  {topic.sections.map((section, i) => (
                    <li key={i}>
                      <a href={`#section-${i}`}
                        className={`flex items-center gap-2.5 text-sm transition-colors group py-0.5 ${
                          activeSection === i ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                        }`}>
                        <span className={`text-xs font-mono w-4 text-right tabular-nums transition-colors ${activeSection === i ? "text-primary/70" : "text-muted-foreground/40"}`}>{i + 1}</span>
                        <span>{section.title}</span>
                        {section.code && <span className="ml-auto text-xs font-mono text-muted-foreground/40">code</span>}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Sections */}
              <div ref={articleRef} className="space-y-12" onMouseUp={onArticleMouseUp} style={contentStyle}>
                {topic.sections.map((section, i) => (
                  <div key={i} id={`section-${i}`} className="scroll-mt-20 fade-up">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-xs font-mono text-muted-foreground/40 tabular-nums pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="text-xl font-semibold">{section.title}</h2>
                    </div>
                    <div className="pl-8 space-y-4">
                      {section.content.split("\n\n").map((para, j) => (
                        <ContentParagraph key={j} text={para} highlights={topicHighlights} />
                      ))}
                      {section.code && <CodeBlock code={section.code} />}
                      {diagramRegistry[`${topic.slug}:${i}`]}
                      {interactiveRegistry[`${topic.slug}:${i}`] && (
                        <InteractiveDiagram id={`${topic.slug}:${i}`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Highlight tip */}
              {topicHighlights.length > 0 && (
                <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground/60">
                  <Highlighter className="w-3 h-3" />
                  {topicHighlights.length} highlight{topicHighlights.length !== 1 ? "s" : ""} saved —{" "}
                  <Link href="/notes" className="hover:text-primary transition-colors">view all notes →</Link>
                </div>
              )}

              {/* References */}
              {topic.references && topic.references.length > 0 && <ReferenceList refs={topic.references} />}

              {/* Mark as Complete */}
              <div className="mt-10 pt-8 border-t border-border flex items-center justify-between gap-4">
                <button onClick={() => {
                  toggleComplete(slug);
                  if (!complete) recordTopicRead(slug);
                  recheckAchievements();
                }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    complete
                      ? "border-emerald-500/40 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/12"
                      : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted"
                  }`}>
                  {complete
                    ? <><CheckCircle2 className="w-4 h-4" />Completed — click to undo</>
                    : <><Circle className="w-4 h-4" />Mark as complete</>}
                </button>
                <kbd className="hidden sm:block px-2 py-0.5 text-xs font-mono text-muted-foreground/40 border border-border rounded">c</kbd>
              </div>

              {/* Prev / Next */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {prevTopic ? (
                  <Link href={`/topic/${prevTopic.slug}`}>
                    <div className="group p-4 rounded-md border border-border bg-card hover:border-primary/30 transition-colors h-full">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><ArrowLeft className="w-3 h-3" />Previous</div>
                      <div className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">{prevTopic.title}</div>
                    </div>
                  </Link>
                ) : <div />}
                {nextTopic ? (
                  <Link href={`/topic/${nextTopic.slug}`}>
                    <div className="group p-4 rounded-md border border-border bg-card hover:border-primary/30 transition-colors h-full text-right">
                      <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground mb-1">Next <ArrowRight className="w-3 h-3" /></div>
                      <div className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">{nextTopic.title}</div>
                    </div>
                  </Link>
                ) : <div />}
              </div>

              <p className="mt-6 text-xs text-muted-foreground/40 text-center sm:hidden">
                Use <kbd className="px-1 border border-border rounded font-mono">[</kbd> / <kbd className="px-1 border border-border rounded font-mono">]</kbd> to navigate topics
              </p>
            </div>

            {/* ── Sidebar ─────────────────────────── */}
            {!focusMode && (
              <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                <div className="sticky top-20 space-y-5">

                  <div className="p-4 rounded-md border border-border bg-card">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">This Article</p>
                    <dl className="space-y-2 mb-4">
                      {[
                        { label: "Sections",      val: topic.sections.length },
                        { label: "Read time",     val: `${topic.readTime} min` },
                        { label: "Code examples", val: codeCount },
                        ...(topic.references ? [{ label: "Sources", val: topic.references.length }] : []),
                        ...(topicHighlights.length > 0 ? [{ label: "Your highlights", val: topicHighlights.length }] : []),
                      ].map(({ label, val }) => (
                        <div key={label} className="flex justify-between">
                          <dt className="text-xs text-muted-foreground">{label}</dt>
                          <dd className="text-xs font-medium tabular-nums">{val}</dd>
                        </div>
                      ))}
                    </dl>
                    <button onClick={() => toggleComplete(slug)}
                      className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md border text-xs font-medium transition-all ${
                        complete
                          ? "border-emerald-500/40 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted"
                      }`}>
                      {complete
                        ? <><CheckCircle2 className="w-3.5 h-3.5" />Completed</>
                        : <><Circle className="w-3.5 h-3.5" />Mark complete</>}
                    </button>

                    {hasQuiz && (
                      <Link href={`/quiz/${slug}`}>
                        <button className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md border text-xs font-medium transition-all ${
                          quizScore
                            ? "border-primary/30 bg-primary/5 text-primary hover:opacity-80"
                            : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted"
                        }`}>
                          {quizScore
                            ? <>✓ Quiz: {quizScore.score}/{quizScore.total} — Retake</>
                            : <>📝 Take the Quiz</>}
                        </button>
                      </Link>
                    )}

                    {slug && (
                      <button
                        onClick={() => { toggleBookmark(slug); recheckAchievements(); }}
                        className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md border text-xs font-medium transition-all ${
                          bookmarked
                            ? "border-primary/30 bg-primary/6 text-primary"
                            : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted"
                        }`}>
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current" : ""}`} />
                        {bookmarked ? "Bookmarked" : "Bookmark"}
                      </button>
                    )}
                  </div>

                  {/* Voice Reader */}
                  <VoiceReader title={topic.title} sections={topic.sections} />

                  {/* Scrollspy TOC */}
                  <div className="p-4 rounded-md border border-border bg-card">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">On this page</p>
                    <ol className="space-y-1">
                      {topic.sections.map((section, i) => (
                        <li key={i}>
                          <a href={`#section-${i}`}
                            className={`flex items-center gap-2 text-xs py-0.5 transition-colors ${
                              activeSection === i ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${activeSection === i ? "bg-primary" : "bg-border"}`} />
                            <span className="line-clamp-1">{section.title}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Key Papers */}
                  {topic.references && topic.references.filter(r => r.type === "paper").length > 0 && (
                    <div className="p-4 rounded-md border border-border bg-card">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Papers</p>
                      <div className="space-y-3">
                        {topic.references.filter(r => r.type === "paper").map((ref, i) => (
                          <div key={i}>
                            {ref.url
                              ? <a href={ref.url} target="_blank" rel="noopener noreferrer" className="group">
                                  <p className="text-xs text-foreground group-hover:text-primary transition-colors leading-snug mb-0.5">{ref.title}</p>
                                  <p className="text-xs text-muted-foreground/60 leading-snug">
                                    {ref.authors.split(",")[0].trim()}{ref.authors.includes(",") ? " et al." : ""} · {ref.year}
                                    {ref.venue && <span className="ml-1 font-mono">· {ref.venue}</span>}
                                  </p>
                                </a>
                              : <div>
                                  <p className="text-xs text-foreground leading-snug mb-0.5">{ref.title}</p>
                                  <p className="text-xs text-muted-foreground/60">{ref.authors.split(",")[0].trim()}{ref.authors.includes(",") ? " et al." : ""} · {ref.year}</p>
                                </div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Topics */}
                  {relatedTopics.length > 0 && (
                    <div className="p-4 rounded-md border border-border bg-card">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Related Topics</p>
                      <div className="space-y-1">
                        {relatedTopics.map(rel => (
                          <Link key={rel.slug} href={`/topic/${rel.slug}`}>
                            <div className="group flex items-center justify-between gap-2 py-1.5 px-2 rounded hover:bg-muted transition-colors cursor-pointer">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {isComplete(rel.slug) && <CheckCircle2 className="w-3 h-3 flex-shrink-0 text-emerald-500" />}
                                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1">{rel.title}</span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-xs text-muted-foreground/50 tabular-nums">{rel.readTime}m</span>
                                <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nav links */}
                  <div className="p-4 rounded-md border border-border bg-card">
                    <div className="space-y-1">
                      <Link href="/topics" className="flex items-center gap-2 py-1.5 px-2 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <BookOpen className="w-3.5 h-3.5" />All Topics
                      </Link>
                      <Link href="/learning-paths" className="flex items-center gap-2 py-1.5 px-2 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />Learning Paths
                      </Link>
                      <Link href="/glossary" className="flex items-center gap-2 py-1.5 px-2 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <BookMarked className="w-3.5 h-3.5" />Glossary
                      </Link>
                      <Link href="/progress" className="flex items-center gap-2 py-1.5 px-2 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" />My Progress
                      </Link>
                      <Link href="/notes" className="flex items-center gap-2 py-1.5 px-2 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <Highlighter className="w-3.5 h-3.5" />My Notes
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Mobile TOC button */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button onClick={() => setShowMobileTOC(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-foreground text-background text-xs font-medium shadow-lg hover:opacity-90 transition-opacity">
          <List className="w-3.5 h-3.5" />Contents
          <span className="font-mono opacity-60">{activeSection + 1}/{topic.sections.length}</span>
        </button>
      </div>
    </>
  );
}
