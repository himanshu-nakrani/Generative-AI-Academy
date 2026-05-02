import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, BookOpen, Layers, Network, FlaskConical,
  Cpu, Microscope, ChevronRight, Flame, CheckCircle2, Clock,
  Zap, CheckCircle, XCircle,
} from "lucide-react";
import { topics, categoryColors, categories, learningPaths, type Category } from "@/data/topics";
import { getTopicBySlug } from "@/data/topics";
import { getDailyQuestion } from "@/data/quizzes";
import { loadDailyRecord, saveDailyRecord } from "@/hooks/useQuizScores";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useApp } from "@/context/AppContext";

const OPTION_LABELS = ["A", "B", "C", "D"];

function DailyChallengeWidget() {
  const { question, dateKey } = useMemo(() => getDailyQuestion(), []);
  const topic = getTopicBySlug(question.slug);

  const existing = loadDailyRecord();
  const alreadyAnswered = existing?.dateKey === dateKey;

  const [selected, setSelected]  = useState<number | null>(alreadyAnswered ? existing!.selected : null);
  const [revealed, setRevealed]  = useState(alreadyAnswered);

  const submit = () => {
    if (selected === null || revealed) return;
    const correct = selected === question.answer;
    saveDailyRecord({ dateKey, selected, correct });
    setRevealed(true);
  };

  const isCorrect = revealed && selected === question.answer;

  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Daily Challenge</span>
        {revealed && (
          <span className={`ml-auto text-xs font-medium ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
          </span>
        )}
      </div>

      {topic && (
        <p className="text-xs text-muted-foreground mb-2">
          From: <Link href={`/topic/${question.slug}`}><span className="text-primary hover:underline cursor-pointer">{topic.title}</span></Link>
        </p>
      )}

      <p className="text-sm font-medium leading-snug mb-3">{question.q}</p>

      <div className="space-y-1.5 mb-3">
        {question.options.map((opt, idx) => {
          let cls = "w-full text-left flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition-all";
          if (revealed) {
            if (idx === question.answer) cls += " border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200";
            else if (idx === selected)   cls += " border-red-400 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
            else                         cls += " border-border/50 text-muted-foreground/50";
          } else if (idx === selected) {
            cls += " border-primary bg-primary/6 cursor-pointer";
          } else {
            cls += " border-border bg-card hover:border-primary/40 cursor-pointer";
          }
          return (
            <button key={idx} className={cls} onClick={() => !revealed && setSelected(idx)}>
              <span className="w-5 h-5 flex-shrink-0 rounded-full border text-xs flex items-center justify-center font-bold border-current">
                {OPTION_LABELS[idx]}
              </span>
              <span className="line-clamp-2 text-left">{opt}</span>
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button
          onClick={submit}
          disabled={selected === null}
          className="w-full py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
          Submit Answer
        </button>
      ) : (
        <div className="text-xs text-muted-foreground leading-relaxed bg-muted/40 rounded-md px-3 py-2">
          {question.explanation}
        </div>
      )}
    </div>
  );
}

const featuredSlugs = [
  "transformers", "large-language-models", "diffusion-models",
  "rlhf", "ai-agents", "attention-mechanism",
];

const categoryMeta: Record<string, { icon: React.ReactNode; summary: string }> = {
  "Foundations":       { icon: <BookOpen className="w-4 h-4" />,   summary: "Neural networks, probability, training — the bedrock every practitioner needs." },
  "Core Models":       { icon: <Network className="w-4 h-4" />,    summary: "Transformers, diffusion, LLMs — the architectures powering modern AI." },
  "Techniques":        { icon: <FlaskConical className="w-4 h-4" />, summary: "RLHF, RAG, fine-tuning, prompt engineering — how to train and deploy models." },
  "Applications":      { icon: <Cpu className="w-4 h-4" />,        summary: "Code, vision, speech, video — real-world applications across modalities." },
  "Advanced Research": { icon: <Microscope className="w-4 h-4" />, summary: "Interpretability, safety, world models — the research frontier." },
};

const pathKeys = ["beginner", "intermediate", "advanced"] as const;
const pathAccent: Record<string, string> = {
  beginner: "bg-emerald-500", intermediate: "bg-violet-500", advanced: "bg-slate-600",
};

function CategoryPanel({ category, idx }: { category: Category; idx: number }) {
  const catTopics = topics.filter(t => t.category === category);
  const meta = categoryMeta[category];
  const ref = useScrollReveal();
  return (
    <Link href={`/topics?category=${encodeURIComponent(category)}`}>
      <div ref={ref as React.Ref<HTMLDivElement>} className={`reveal reveal-delay-${idx + 1} topic-card group rounded-lg p-5 h-full cursor-pointer`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
              {meta.icon}
            </span>
            <span className="text-sm font-semibold text-foreground">{category}</span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">{catTopics.length}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{meta.summary}</p>
        <ul className="space-y-1.5">
          {catTopics.slice(0, 4).map(t => (
            <li key={t.slug} className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-border flex-shrink-0" />
              {t.title}
            </li>
          ))}
          {catTopics.length > 4 && (
            <li className="text-xs text-primary/80 flex items-center gap-1 pl-3">+{catTopics.length - 4} more</li>
          )}
        </ul>
      </div>
    </Link>
  );
}

export default function Home() {
  const { completed, isComplete, recentlyRead, streak } = useApp();
  const completedCount = completed.size;

  const featuredTopics = featuredSlugs
    .map(slug => topics.find(t => t.slug === slug))
    .filter(Boolean) as typeof topics;

  // Next unread topic (for returning users)
  const nextUnread = useMemo(() => topics.find(t => !completed.has(t.slug)), [completed]);

  // "Your next reads" — related to completed but not yet read
  const nextReads = useMemo(() => {
    if (completed.size === 0) return featuredTopics;
    const completedTopics = topics.filter(t => completed.has(t.slug));
    const related = new Set(completedTopics.flatMap(t => t.relatedSlugs));
    const unread  = topics.filter(t => related.has(t.slug) && !completed.has(t.slug));
    return unread.length >= 4 ? unread.slice(0, 6) : topics.filter(t => !completed.has(t.slug)).slice(0, 6);
  }, [completed]);

  const recentTopics = recentlyRead
    .map(slug => topics.find(t => t.slug === slug))
    .filter(Boolean) as typeof topics;

  const pctOverall = Math.round((completedCount / topics.length) * 100);

  const heroRef    = useScrollReveal();
  const featuredRef = useScrollReveal();
  const catRef     = useScrollReveal();

  const isReturning = completedCount > 0 || recentlyRead.length > 0;

  return (
    <div className="min-h-screen">

      {/* ── Returning user dashboard ──────────────────────────── */}
      {isReturning && (
        <section className="border-b border-border bg-card/60 py-6 px-5 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">

              {/* Progress ring */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="relative w-14 h-14">
                  <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                    <circle
                      cx="28" cy="28" r="22" fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 22}
                      strokeDashoffset={2 * Math.PI * 22 * (1 - completedCount / topics.length)}
                      style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold tabular-nums">{pctOverall}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">{completedCount}/{topics.length} topics</p>
                  <p className="text-xs text-muted-foreground">
                    {streak > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-orange-500 font-medium mr-1.5">
                        <Flame className="w-3 h-3" />{streak}d
                      </span>
                    )}
                    {completedCount === 0 ? "Start reading to track progress" : `${pctOverall}% complete`}
                  </p>
                </div>
              </div>

              {/* Path progress */}
              <div className="flex-1 grid grid-cols-3 gap-3 min-w-0">
                {pathKeys.map(key => {
                  const path = learningPaths[key];
                  const pathTopics = path.slugs.map(s => topics.find(t => t.slug === s)).filter(Boolean) as typeof topics;
                  const done = pathTopics.filter(t => isComplete(t.slug)).length;
                  const pct  = pathTopics.length > 0 ? Math.round((done / pathTopics.length) * 100) : 0;
                  return (
                    <Link key={key} href="/learning-paths">
                      <div className="group cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-muted-foreground truncate group-hover:text-foreground transition-colors">
                            {path.title}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground/60 flex-shrink-0 ml-1">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${pathAccent[key]}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="flex-shrink-0 flex gap-2">
                {nextUnread && (
                  <Link href={`/topic/${nextUnread.slug}`}>
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                      Continue <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                )}
                <Link href="/progress">
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-background text-foreground text-xs font-medium hover:bg-muted transition-colors whitespace-nowrap">
                    Stats
                  </button>
                </Link>
              </div>
            </div>

            {/* Recently visited */}
            {recentTopics.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 overflow-x-auto">
                <span className="text-xs text-muted-foreground flex-shrink-0">Recent:</span>
                {recentTopics.slice(0, 5).map(t => (
                  <Link key={t.slug} href={`/topic/${t.slug}`}>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80">
                      {isComplete(t.slug) && <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                      {t.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-16 pb-12 px-5 sm:px-8 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <div className="fade-up mb-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground border border-border rounded px-2 py-1 bg-muted/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              v2025 · {topics.length} articles
            </span>
          </div>
          <h1 className="fade-up-1 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-5 max-w-3xl">
            Generative AI<br />
            <span className="gradient-text">from First Principles</span>
          </h1>
          <p className="fade-up-2 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
            A structured, citable curriculum covering every concept in modern generative AI —
            from neural network fundamentals to mechanistic interpretability and safety.
          </p>
          <div className="fade-up-3 flex flex-wrap gap-3 mb-10">
            <Link
              href="/learning-paths"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {isReturning ? "Learning Paths" : "Start with a Learning Path"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/topics"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Browse All Topics
            </Link>
          </div>
          <div className="fade-up-4 flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 border-t border-border text-sm text-muted-foreground">
            {[
              { val: topics.length, label: "in-depth articles" },
              { val: categories.length, label: "topic categories" },
              { val: 3, label: "guided learning paths" },
              { val: "70+", label: "glossary terms" },
            ].map(({ val, label }) => (
              <span key={label} className="flex items-baseline gap-1.5">
                <span className="text-foreground font-semibold tabular-nums">{val}</span>
                <span>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Daily Challenge ──────────────────────────────────── */}
      <section className="py-10 px-5 sm:px-8 border-b border-border bg-gradient-to-r from-amber-50/40 to-violet-50/40 dark:from-amber-950/10 dark:to-violet-950/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">Test your knowledge</p>
              <h2 className="text-xl font-semibold mb-2">Daily Challenge</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                One question every day, drawn from across all 40 topics. Answer it, read the explanation, and link out to the full article. A new question resets at midnight.
              </p>
            </div>
            <DailyChallengeWidget />
          </div>
        </div>
      </section>

      {/* ── Curriculum Overview ──────────────────────────────── */}
      <section className="py-14 px-5 sm:px-8 border-b border-border">
        <div ref={catRef as React.Ref<HTMLDivElement>} className="max-w-5xl mx-auto">
          <div className="reveal flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-1">Curriculum</h2>
              <p className="text-sm text-muted-foreground">Five structured categories — browse by topic or follow a guided path.</p>
            </div>
            <Link href="/topics" className="text-sm text-primary hover:underline hidden sm:flex items-center gap-1">
              All topics <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(categories as Category[]).map((cat, i) => (
              <CategoryPanel key={cat} category={cat} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured / Next reads ────────────────────────────── */}
      <section className="py-14 px-5 sm:px-8 border-b border-border">
        <div ref={featuredRef as React.Ref<HTMLDivElement>} className="max-w-5xl mx-auto">
          <div className="reveal flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {isReturning ? "Your Next Reads" : "Core Articles"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isReturning
                  ? "Unread topics based on what you've already studied."
                  : "The six most foundational topics — start here if you're new to the field."}
              </p>
            </div>
            <Link href="/topics" className="text-sm text-primary hover:underline hidden sm:flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nextReads.map((topic, i) => {
              const done = isComplete(topic.slug);
              return (
                <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                  <div className={`reveal reveal-delay-${Math.min(i + 1, 6)} topic-card group rounded-lg p-5 cursor-pointer ${done ? "opacity-60" : ""}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-sm font-semibold group-hover:text-primary transition-colors leading-snug">
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {done
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          : <><span className="text-xs text-muted-foreground tabular-nums">{topic.readTime}m</span>
                             <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" /></>
                        }
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">{topic.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[topic.category]}`}>
                        {topic.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{topic.readTime}m
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why this curriculum ──────────────────────────────── */}
      <section className="py-14 px-5 sm:px-8 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Citable sources",   body: "Every major claim links to the original paper — Vaswani et al., Rombach et al., Brown et al. No hand-waving." },
              { label: "Working code",      body: "100+ examples in Python and PyTorch that implement what the text describes. Copy, run, modify." },
              { label: "Structured depth",  body: "Three difficulty levels, five categories, three curated learning paths. Read linearly or jump to what you need." },
            ].map(({ label, body }) => (
              <div key={label} className="reveal">
                <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-14 px-5 sm:px-8">
        <div ref={heroRef as React.Ref<HTMLDivElement>} className="max-w-5xl mx-auto">
          <div className="reveal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-7 rounded-lg border border-border bg-card">
            <div>
              <p className="text-base font-semibold mb-1">Ready to build your understanding?</p>
              <p className="text-sm text-muted-foreground">Follow a structured path from zero to researcher, or jump directly to any topic.</p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link href="/learning-paths" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Layers className="w-3.5 h-3.5" />Learning Paths
              </Link>
              <Link href="/glossary" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors">
                Glossary
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
