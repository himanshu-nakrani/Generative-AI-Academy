import { useState } from "react";
import { X, Copy, Check, Share2, Download } from "lucide-react";
import { topics, learningPaths } from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { useAchievements } from "@/context/AchievementsContext";

interface ShareModalProps {
  onClose: () => void;
}

export function ShareModal({ onClose }: ShareModalProps) {
  const { completed, streak, bestStreak } = useApp();
  const { earnedCount, totalCount } = useAchievements();
  const [copied, setCopied] = useState(false);

  const completedCount = completed.size;
  const totalTopics    = topics.length;
  const pct            = Math.round((completedCount / totalTopics) * 100);

  const pathProgress = (["beginner", "intermediate", "advanced"] as const).map(key => {
    const path = (learningPaths as Record<string, { title: string; slugs: string[] }>)[key];
    const done = path.slugs.filter((s: string) => completed.has(s)).length;
    const total = path.slugs.length;
    const pathPct = Math.round((done / total) * 100);
    return { key, title: path.title, done, total, pct: pathPct };
  });

  const shareText = [
    `🧠 My GenAI Learn Progress`,
    ``,
    `📚 Topics: ${completedCount}/${totalTopics} (${pct}%)`,
    `🔥 Current streak: ${streak} days`,
    `🏆 Best streak: ${bestStreak} days`,
    `🎖️ Achievements: ${earnedCount}/${totalCount}`,
    ``,
    `Learning paths:`,
    ...pathProgress.map(p => `  ${p.pct === 100 ? "✅" : "⬜"} ${p.title}: ${p.done}/${p.total} (${p.pct}%)`),
    ``,
    `Start learning at GenAI Learn →`,
  ].join("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "My GenAI Learn Progress", text: shareText });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-xl border border-border bg-background shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Share Your Progress</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats preview */}
        <div className="px-6 py-5">
          <div className="p-4 rounded-lg bg-card border border-border mb-4">
            {/* Progress ring mini */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14 flex-shrink-0">
                <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                  <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--primary))" strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={2 * Math.PI * 22 * (1 - completedCount / totalTopics)}
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold tabular-nums">{pct}%</span>
                </div>
              </div>
              <div>
                <p className="font-semibold">{completedCount}/{totalTopics} Topics</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {streak > 0 && <span className="text-orange-500 font-medium">{streak}-day streak · </span>}
                  {earnedCount} achievements earned
                </p>
              </div>
            </div>

            {/* Path bars */}
            <div className="space-y-2">
              {pathProgress.map(p => (
                <div key={p.key} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-24 truncate">{p.title}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      p.key === "beginner" ? "bg-emerald-500" :
                      p.key === "intermediate" ? "bg-violet-500" : "bg-slate-500"
                    }`} style={{ width: `${p.pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">{p.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Text preview */}
          <div className="p-3 rounded-md bg-muted/40 border border-border mb-4">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">{shareText}</pre>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md border border-border bg-card text-sm font-medium hover:bg-muted transition-colors"
            >
              {copied ? <><Check className="w-4 h-4 text-emerald-500" />Copied!</> : <><Copy className="w-4 h-4" />Copy Text</>}
            </button>
            {typeof navigator !== "undefined" && "share" in navigator && (
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Share2 className="w-4 h-4" />Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
