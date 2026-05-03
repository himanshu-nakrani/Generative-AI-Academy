import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Flame, CheckCircle2, Clock, BookOpen, Trophy, BarChart3, Brain, Star, Share2, Download, Lock } from "lucide-react";
import {
  BookOpen as BookOpenIcon, Layers, TrendingUp, Zap, Cpu, Wrench,
  FlaskConical, Microscope, GraduationCap, Gem, HelpCircle,
  CheckCircle2 as CheckCircle2Icon, Award, Crown, Bookmark, Archive, Highlighter, PenLine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { topics, learningPaths, categories, categoryColors, type Category } from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { useQuizScores } from "@/hooks/useQuizScores";
import { useAchievements, ACHIEVEMENT_DEFS, type AchievementState } from "@/context/AchievementsContext";
import { ShareModal } from "@/components/ShareModal";

const ACHIEVEMENT_ICON_MAP: Record<string, LucideIcon> = {
  BookOpen: BookOpenIcon, Layers, TrendingUp, Zap, Trophy, Cpu, Brain, Wrench,
  FlaskConical, Microscope, GraduationCap, Flame, Gem, HelpCircle,
  CheckCircle2: CheckCircle2Icon, Award, Crown, Bookmark, Archive, Highlighter, PenLine,
};

const RARITY_BADGE = {
  common:    "bg-muted text-muted-foreground border-border",
  uncommon:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  rare:      "bg-violet-500/10 text-violet-400 border-violet-500/30",
  legendary: "bg-amber-400/10 text-amber-400 border-amber-400/40",
};

const pathKeys = ["beginner", "intermediate", "advanced"] as const;
const pathLabels: Record<string, string> = {
  beginner: "Beginner Path",
  intermediate: "Intermediate Path",
  advanced: "Advanced Path",
};
const pathColors: Record<string, string> = {
  beginner: "bg-emerald-500",
  intermediate: "bg-violet-500",
  advanced: "bg-slate-600",
};

function ProgressRing({ value, total, size = 128, label }: { value: number; total: number; size?: number; label?: string }) {
  const stroke = 10;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? value / total : 0;
  const pctRounded = Math.round(pct * 100);
  const offset = circ * (1 - pct);
  return (
    <div 
      role="progressbar" 
      aria-valuenow={pctRounded} 
      aria-valuemin={0} 
      aria-valuemax={100}
      aria-label={label || `Progress: ${value} of ${total}`}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
    </div>
  );
}

function AchievementMiniCard({ achievement }: { achievement: AchievementState }) {
  const Icon = ACHIEVEMENT_ICON_MAP[achievement.icon] ?? Trophy;
  const badge = RARITY_BADGE[achievement.rarity];
  return (
    <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all ${
      achievement.earned ? "border-border bg-card" : "border-border/40 bg-card/20 opacity-45"
    }`}>
      <div className={`w-8 h-8 rounded-md border flex items-center justify-center flex-shrink-0 ${
        achievement.earned ? "border-border bg-muted" : "border-border/40 bg-muted/30"
      }`}>
        {achievement.earned
          ? <Icon className="w-4 h-4 text-primary" />
          : <Lock className="w-3.5 h-3.5 text-muted-foreground/30" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold truncate">{achievement.title}</p>
        <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
      </div>
      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border flex-shrink-0 ${badge}`}>
        {achievement.rarity[0].toUpperCase() + achievement.rarity.slice(1)}
      </span>
    </div>
  );
}

