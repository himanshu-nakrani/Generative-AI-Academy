import { Link } from "wouter";
import {
  BookOpen, Layers, TrendingUp, Zap, Trophy, Cpu, Brain, Wrench,
  FlaskConical, Microscope, GraduationCap, Flame, Gem, HelpCircle,
  CheckCircle2, Award, Crown, Bookmark, Archive, Highlighter, PenLine,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAchievements, type AchievementState, ACHIEVEMENT_DEFS } from "@/context/AchievementsContext";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen, Layers, TrendingUp, Zap, Trophy, Cpu, Brain, Wrench,
  FlaskConical, Microscope, GraduationCap, Flame, Gem, HelpCircle,
  CheckCircle2, Award, Crown, Bookmark, Archive, Highlighter, PenLine,
};

const RARITY_CONFIG = {
  common:    { label: "Common",    border: "border-border",         bg: "bg-muted/30",         icon: "text-muted-foreground", badge: "bg-muted text-muted-foreground border-border" },
  uncommon:  { label: "Uncommon",  border: "border-emerald-500/40", bg: "bg-emerald-500/5",    icon: "text-emerald-400",      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  rare:      { label: "Rare",      border: "border-violet-500/40",  bg: "bg-violet-500/5",     icon: "text-violet-400",       badge: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  legendary: { label: "Legendary", border: "border-amber-400/50",   bg: "bg-amber-400/5",      icon: "text-amber-400",        badge: "bg-amber-400/10 text-amber-400 border-amber-400/40" },
};

const CATEGORY_LABELS = {
  learning:    "Learning",
  streak:      "Streaks",
  quiz:        "Quizzes",
  exploration: "Exploration",
};

function AchievementCard({ achievement }: { achievement: AchievementState }) {
  const Icon = ICON_MAP[achievement.icon] ?? Trophy;
  const rarity = RARITY_CONFIG[achievement.rarity];
  const earned = achievement.earned;

  return (
    <div className={`relative p-4 rounded-xl border transition-all ${
      earned
        ? `${rarity.border} ${rarity.bg}`
        : "border-border/50 bg-card/30 opacity-50"
    }`}>
      {/* Rarity badge */}
      <div className="absolute top-3 right-3">
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${rarity.badge}`}>
          {rarity.label}
        </span>
      </div>

      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg border mb-3 flex items-center justify-center ${
        earned ? `${rarity.border} bg-background/50` : "border-border/40 bg-muted/20"
      }`}>
        {earned
          ? <Icon className={`w-5 h-5 ${rarity.icon}`} />
          : <Lock className="w-4 h-4 text-muted-foreground/30" />}
      </div>

      {/* Content */}
      <p className="text-sm font-semibold mb-1">{achievement.title}</p>
      <p className="text-xs text-muted-foreground leading-snug">{achievement.description}</p>

      {/* Earned date */}
      {earned && achievement.earnedAt && (
        <p className="text-xs text-muted-foreground/50 mt-2">
          {new Date(achievement.earnedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </p>
      )}
    </div>
  );
}

export default function Achievements() {
  const { achievements, earnedCount, totalCount } = useAchievements();

  const categories = (["learning", "streak", "quiz", "exploration"] as const);
  const pct = Math.round((earnedCount / totalCount) * 100);

  return (
    <div className="min-h-screen py-12 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10 fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Achievements</p>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Your Badges</h1>
          <p className="text-muted-foreground text-sm">
            Milestones earned on your generative AI learning journey.
          </p>
        </div>

        {/* Progress summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 fade-up-1">
          {categories.map(cat => {
            const catAchievements = achievements.filter(a => a.category === cat);
            const catEarned = catAchievements.filter(a => a.earned).length;
            return (
              <div key={cat} className="p-4 rounded-lg border border-border bg-card text-center">
                <p className="text-2xl font-bold tabular-nums">{catEarned}/{catAchievements.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{CATEGORY_LABELS[cat]}</p>
              </div>
            );
          })}
        </div>

        {/* Overall bar */}
        <div className="p-5 rounded-xl border border-border bg-card mb-10 fade-up-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Overall Progress</p>
            <span className="text-sm font-bold tabular-nums text-primary">{earnedCount}/{totalCount}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{pct}% of all achievements unlocked</p>
        </div>

        {/* Achievements by category */}
        {categories.map(cat => {
          const catAchievements = achievements.filter(a => a.category === cat);
          const catEarned = catAchievements.filter(a => a.earned).length;
          return (
            <div key={cat} className="mb-10 fade-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">{CATEGORY_LABELS[cat]}</h2>
                <span className="text-xs text-muted-foreground">{catEarned}/{catAchievements.length} earned</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catAchievements
                  .sort((a, b) => (b.earned ? 1 : 0) - (a.earned ? 1 : 0))
                  .map(a => (
                    <AchievementCard key={a.id} achievement={a} />
                  ))}
              </div>
            </div>
          );
        })}

        {/* CTA */}
        {earnedCount < totalCount && (
          <div className="mt-4 p-5 rounded-xl border border-dashed border-border text-center fade-up">
            <p className="text-sm text-muted-foreground mb-4">
              {totalCount - earnedCount} achievements left to unlock — keep reading to earn them all.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/topics">
                <button className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Browse Topics
                </button>
              </Link>
              <Link href="/progress">
                <button className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
                  My Progress
                </button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
