import { useMemo } from "react";
import { Link } from "wouter";
import {
  BarChart3, BookOpen, Clock, Flame, Trophy, Brain, Star,
  TrendingUp, TrendingDown, Target, Zap, ArrowRight, Lock,
  ChevronRight,
} from "lucide-react";
import { topics, categories, categoryColors, type Category } from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { useAchievements, ACHIEVEMENT_DEFS } from "@/context/AchievementsContext";
import { useXP, XP_LEVELS } from "@/hooks/useXP";
import { useDailyQuests } from "@/hooks/useDailyQuests";

/* ── Helpers ─────────────────────────────────────────────── */
function getQuizScores(): Record<string, { score: number; total: number; date: number }> {
  try { const r = localStorage.getItem("genai-learn:quiz-scores"); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}

function getBookmarkCount(): number {
  try { const r = localStorage.getItem("genai-learn:bookmarks"); return r ? (JSON.parse(r) as unknown[]).length : 0; }
  catch { return 0; }
}

function getHighlightCount(): number {
  try { const r = localStorage.getItem("genai-learn:highlights"); return r ? (JSON.parse(r) as unknown[]).length : 0; }
  catch { return 0; }
}

/* ── Sub-components ──────────────────────────────────────── */
function StatCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; accent?: string;
}) {
  return (
    <div className={`p-5 rounded-xl border bg-card ${accent ?? "border-border"}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="text-3xl font-bold tabular-nums text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function CategoryBar({ category, done, total }: { category: Category; done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const colorClass = {
    "Foundations":       "bg-cyan-500",
    "Core Models":       "bg-violet-500",
    "Techniques":        "bg-emerald-500",
    "Applications":      "bg-orange-500",
    "Advanced Research": "bg-red-500",
  }[category] ?? "bg-primary";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[category]}`}>
            {category}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-muted-foreground tabular-nums">{done}/{total}</span>
          <span className="text-xs font-semibold w-10 text-right tabular-nums">{pct}%</span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function XPCard() {
  const { totalXP, level, levelName, levelColor, levelProgress, xpIntoLevel, xpForLevel, nextLevelName, breakdown } = useXP();
  const nextLevel = XP_LEVELS[level]; // index = level (since array is 0-indexed at level 1)

  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold">Level & XP</h3>
        </div>
        <div className={`px-3 py-1 rounded-full bg-muted text-xs font-semibold ${levelColor}`}>
          Lvl {level} · {levelName}
        </div>
      </div>

      {/* XP bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted-foreground">{xpIntoLevel.toLocaleString()} / {xpForLevel.toLocaleString()} XP</span>
          {nextLevelName && (
            <span className="text-xs text-muted-foreground">
              Next: <span className="font-medium text-foreground">{nextLevelName}</span>
              {nextLevel && <span className="ml-1">({(nextLevel.minXP - totalXP).toLocaleString()} XP away)</span>}
            </span>
          )}
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">{totalXP.toLocaleString()} total XP</p>
      </div>

      {/* XP breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-border">
        {[
          { label: "Topics",       val: breakdown.topicXP,       color: "text-emerald-400" },
          { label: "Quizzes",      val: breakdown.quizXP,        color: "text-blue-400"    },
          { label: "Achievements", val: breakdown.achievementXP, color: "text-purple-400"  },
          { label: "Streak",       val: breakdown.streakXP,      color: "text-orange-400"  },
          { label: "Quests",       val: breakdown.questXP,       color: "text-amber-400"   },
        ].map(({ label, val, color }) => (
          <div key={label} className="text-center">
            <p className={`text-sm font-semibold ${color}`}>{val}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function Analytics() {
  const { completed, isComplete, streak, bestStreak } = useApp();
  const { achievements, earnedCount } = useAchievements();
  const { quests, completedQuests } = useDailyQuests();
  const completedCount = completed.size;

  const quizScores  = useMemo(getQuizScores, []);
  const bookmarks   = useMemo(getBookmarkCount, []);
  const highlights  = useMemo(getHighlightCount, []);

  const totalTopics = topics.length;
  const timeRead    = useMemo(() =>
    topics.filter(t => completed.has(t.slug)).reduce((s, t) => s + t.readTime, 0), [completed]);
  const timeRemain  = useMemo(() =>
    topics.filter(t => !completed.has(t.slug)).reduce((s, t) => s + t.readTime, 0), [completed]);

  // Quiz stats
  const quizEntries = Object.entries(quizScores);
  const quizDone    = quizEntries.length;
  const avgPct      = quizDone > 0
    ? Math.round(quizEntries.reduce((s, [, v]) => s + (v.score / v.total * 100), 0) / quizDone)
    : 0;
  const perfectQuizzes = quizEntries.filter(([, v]) => v.score === v.total).length;

  // Category stats
  const catStats = useMemo(() => (categories as Category[]).map(cat => {
    const catTopics = topics.filter(t => t.category === cat);
    const done      = catTopics.filter(t => isComplete(t.slug)).length;
    return { cat, done, total: catTopics.length, pct: catTopics.length > 0 ? done / catTopics.length : 0 };
  }), [isComplete]);

  const strongest = [...catStats].sort((a, b) => b.pct - a.pct)[0];
  const weakest   = [...catStats].sort((a, b) => a.pct - b.pct)[0];

  // Top + worst quiz scores
  const sortedQuizzes = useMemo(() =>
    quizEntries
      .map(([slug, v]) => ({ slug, pct: Math.round(v.score / v.total * 100), score: v.score, total: v.total, date: v.date }))
      .sort((a, b) => b.date - a.date),
    [quizEntries]
  );

  // Next achievement to unlock
  const nextAchievement = ACHIEVEMENT_DEFS.find(a => !achievements.find(ea => ea.id === a.id && ea.earned));

  // Difficulty breakdown
  const diffStats = (["Beginner", "Intermediate", "Advanced"] as const).map(d => ({
    diff: d,
    done: topics.filter(t => t.difficulty === d && isComplete(t.slug)).length,
    total: topics.filter(t => t.difficulty === d).length,
  }));

  if (completedCount === 0) {
    return (
      <div className="min-h-screen py-20 px-5 sm:px-8 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <BarChart3 className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">No data yet</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Complete some topics and take quizzes to see your learning analytics.
          </p>
          <Link href="/topics">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Browse Topics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Dashboard</p>
          <h1 className="text-3xl font-bold mb-1">Learning Analytics</h1>
          <p className="text-sm text-muted-foreground">
            A deep dive into your GenAI learning journey.
          </p>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<BookOpen className="w-4 h-4 text-emerald-500" />}
            label="Topics Done" value={`${completedCount}/${totalTopics}`}
            sub={`${Math.round(completedCount / totalTopics * 100)}% complete`} />
          <StatCard icon={<Clock className="w-4 h-4 text-blue-500" />}
            label="Time Invested" value={`${Math.round(timeRead / 60 * 10) / 10}h`}
            sub={`~${Math.round(timeRemain / 60 * 10) / 10}h remaining`} />
          <StatCard icon={<Flame className="w-4 h-4 text-orange-500" />}
            label="Best Streak" value={bestStreak}
            sub={`Current: ${streak} days`} />
          <StatCard icon={<Trophy className="w-4 h-4 text-amber-500" />}
            label="Achievements" value={`${earnedCount}/24`}
            sub={`${Math.round(earnedCount / 24 * 100)}% earned`} />
        </div>

        {/* XP / Level */}
        <div className="mb-6">
          <XPCard />
        </div>

        {/* Daily Quests status */}
        <div className="mb-6 p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚔️</span>
              <h3 className="font-semibold">Today's Quests</h3>
            </div>
            <span className="text-xs text-muted-foreground">{completedQuests}/3 done</span>
          </div>
          <div className="space-y-2">
            {quests.map(q => (
              <div key={q.id} className={`flex items-center gap-3 p-3 rounded-lg ${q.done ? "bg-emerald-500/8" : "bg-muted/40"}`}>
                <span className="text-base">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{q.title}</p>
                  <p className="text-xs text-muted-foreground">{q.desc}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-amber-500 font-medium">+{q.xp} XP</span>
                  {q.done
                    ? <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</span>
                    : <span className="text-xs text-muted-foreground tabular-nums">{q.progress}/{q.target}</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="mb-6 p-6 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-5 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            Category Completion
          </h3>
          <div className="space-y-4">
            {catStats.map(({ cat, done, total }) => (
              <CategoryBar key={cat} category={cat} done={done} total={total} />
            ))}
          </div>
        </div>

        {/* Difficulty breakdown */}
        <div className="mb-6 p-6 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-5 flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            By Difficulty
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {diffStats.map(({ diff, done, total }) => {
              const pct = total > 0 ? Math.round(done / total * 100) : 0;
              const color = diff === "Beginner" ? "bg-emerald-500" : diff === "Intermediate" ? "bg-violet-500" : "bg-slate-500";
              const ring  = diff === "Beginner" ? "border-emerald-500/40" : diff === "Intermediate" ? "border-violet-500/40" : "border-slate-500/40";
              return (
                <div key={diff} className={`p-4 rounded-lg border ${ring} bg-card text-center`}>
                  <p className="text-2xl font-bold tabular-nums">{pct}%</p>
                  <p className="text-xs font-medium text-foreground mb-1">{diff}</p>
                  <p className="text-xs text-muted-foreground">{done}/{total}</p>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Strongest area */}
          <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Strongest Area</p>
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">{strongest.cat}</p>
            <p className="text-sm text-muted-foreground">
              {strongest.done}/{strongest.total} topics · {Math.round(strongest.pct * 100)}% complete
            </p>
          </div>

          {/* Weakest area */}
          <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Focus Here Next</p>
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">{weakest.cat}</p>
            <p className="text-sm text-muted-foreground">
              {weakest.done}/{weakest.total} topics · {Math.round(weakest.pct * 100)}% complete
            </p>
            <Link href={`/topics?category=${encodeURIComponent(weakest.cat)}`}>
              <span className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1">
                Browse topics <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>

        {/* Quiz performance */}
        {quizDone > 0 && (
          <div className="mb-6 p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-500" />
                Quiz Performance
              </h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{quizDone} taken</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500" />
                  {avgPct}% avg
                </span>
                <span className="text-emerald-500">{perfectQuizzes} perfect</span>
              </div>
            </div>

            {/* Score distribution bar */}
            <div className="mb-4">
              <div className="flex h-8 rounded-lg overflow-hidden gap-0.5">
                {[
                  { label: "< 60%", count: sortedQuizzes.filter(q => q.pct < 60).length, color: "bg-red-500" },
                  { label: "60-79%", count: sortedQuizzes.filter(q => q.pct >= 60 && q.pct < 80).length, color: "bg-amber-500" },
                  { label: "80-99%", count: sortedQuizzes.filter(q => q.pct >= 80 && q.pct < 100).length, color: "bg-emerald-500" },
                  { label: "100%", count: sortedQuizzes.filter(q => q.pct === 100).length, color: "bg-yellow-400" },
                ].filter(s => s.count > 0).map(seg => (
                  <div
                    key={seg.label}
                    className={`${seg.color} flex items-center justify-center text-xs font-medium text-white transition-all`}
                    style={{ flex: seg.count }}
                    title={`${seg.label}: ${seg.count}`}
                  >
                    {seg.count}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Needs work (&lt;60%)</span>
                <span>Perfect (100%)</span>
              </div>
            </div>

            {/* Recent scores */}
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {sortedQuizzes.slice(0, 10).map(({ slug, pct, score, total }) => {
                const t = topics.find(t => t.slug === slug);
                return (
                  <Link key={slug} href={`/quiz/${slug}`}>
                    <div className="group flex items-center gap-3 py-2 px-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate block">
                          {t?.title ?? slug}
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
                          pct >= 80 ? "text-emerald-500" : pct >= 60 ? "text-amber-500" : "text-red-400"
                        }`}>{score}/{total}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Bookmarks",  value: bookmarks,  icon: "🔖", color: "text-cyan-400"    },
            { label: "Highlights", value: highlights, icon: "✏️", color: "text-yellow-400"  },
            { label: "Quiz Avg",   value: `${avgPct}%`, icon: "📊", color: "text-violet-400" },
            { label: "Perfect 💯", value: perfectQuizzes, icon: "⭐", color: "text-amber-400" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="p-4 rounded-xl border border-border bg-card text-center">
              <p className="text-2xl mb-1">{icon}</p>
              <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Next milestone */}
        {nextAchievement && (
          <div className="mb-6 p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Next Achievement</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                🏆
              </div>
              <div>
                <p className="font-semibold text-foreground">{nextAchievement.title}</p>
                <p className="text-sm text-muted-foreground">{nextAchievement.description}</p>
              </div>
              <Link href="/achievements" className="ml-auto flex-shrink-0">
                <button className="text-xs text-primary hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/progress">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity">
              Full Progress Report <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <Link href="/topics">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors">
              <BookOpen className="w-3.5 h-3.5" />Browse Topics
            </button>
          </Link>
          <Link href="/leaderboard">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors">
              <Trophy className="w-3.5 h-3.5" />Leaderboard
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