export default function Progress() {
  const { completed, isComplete, recentlyRead, streak, bestStreak } = useApp();
  const { scores, totalDone, avgScore } = useQuizScores();
  const { achievements, earnedCount, totalCount } = useAchievements();
  const [showShare, setShowShare] = useState(false);
  const completedCount = completed.size;
  const totalTopics    = topics.length;
  const pctOverall     = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const timeRead      = topics.filter(t => completed.has(t.slug)).reduce((s, t) => s + t.readTime, 0);
  const timeRemaining = topics.filter(t => !completed.has(t.slug)).reduce((s, t) => s + t.readTime, 0);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      completedTopics: [...completed],
      streak,
      bestStreak,
      quizScores: scores,
      achievements: achievements.filter(a => a.earned).map(a => ({ id: a.id, title: a.title, earnedAt: a.earnedAt })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `genai-learn-progress-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const recentTopics = recentlyRead
    .map(slug => topics.find(t => t.slug === slug))
    .filter(Boolean) as typeof topics;

  // Next unread topic across all paths
  const nextTopic = topics.find(t => !completed.has(t.slug));

  if (completedCount === 0 && recentlyRead.length === 0) {
    return (
      <div className="min-h-screen py-20 px-5 sm:px-8 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <BarChart3 className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">No progress yet</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Start reading any topic and mark it complete — your stats will show up here.
          </p>
          <Link href="/learning-paths">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Start a Learning Path <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {showShare && <ShareModal onClose={() => setShowShare(false)} />}

        {/* Header */}
        <div className="mb-10 fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Dashboard</p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">My Progress</h1>
              <p className="text-muted-foreground text-sm">Your learning journey across 40 topics in generative AI.</p>
            </div>
            <div className="flex gap-2 flex-shrink-0 mt-1">
              <button
                onClick={() => setShowShare(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />Share
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Download className="w-3.5 h-3.5" />Export
              </button>
            </div>
          </div>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 fade-up-1">
          {[
            { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, val: completedCount, label: "Completed" },
            { icon: <Clock className="w-4 h-4 text-primary" />, val: `${timeRead}m`, label: "Time read" },
            { icon: <Flame className="w-4 h-4 text-orange-500" />, val: streak, label: "Day streak" },
            { icon: <Trophy className="w-4 h-4 text-amber-500" />, val: bestStreak, label: "Best streak" },
          ].map(({ icon, val, label }) => (
            <div key={label} className="p-4 rounded-lg border border-border bg-card text-center">
              <div className="flex justify-center mb-2">{icon}</div>
              <p className="text-2xl font-bold tabular-nums">{val}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Overall progress */}
        <div className="p-6 rounded-xl border border-border bg-card mb-6 fade-up-2">
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <ProgressRing value={completedCount} total={totalTopics} size={112} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold tabular-nums">{pctOverall}%</span>
                <span className="text-xs text-muted-foreground">done</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold mb-1">Overall Completion</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {completedCount} of {totalTopics} topics completed · ~{Math.round(timeRemaining / 60 * 10) / 10}h remaining
              </p>
              {nextTopic && (
                <Link href={`/topic/${nextTopic.slug}`}>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    Continue Learning
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Learning paths */}
        <div className="p-5 rounded-xl border border-border bg-card mb-6 fade-up-3">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            Learning Paths
          </h2>
          <div className="space-y-5">
            {pathKeys.map(key => {
              const path = learningPaths[key];
              const pathTopics = path.slugs.map(s => topics.find(t => t.slug === s)).filter(Boolean) as typeof topics;
              const done = pathTopics.filter(t => isComplete(t.slug)).length;
              const pct  = pathTopics.length > 0 ? Math.round((done / pathTopics.length) * 100) : 0;
              const nextInPath = pathTopics.find(t => !isComplete(t.slug));
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{pathLabels[key]}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{done}/{pathTopics.length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${pathColors[key]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{pct}% complete</span>
                    {nextInPath && pct < 100 && (
                      <Link href={`/topic/${nextInPath.slug}`}>
                        <span className="text-xs text-primary hover:underline flex items-center gap-0.5">
                          Continue <ArrowRight className="w-3 h-3" />
                        </span>
                      </Link>
                    )}
                    {pct === 100 && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Complete!
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="p-5 rounded-xl border border-border bg-card mb-6 fade-up-3">
          <h2 className="font-semibold mb-4">By Category</h2>
          <div className="space-y-3">
            {(categories as Category[]).map(cat => {
              const catTopics = topics.filter(t => t.category === cat);
              const done = catTopics.filter(t => isComplete(t.slug)).length;
              const pct  = catTopics.length > 0 ? Math.round((done / catTopics.length) * 100) : 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${categoryColors[cat]}`}>
                    {cat}
                  </span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/70 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">{done}/{catTopics.length}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recently visited */}
        {recentTopics.length > 0 && (
          <div className="p-5 rounded-xl border border-border bg-card mb-8 fade-up-4">
            <h2 className="font-semibold mb-4">Recently Visited</h2>
            <div className="space-y-1">
              {recentTopics.slice(0, 6).map(t => (
                <Link key={t.slug} href={`/topic/${t.slug}`}>
                  <div className="group flex items-center justify-between gap-3 py-2 px-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 min-w-0">
                      {isComplete(t.slug)
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        : <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30 flex-shrink-0" />}
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground/50 tabular-nums">{t.readTime}m</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Scores */}
        {totalDone > 0 && (
          <div className="p-5 rounded-xl border border-border bg-card mb-8 fade-up-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-500" />
                <h2 className="font-semibold">Quiz Scores</h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{totalDone} taken</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500" />
                  {avgScore}% avg
                </span>
              </div>
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {topics
                .filter(t => scores[t.slug])
                .sort((a, b) => scores[b.slug].date - scores[a.slug].date)
                .map(t => {
                  const s   = scores[t.slug];
                  const pct = Math.round((s.score / s.total) * 100);
                  return (
                    <Link key={t.slug} href={`/quiz/${t.slug}`}>
                      <div className="group flex items-center gap-3 py-2 px-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate block">
                            {t.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-400"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={`text-xs tabular-nums font-medium w-10 text-right ${
                            pct >= 80 ? "text-emerald-600 dark:text-emerald-400"
                            : pct >= 60 ? "text-amber-600 dark:text-amber-400"
                            : "text-red-600 dark:text-red-400"
                          }`}>{s.score}/{s.total}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
            {totalDone < topics.length && (
              <p className="mt-3 text-xs text-muted-foreground text-center">
                {topics.length - totalDone} quizzes remaining — <Link href="/topics"><span className="text-primary hover:underline cursor-pointer">browse topics</span></Link>
              </p>
            )}
          </div>
        )}

        {/* Achievements section */}
        <div className="p-5 rounded-xl border border-border bg-card mb-8 fade-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold">Achievements</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{earnedCount}/{totalCount} earned</span>
              <Link href="/achievements">
                <span className="text-xs text-primary hover:underline cursor-pointer">View all →</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {[...achievements]
              .sort((a, b) => (b.earned ? 1 : 0) - (a.earned ? 1 : 0))
              .slice(0, 8)
              .map(a => <AchievementMiniCard key={a.id} achievement={a} />)}
          </div>
          {earnedCount < totalCount && (
            <p className="mt-3 text-xs text-muted-foreground text-center">
              {totalCount - earnedCount} more achievements to unlock —{" "}
              <Link href="/achievements"><span className="text-primary hover:underline cursor-pointer">see all badges</span></Link>
            </p>
          )}
        </div>

        {/* Bottom nav */}
        <div className="flex gap-3">
          <Link href="/learning-paths">
            <button className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity">
              Learning Paths <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <Link href="/topics">
            <button className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors">
              Browse Topics
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
