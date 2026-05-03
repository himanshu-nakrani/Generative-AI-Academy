import { useMemo } from "react";
import { BarChart3, TrendingUp, Target } from "lucide-react";
import { useQuizScores } from "@/hooks/useQuizScores";
import { topics } from "@/data/topics";

export default function QuizStats() {
  const { scores } = useQuizScores();

  const stats = useMemo(() => {
    const topicScores = new Map<string, { attempts: number; bestScore: number; lastTaken: string }>();

    // Parse scores: format is topic:attempt-index = score
    Object.entries(scores).forEach(([key, score]) => {
      if (typeof score !== "number") return;
      const [slug] = key.split(":");
      if (!topicScores.has(slug)) {
        topicScores.set(slug, { attempts: 0, bestScore: 0, lastTaken: "" });
      }
      const stats = topicScores.get(slug)!;
      stats.attempts++;
      stats.bestScore = Math.max(stats.bestScore, score);
      stats.lastTaken = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    });

    // Calculate aggregates
    const allScores = Array.from(topicScores.values()).map(s => s.bestScore);
    const avgScore = allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    const weakAreas = Array.from(topicScores.entries())
      .filter(([, s]) => s.bestScore < 70)
      .sort((a, b) => a[1].bestScore - b[1].bestScore);

    const strongAreas = Array.from(topicScores.entries())
      .filter(([, s]) => s.bestScore >= 85)
      .sort((a, b) => b[1].bestScore - a[1].bestScore);

    const totalAttempts = Array.from(topicScores.values()).reduce((sum, s) => sum + s.attempts, 0);

    return {
      topicScores,
      avgScore,
      weakAreas,
      strongAreas,
      totalAttempts,
      topicCount: topicScores.size,
    };
  }, [scores]);

  const getTopicTitle = (slug: string) => {
    return topics.find(t => t.slug === slug)?.title || slug;
  };

  return (
    <main className="min-h-[calc(100dvh-56px)] bg-background px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            Quiz Performance
          </h1>
          <p className="text-muted-foreground">Analyze your quiz performance and identify areas for improvement</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-2">Average Score</p>
            <p className="text-3xl font-semibold text-blue-500">{stats.avgScore}%</p>
            <p className="text-xs text-muted-foreground mt-2">{stats.topicCount} quizzes taken</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Attempts</p>
            <p className="text-3xl font-semibold text-cyan-500">{stats.totalAttempts}</p>
            <p className="text-xs text-muted-foreground mt-2">questions answered</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-2">Mastered Topics</p>
            <p className="text-3xl font-semibold text-emerald-500">{stats.strongAreas.length}</p>
            <p className="text-xs text-muted-foreground mt-2">scored ≥85%</p>
          </div>
        </div>

        {/* Weak Areas (Drill Focus) */}
        {stats.weakAreas.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              Areas to Drill ({stats.weakAreas.length})
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Topics where you scored below 70% — focus your next quiz attempts here</p>

            <div className="space-y-2">
              {stats.weakAreas.map(([slug, data]) => (
                <div key={slug} className="flex items-center justify-between p-4 bg-muted rounded-lg border border-red-500/20">
                  <div>
                    <p className="font-medium text-foreground">{getTopicTitle(slug)}</p>
                    <p className="text-xs text-muted-foreground">
                      Best: {data.bestScore}% • {data.attempts} attempt{data.attempts !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-red-500">{data.bestScore}%</div>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                        style={{ width: `${data.bestScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strong Areas */}
        {stats.strongAreas.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Mastered Topics ({stats.strongAreas.length})
            </h2>
            <p className="text-sm text-muted-foreground mb-4">You've scored 85% or higher on these — great job!</p>

            <div className="space-y-2">
              {stats.strongAreas.map(([slug, data]) => (
                <div key={slug} className="flex items-center justify-between p-4 bg-muted rounded-lg border border-emerald-500/20">
                  <div>
                    <p className="font-medium text-foreground">{getTopicTitle(slug)}</p>
                    <p className="text-xs text-muted-foreground">
                      Best: {data.bestScore}% • {data.attempts} attempt{data.attempts !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-emerald-500">{data.bestScore}%</div>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${data.bestScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats.topicCount === 0 && (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Quiz Data Yet</h3>
            <p className="text-muted-foreground mb-6">
              Take quizzes on topics to see your performance analytics here.
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-card border border-border rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-3">How to Use This Dashboard</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">→</span>
              <span><strong>Areas to Drill:</strong> Focus on topics scoring below 70%. Retake these quizzes to improve</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Mastered Topics:</strong> You've demonstrated strong knowledge here. Consolidate with spaced repetition</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">Avg</span>
              <span><strong>Average Score:</strong> Your overall quiz performance. Aim to improve by 5-10% each week</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
