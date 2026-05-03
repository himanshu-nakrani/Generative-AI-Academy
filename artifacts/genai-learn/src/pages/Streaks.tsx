import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Flame, Calendar } from "lucide-react";

const WEEKS_TO_SHOW = 52;

interface DayData {
  date: Date;
  count: number;
  iso: string;
}

function getWeekStartDate(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function getColor(count: number): string {
  if (count === 0) return "bg-muted/30";
  if (count === 1) return "bg-emerald-500/30";
  if (count === 2) return "bg-emerald-500/50";
  if (count === 3) return "bg-emerald-500/70";
  return "bg-emerald-500";
}

export default function Streaks() {
  const { recentlyRead, streak, bestStreak, completed } = useApp();

  const { heatmapData, stats } = useMemo(() => {
    // Count visits per day from recentlyRead
    const dayMap = new Map<string, number>();
    
    recentlyRead.forEach(slug => {
      const key = new Date().toISOString().split("T")[0]; // today's date only
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    });

    // Parse stored completion dates if available (from streak tracking)
    try {
      const lastDateKey = localStorage.getItem("genai-learn:last-date");
      if (lastDateKey) {
        const date = new Date(lastDateKey).toISOString().split("T")[0];
        dayMap.set(date, (dayMap.get(date) ?? 0) + 1);
      }
    } catch {}

    // Build heatmap: last 52 weeks
    const weeks: DayData[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - WEEKS_TO_SHOW * 7);

    for (let i = 0; i < WEEKS_TO_SHOW; i++) {
      const week: DayData[] = [];
      for (let j = 0; j < 7; j++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i * 7 + j);
        const iso = date.toISOString().split("T")[0];
        week.push({
          date,
          count: dayMap.get(iso) ?? 0,
          iso,
        });
      }
      weeks.push(week);
    }

    // Calculate stats
    const totalActive = Array.from(dayMap.values()).reduce((a, b) => a + b, 0);
    const last7Days = weeks.flat().slice(-7).reduce((sum, d) => sum + d.count, 0);

    return {
      heatmapData: weeks,
      stats: {
        totalActive,
        last7Days,
        currentStreak: streak,
        bestStreak,
      },
    };
  }, [recentlyRead, streak, bestStreak]);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <main className="min-h-[calc(100dvh-56px)] bg-background px-4 py-8 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2 flex items-center gap-2">
            <Flame className="w-8 h-8 text-orange-500" />
            Learning Streaks
          </h1>
          <p className="text-muted-foreground">Track your daily learning consistency over the past year</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-2">Current Streak</p>
            <p className="text-3xl font-semibold text-orange-500">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground mt-2">days in a row</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-2">Best Streak</p>
            <p className="text-3xl font-semibold text-emerald-500">{stats.bestStreak}</p>
            <p className="text-xs text-muted-foreground mt-2">all time</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-2">Last 7 Days</p>
            <p className="text-3xl font-semibold text-cyan-500">{stats.last7Days}</p>
            <p className="text-xs text-muted-foreground mt-2">completions</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Active</p>
            <p className="text-3xl font-semibold text-purple-500">{stats.totalActive}</p>
            <p className="text-xs text-muted-foreground mt-2">days with activity</p>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 overflow-x-auto">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            52-Week Heatmap
          </h2>

          <div className="inline-block">
            {/* Day labels */}
            <div className="flex gap-1 mb-2">
              <div className="w-8" />
              {dayNames.map((day, i) => (
                <div key={i} className="w-8 h-6 flex items-center justify-center text-xs text-muted-foreground font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-1">
              <div className="flex flex-col gap-1">
                {heatmapData.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex gap-1">
                    {week.map((day, dayIdx) => (
                      <div
                        key={`${weekIdx}-${dayIdx}`}
                        className={`w-8 h-8 rounded-md ${getColor(day.count)} border border-border/50 transition-colors hover:border-foreground/20 cursor-help`}
                        title={`${day.date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}: ${day.count} completion${day.count !== 1 ? "s" : ""}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-muted/30 border border-border/50" />
              <div className="w-4 h-4 rounded bg-emerald-500/30 border border-border/50" />
              <div className="w-4 h-4 rounded bg-emerald-500/50 border border-border/50" />
              <div className="w-4 h-4 rounded bg-emerald-500/70 border border-border/50" />
              <div className="w-4 h-4 rounded bg-emerald-500 border border-border/50" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">How Streaks Work</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-foreground font-medium">Current Streak:</span>
              <span>Days you've completed at least one topic in a row</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-medium">Best Streak:</span>
              <span>Your longest consecutive daily streak ever</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-medium">Heatmap:</span>
              <span>Brighter colors = more completions that day. Shows your last 52 weeks of activity</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
