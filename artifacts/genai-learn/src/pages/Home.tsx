import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, BookOpen, Layers, Network, FlaskConical,
  Cpu, Microscope, ChevronRight, Flame, CheckCircle2, Clock,
  Zap, RotateCcw, Target, ArrowUpRight,
} from "lucide-react";
import { topics, categoryColors, categories, learningPaths, type Category } from "@/data/topics";
import { getTopicBySlug } from "@/data/topics";
import { getDailyQuestion } from "@/data/quizzes";
import { loadDailyRecord, saveDailyRecord } from "@/hooks/useQuizScores";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useApp } from "@/context/AppContext";
import { getDueReviews } from "@/hooks/useSpacedRepetition";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { useWeeklyGoals } from "@/hooks/useWeeklyGoals";
import { DailyQuestsWidget } from "@/components/DailyQuests";

const OPTION_LABELS = ["A", "B", "C", "D"];

function DailyChallengeWidget() {
  const { question, dateKey } = useMemo(() => getDailyQuestion(), []);
  const topic = getTopicBySlug(question.slug);

  const existing = loadDailyRecord();
  const alreadyAnswered = existing?.dateKey === dateKey;

  const [selected, setSelected] = useState<number | null>(alreadyAnswered ? existing!.selected : null);
  const [revealed, setRevealed] = useState(alreadyAnswered);

  const submit = () => {
    if (selected === null || revealed) return;
    const correct = selected === question.answer;
    saveDailyRecord({ dateKey, selected, correct });
    setRevealed(true);
  };

  const isCorrect = revealed && selected === question.answer;

  return (
    <article className="p-6 rounded-2xl border border-border bg-card" aria-labelledby="daily-challenge-title">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center" aria-hidden="true">
          <Zap className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 id="daily-challenge-title" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Daily Challenge</h2>
          {revealed && (
            <span 
              className={`ml-2 text-sm font-medium ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
              role="status"
              aria-live="polite"
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </span>
          )}
        </div>
      </div>

      {topic && (
        <p className="text-sm text-muted-foreground mb-3">
          From: <Link href={`/topic/${question.slug}`}><span className="text-accent hover:underline cursor-pointer">{topic.title}</span></Link>
        </p>
      )}

      <p id="quiz-question" className="text-base font-medium leading-relaxed mb-4">{question.q}</p>

      <fieldset aria-describedby="quiz-question" className="space-y-2 mb-4">
        <legend className="sr-only">Select your answer</legend>
        {question.options.map((opt, idx) => {
          let cls = "w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all";
          if (revealed) {
            if (idx === question.answer) cls += " border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200";
            else if (idx === selected) cls += " border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
            else cls += " border-border/50 text-muted-foreground/60";
          } else if (idx === selected) {
            cls += " border-primary bg-primary/5 cursor-pointer";
          } else {
            cls += " border-border bg-card hover:border-primary/40 cursor-pointer";
          }
          return (
            <button 
              key={idx} 
              className={cls} 
              onClick={() => !revealed && setSelected(idx)}
              aria-pressed={selected === idx}
              aria-disabled={revealed}
              disabled={revealed}
            >
              <span className="w-6 h-6 flex-shrink-0 rounded-full border text-xs flex items-center justify-center font-semibold border-current" aria-hidden="true">
                {OPTION_LABELS[idx]}
              </span>
              <span className="line-clamp-2 text-left">{opt}</span>
            </button>
          );
        })}
      </fieldset>

      {!revealed ? (
        <button
          onClick={submit}
          disabled={selected === null}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          aria-describedby={selected === null ? "select-answer-hint" : undefined}
        >
          Submit Answer
        </button>
      ) : (
        <div className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-xl px-4 py-3" role="status">
          {question.explanation}
        </div>
      )}
      {selected === null && !revealed && (
        <p id="select-answer-hint" className="sr-only">Please select an answer before submitting</p>
      )}
    </article>
  );
}

function WeeklyGoalsWidget() {
  const { goals, saveGoals } = useWeeklyGoals();
  const { completed } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoals, setTempGoals] = useState(goals);

  const estimatedThisWeek = Math.min(completed.size, goals.topicsPerWeek);
  const weeklyProgress = Math.round((estimatedThisWeek / goals.topicsPerWeek) * 100);

  const handleSave = () => {
    saveGoals(tempGoals);
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Weekly Goal</h2>
            <p className="text-xs text-muted-foreground">Track your learning progress</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1.5 text-xs rounded-full bg-muted hover:bg-muted/70 text-foreground font-medium transition-colors"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="topics-per-week" className="text-sm font-medium text-muted-foreground block mb-2">
              Topics per week
            </label>
            <input
              id="topics-per-week"
              type="number"
              min="1"
              max="20"
              value={tempGoals.topicsPerWeek}
              onChange={(e) => setTempGoals({ ...tempGoals, topicsPerWeek: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm"
              aria-describedby="topics-per-week-hint"
            />
            <p id="topics-per-week-hint" className="sr-only">Enter a number between 1 and 20</p>
          </div>
          <button
            onClick={handleSave}
            className="w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Save Goals
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-medium text-foreground">{estimatedThisWeek} of {goals.topicsPerWeek} topics</span>
            <span className="text-sm text-muted-foreground">{weeklyProgress}%</span>
          </div>
          <div 
            className="w-full h-2 bg-muted rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={weeklyProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Weekly goal progress: ${estimatedThisWeek} of ${goals.topicsPerWeek} topics completed`}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
            />
          </div>
          {weeklyProgress >= 100 && (
            <p className="text-sm text-accent font-medium mt-3" role="status">Goal achieved this week!</p>
          )}
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
  "Foundations": { icon: <BookOpen className="w-4 h-4" />, summary: "Neural networks, probability, training basics" },
  "Core Models": { icon: <Network className="w-4 h-4" />, summary: "Transformers, diffusion, LLMs" },
  "Techniques": { icon: <FlaskConical className="w-4 h-4" />, summary: "RLHF, RAG, fine-tuning, prompting" },
  "Applications": { icon: <Cpu className="w-4 h-4" />, summary: "Code, vision, speech, video" },
  "Advanced Research": { icon: <Microscope className="w-4 h-4" />, summary: "Interpretability, safety, frontiers" },
};

const pathKeys = ["beginner", "intermediate", "advanced"] as const;

function CategoryPanel({ category, idx }: { category: Category; idx: number }) {
  const catTopics = topics.filter(t => t.category === category);
  const meta = categoryMeta[category];
  const ref = useScrollReveal();
  return (
    <Link href={`/topics?category=${encodeURIComponent(category)}`}>
      <div ref={ref as React.Ref<HTMLDivElement>} className={`reveal reveal-delay-${idx + 1} group rounded-2xl p-5 h-full cursor-pointer border border-border bg-card hover:border-primary/20 transition-all hover:shadow-md`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
              {meta.icon}
            </span>
            <span className="text-sm font-semibold text-foreground">{category}</span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums bg-muted px-2 py-0.5 rounded-full">{catTopics.length}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{meta.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {catTopics.slice(0, 3).map(t => (
            <span key={t.slug} className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/50">
              {t.title}
            </span>
          ))}
          {catTopics.length > 3 && (
            <span className="text-xs text-accent font-medium px-2 py-1">+{catTopics.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { completed, isComplete, recentlyRead, streak } = useApp();
  const completedCount = completed.size;

  const dueReviews = useMemo(() => {
    if (completedCount === 0) return [];
    return getDueReviews([...completed])
      .map(slug => topics.find(t => t.slug === slug))
      .filter(Boolean) as typeof topics;
  }, [completed, completedCount]);

  const featuredTopics = featuredSlugs
    .map(slug => topics.find(t => t.slug === slug))
    .filter(Boolean) as typeof topics;

  const nextUnread = useMemo(() => topics.find(t => !completed.has(t.slug)), [completed]);

  const nextReads = useMemo(() => {
    if (completed.size === 0) return featuredTopics;
    const completedTopics = topics.filter(t => completed.has(t.slug));
    const related = new Set(completedTopics.flatMap(t => t.relatedSlugs));
    const unread = topics.filter(t => related.has(t.slug) && !completed.has(t.slug));
    return unread.length >= 4 ? unread.slice(0, 6) : topics.filter(t => !completed.has(t.slug)).slice(0, 6);
  }, [completed]);

  const recentTopics = recentlyRead
    .map(slug => topics.find(t => t.slug === slug))
    .filter(Boolean) as typeof topics;

  const pctOverall = Math.round((completedCount / topics.length) * 100);

  const isReturning = completedCount > 0 || recentlyRead.length > 0;

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="fade-up mb-6 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground border border-border rounded-full px-3 py-1.5 bg-card">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {topics.length} in-depth articles
            </div>

            {/* Title */}
            <h1 className="fade-up-1 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-foreground">Learn Generative AI</span>
              <br />
              <span className="serif-display text-accent">from first principles</span>
            </h1>

            {/* Subtitle */}
            <p className="fade-up-2 text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
              A structured curriculum covering every concept in modern AI, from neural network fundamentals to interpretability and safety.
            </p>

            {/* CTAs */}
            <div className="fade-up-3 flex flex-wrap gap-3">
              <Link
                href="/learning-paths"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {isReturning ? "Continue Learning" : "Start Learning"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/topics"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                Browse Topics
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="fade-up-4 flex flex-wrap items-center gap-8 mt-16 pt-8 border-t border-border">
            {[
              { val: topics.length, label: "Articles" },
              { val: categories.length, label: "Categories" },
              { val: 3, label: "Learning Paths" },
              { val: "70+", label: "Glossary Terms" },
            ].map(({ val, label }) => (
              <div key={label}>
                <span className="text-2xl font-bold text-foreground tabular-nums">{val}</span>
                <span className="text-sm text-muted-foreground ml-2">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Returning user dashboard */}
      {isReturning && (
        <section className="border-y border-border bg-muted/30 py-8 px-5 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

              {/* Progress ring */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="relative w-16 h-16">
                  <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                    <circle
                      cx="32" cy="32" r="26" fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - completedCount / topics.length)}
                      style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold tabular-nums">{pctOverall}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-base font-semibold">{completedCount} of {topics.length}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    topics completed
                    {streak > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-medium">
                        <Flame className="w-3.5 h-3.5" />{streak}d streak
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Path progress */}
              <div className="flex-1 grid grid-cols-3 gap-4 min-w-0">
                {pathKeys.map(key => {
                  const path = learningPaths[key];
                  const pathTopics = path.slugs.map(s => topics.find(t => t.slug === s)).filter(Boolean) as typeof topics;
                  const done = pathTopics.filter(t => isComplete(t.slug)).length;
                  const pct = pathTopics.length > 0 ? Math.round((done / pathTopics.length) * 100) : 0;
                  return (
                    <Link key={key} href="/learning-paths">
                      <div className="group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-muted-foreground truncate group-hover:text-foreground transition-colors">
                            {path.title}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground/60 flex-shrink-0 ml-1">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
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
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                      Continue <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Recently visited */}
            {recentTopics.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border flex items-center gap-3 overflow-x-auto">
                <span className="text-xs text-muted-foreground flex-shrink-0 font-medium">Recent:</span>
                {recentTopics.slice(0, 5).map(t => (
                  <Link key={t.slug} href={`/topic/${t.slug}`}>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 px-3 py-1.5 rounded-full bg-card border border-border hover:border-primary/30">
                      {isComplete(t.slug) && <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                      {t.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Due for review */}
            {dueReviews.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <RotateCcw className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-semibold text-foreground">Due for Review</span>
                  <span className="text-xs text-muted-foreground">({dueReviews.length})</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {dueReviews.slice(0, 5).map(t => (
                    <Link key={t.slug} href={`/topic/${t.slug}`}>
                      <span className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors flex-shrink-0 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/15">
                        <RotateCcw className="w-2.5 h-2.5" />{t.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Daily Quests & Goals */}
      {isReturning && (
        <section className="py-10 px-5 lg:px-8 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DailyQuestsWidget />
              <WeeklyGoalsWidget />
            </div>
          </div>
        </section>
      )}

      {/* Smart Recommendations */}
      <section className="py-12 px-5 lg:px-8 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <SmartRecommendations />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-5 lg:px-8 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">Curriculum</h2>
              <p className="text-muted-foreground">Five structured categories covering all of generative AI.</p>
            </div>
            <Link href="/topics" className="text-sm text-accent hover:underline hidden sm:flex items-center gap-1 font-medium">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(categories as Category[]).map((cat, i) => (
              <CategoryPanel key={cat} category={cat} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Daily Challenge */}
      <section className="py-16 px-5 lg:px-8 border-b border-border bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold mb-3">Daily Challenge</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Test your knowledge with a new question every day. Questions are drawn from across all topics and reset at midnight.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  New daily
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {topics.length} topics
                </span>
              </div>
            </div>
            <DailyChallengeWidget />
          </div>
        </div>
      </section>

      {/* Featured / Next reads */}
      <section className="py-16 px-5 lg:px-8 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {isReturning ? "Continue Reading" : "Start Here"}
              </h2>
              <p className="text-muted-foreground">
                {isReturning
                  ? "Recommended based on your reading history."
                  : "The most foundational topics to begin your journey."}
              </p>
            </div>
            <Link href="/topics" className="text-sm text-accent hover:underline hidden sm:flex items-center gap-1 font-medium">
              All topics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nextReads.map((topic, i) => {
              const done = isComplete(topic.slug);
              return (
                <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                  <div className={`group rounded-2xl p-5 cursor-pointer border border-border bg-card hover:border-primary/20 transition-all hover:shadow-md ${done ? "opacity-60" : ""}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-sm font-semibold group-hover:text-accent transition-colors leading-snug">
                        {topic.title}
                      </h3>
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">{topic.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[topic.category]}`}>
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

      {/* Why section */}
      <section className="py-16 px-5 lg:px-8 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">Why This Curriculum</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Citable Sources", body: "Every major claim links to the original paper. No hand-waving." },
              { label: "Working Code", body: "100+ examples in Python and PyTorch. Copy, run, modify." },
              { label: "Structured Depth", body: "Three difficulty levels, five categories, three learning paths." },
            ].map(({ label, body }) => (
              <div key={label} className="text-center">
                <p className="text-base font-semibold text-foreground mb-2">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-5 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl border border-border bg-card">
            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold mb-1">Ready to start?</p>
              <p className="text-sm text-muted-foreground">Follow a structured path or jump to any topic.</p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link href="/learning-paths" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Layers className="w-4 h-4" />Learning Paths
              </Link>
              <Link href="/glossary" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors">
                Glossary
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
