import { useDailyQuests } from "@/hooks/useDailyQuests";

function QuestProgressBar({ value, target, done }: { value: number; target: number; done: boolean }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground tabular-nums">{Math.min(value, target)}/{target}</span>
        <span className="text-xs text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-500" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function DailyQuestsWidget() {
  const { quests, claimXP, completedQuests, claimableXP } = useDailyQuests();

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
            Daily Quests
          </h2>
          <p className="text-sm text-muted-foreground">
            {completedQuests}/3 completed today · Resets at midnight
          </p>
        </div>
        {claimableXP > 0 && (
          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            +{claimableXP} XP ready
          </span>
        )}
      </div>

      {/* Quest cards */}
      <div className="space-y-3">
        {quests.map(quest => (
          <div
            key={quest.id}
            className={`p-4 rounded-lg border transition-all ${
              quest.claimed
                ? "border-border bg-muted/40 opacity-70"
                : quest.done
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-background"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground">{quest.title}</p>
                    <span className="text-xs text-primary font-medium">+{quest.xp} XP</span>
                    {quest.claimed && (
                      <span className="text-xs text-muted-foreground font-medium">Claimed</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{quest.desc}</p>
                  {!quest.done && (
                    <QuestProgressBar value={quest.progress} target={quest.target} done={quest.done} />
                  )}
                </div>
              </div>

              {/* Action */}
              {quest.done && !quest.claimed ? (
                <button
                  onClick={() => claimXP(quest.id)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-primary hover:opacity-90 text-primary-foreground text-xs font-semibold transition-opacity"
                >
                  Claim XP
                </button>
              ) : quest.done ? (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">✓</span>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Progress summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex gap-1.5">
          {quests.map(q => (
            <div
              key={q.id}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                q.claimed ? "bg-primary" : q.done ? "bg-primary/60" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
