import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, ArrowRight, Clock, BookOpen, ChevronRight,
  Copy, Check, ExternalLink, FileText, Globe, MessageSquare,
  Video, BookMarked, CheckCircle2, Circle, Keyboard, X, List
} from "lucide-react";
import { getTopicBySlug, topics, categoryColors, difficultyColors, type Reference } from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="reading-progress" style={{ width: `${progress}%` }} />;
}

function CodeBlock({ code, language = "python" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="mt-5 rounded-md overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <div className="flex items-center gap-2">
          {language === "python" && (
            <a href="https://colab.new" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded hover:bg-muted">
              <ExternalLink className="w-3 h-3" />Colab
            </a>
          )}
          <button onClick={copy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded hover:bg-muted">
            {copied ? <><Check className="w-3 h-3 text-green-500" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
          </button>
        </div>
      </div>
      <pre className="code-block rounded-none border-none overflow-x-auto"><code>{code}</code></pre>
    </div>
  );
}

function RefTypeIcon({ type }: { type: Reference["type"] }) {
  const cls = "w-3 h-3 flex-shrink-0";
  if (type === "paper")  return <FileText className={cls} />;
  if (type === "blog")   return <Globe className={cls} />;
  if (type === "tweet")  return <MessageSquare className={cls} />;
  if (type === "video")  return <Video className={cls} />;
  if (type === "docs")   return <BookMarked className={cls} />;
  return <Globe className={cls} />;
}

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
                    <ExternalLink className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0 group-hover/link:text-primary transition-colors" />
                  </a>
                : <span className="text-sm text-foreground leading-snug">{ref.title}</span>}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <RefTypeIcon type={ref.type} />
                  <span className="text-xs">{ref.authors}</span>
                </span>
                {ref.year && <span className="text-xs text-muted-foreground/60">{ref.year}</span>}
                {ref.venue && <span className="text-xs px-1.5 py-0 rounded border border-border text-muted-foreground/70 font-mono">{ref.venue}</span>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ContentParagraph({ text }: { text: string }) {
  const isNumberedList = /^\d+\./.test(text.trim());
  const isBulletList   = /^[-•]/.test(text.trim());
  if (isNumberedList || isBulletList) {
    const lines = text.split("\n").filter(Boolean);
    return (
      <ul className="space-y-2 my-1">
        {lines.map((line, k) => (
          <li key={k} className="flex gap-2.5">
            <span className="text-primary/50 flex-shrink-0 mt-0.5 text-sm font-mono">{isNumberedList ? `${k + 1}.` : "–"}</span>
            <span className="text-[0.9375rem] text-muted-foreground leading-relaxed">
              {line.replace(/^\d+\.\s*/, "").replace(/^[-•]\s*/, "")}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <p className="text-[0.9375rem] text-muted-foreground leading-[1.85]">
      {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-foreground font-medium">{part}</strong> : part)}
    </p>
  );
}

function ShortcutsModal({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { key: "j / k",    desc: "Jump to next / previous section" },
    { key: "[ / ]",    desc: "Go to previous / next topic" },
    { key: "c",        desc: "Toggle mark as complete" },
    { key: "?",        desc: "Show / hide this dialog" },
  ];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-xl border border-border bg-background shadow-lg p-5"
        onClick={e => e.stopPropagation()}
      >
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
        <p className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">Press <kbd className="px-1 py-0.5 rounded border border-border bg-muted font-mono">?</kbd> anywhere on a topic page to toggle this.</p>
      </div>
    </div>
  );
}

function MobileTOC({
  sections, activeSection, onClose,
}: { sections: { title: string; code?: string }[]; activeSection: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-background border-t border-border rounded-t-2xl max-h-[70vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b border-border px-5 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold flex items-center gap-2"><List className="w-4 h-4 text-muted-foreground" />Contents</p>
          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <ol className="px-5 py-3 space-y-0.5">
          {sections.map((section, i) => (
            <li key={i}>
              <a
                href={`#section-${i}`}
                onClick={onClose}
                className={`flex items-center gap-3 text-sm py-2.5 px-2 rounded-md transition-colors ${
                  activeSection === i ? "text-primary bg-primary/8 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
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

export default function TopicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isComplete, toggleComplete, recordVisit } = useApp();
  const [activeSection, setActiveSection] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const topic = getTopicBySlug(slug);

  // Record visit for streak / recently read
  useEffect(() => {
    if (slug) recordVisit(slug);
  }, [slug, recordVisit]);

  // Scrollspy
  useEffect(() => {
    if (!topic) return;
    sectionRefs.current = topic.sections.map((_, i) => document.getElementById(`section-${i}`));
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(Number(entry.target.id.replace("section-", "")));
          }
        }
      },
      { rootMargin: "-15% 0px -65% 0px" }
    );
    sectionRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [topic]);

  const topicIndex  = topics.findIndex(t => t.slug === slug);
  const prevTopic   = topicIndex > 0 ? topics[topicIndex - 1] : null;
  const nextTopic   = topicIndex < topics.length - 1 ? topics[topicIndex + 1] : null;

  // Keyboard navigation
  useKeyboardNav({
    sections: topic?.sections ?? [],
    activeSection,
    prevSlug: prevTopic?.slug ?? null,
    nextSlug: nextTopic?.slug ?? null,
    onToggleComplete: () => { if (slug) toggleComplete(slug); },
    onToggleShortcuts: () => setShowShortcuts(s => !s),
  });

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

  return (
    <>
      <ReadingProgress />
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showMobileTOC  && <MobileTOC sections={topic.sections} activeSection={activeSection} onClose={() => setShowMobileTOC(false)} />}

      <div className="min-h-screen py-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 fade-up">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/topics" className="hover:text-foreground transition-colors">Topics</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{topic.title}</span>
          </nav>

          <div className="flex gap-10 xl:gap-14">

            {/* ── Main Content ─────────────────────── */}
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
                  <button
                    onClick={() => setShowShortcuts(true)}
                    className="ml-auto hidden sm:flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    <Keyboard className="w-3 h-3" /><span className="font-mono">?</span>
                  </button>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">{topic.title}</h1>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{topic.description}</p>
              </header>

              {/* Table of Contents */}
              <div className="mb-10 p-4 rounded-md border border-border bg-card/50 fade-up-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  <BookOpen className="w-3.5 h-3.5" />Contents
                </p>
                <ol className="space-y-1.5">
                  {topic.sections.map((section, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className={`flex items-center gap-2.5 text-sm transition-colors group py-0.5 ${
                          activeSection === i ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className={`text-xs font-mono w-4 text-right tabular-nums transition-colors ${activeSection === i ? "text-primary/70" : "text-muted-foreground/40"}`}>{i + 1}</span>
                        <span>{section.title}</span>
                        {section.code && <span className="ml-auto text-xs font-mono text-muted-foreground/40">code</span>}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {topic.sections.map((section, i) => (
                  <div key={i} id={`section-${i}`} className="scroll-mt-20 fade-up">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-xs font-mono text-muted-foreground/40 tabular-nums pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="text-xl font-semibold">{section.title}</h2>
                    </div>
                    <div className="pl-8 space-y-4">
                      {section.content.split("\n\n").map((para, j) => <ContentParagraph key={j} text={para} />)}
                      {section.code && <CodeBlock code={section.code} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* References */}
              {topic.references && topic.references.length > 0 && <ReferenceList refs={topic.references} />}

              {/* Mark as Complete */}
              <div className="mt-10 pt-8 border-t border-border flex items-center justify-between gap-4">
                <button
                  onClick={() => toggleComplete(slug)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    complete
                      ? "border-emerald-500/40 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/12"
                      : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted"
                  }`}
                >
                  {complete ? <><CheckCircle2 className="w-4 h-4" />Completed — click to undo</> : <><Circle className="w-4 h-4" />Mark as complete</>}
                </button>
                <kbd className="hidden sm:block px-2 py-0.5 text-xs font-mono text-muted-foreground/40 border border-border rounded">c</kbd>
              </div>

              {/* Prev / Next Nav */}
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

              {/* Keyboard hint (mobile) */}
              <p className="mt-6 text-xs text-muted-foreground/40 text-center sm:hidden">
                Use <kbd className="px-1 border border-border rounded font-mono">[</kbd> / <kbd className="px-1 border border-border rounded font-mono">]</kbd> to navigate topics
              </p>
            </div>

            {/* ── Sidebar ──────────────────────────── */}
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
              <div className="sticky top-20 space-y-5">

                {/* Article meta */}
                <div className="p-4 rounded-md border border-border bg-card">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">This Article</p>
                  <dl className="space-y-2 mb-4">
                    {[
                      { label: "Sections",      val: topic.sections.length },
                      { label: "Read time",     val: `${topic.readTime} min` },
                      { label: "Code examples", val: codeCount },
                      ...(topic.references ? [{ label: "Sources", val: topic.references.length }] : []),
                    ].map(({ label, val }) => (
                      <div key={label} className="flex justify-between">
                        <dt className="text-xs text-muted-foreground">{label}</dt>
                        <dd className="text-xs font-medium tabular-nums">{val}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    onClick={() => toggleComplete(slug)}
                    className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md border text-xs font-medium transition-all ${
                      complete
                        ? "border-emerald-500/40 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted"
                    }`}
                  >
                    {complete ? <><CheckCircle2 className="w-3.5 h-3.5" />Completed</> : <><Circle className="w-3.5 h-3.5" />Mark complete</>}
                  </button>
                </div>

                {/* Scrollspy TOC */}
                <div className="p-4 rounded-md border border-border bg-card">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">On this page</p>
                  <ol className="space-y-1">
                    {topic.sections.map((section, i) => (
                      <li key={i}>
                        <a
                          href={`#section-${i}`}
                          className={`flex items-center gap-2 text-xs py-0.5 transition-colors ${
                            activeSection === i ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
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
                              <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
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
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile: floating TOC button */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setShowMobileTOC(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-foreground text-background text-xs font-medium shadow-lg hover:opacity-90 transition-opacity"
        >
          <List className="w-3.5 h-3.5" />
          Contents
          <span className="font-mono opacity-60">{activeSection + 1}/{topic.sections.length}</span>
        </button>
      </div>
    </>
  );
}
