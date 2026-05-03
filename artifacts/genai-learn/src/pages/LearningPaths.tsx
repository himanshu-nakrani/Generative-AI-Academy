import { Link } from "wouter";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { topics, learningPaths, difficultyColors, categoryColors } from "@/data/topics";
import { useApp } from "@/context/AppContext";

const pathKeys = ["beginner", "intermediate", "advanced"] as const;

const pathAccent: Record<string, string> = {
  beginner:     "bg-emerald-600",
  intermediate: "bg-violet-600",
  advanced:     "bg-slate-700",
};

export default function LearningPaths() {
  const { isComplete, completedCount } = useApp();

  return (
    <div className="min-h-screen py-14 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-14 border-b border-border pb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Guided Tracks
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Learning Paths</h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            Three structured tracks designed to take you from first principles to research-level understanding. Follow a path or jump directly to any topic.
          </p>
          {completedCount > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium" role="status">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              {completedCount} of {topics.length} topics completed
            </div>
          )}
        </div>

        {/* Paths */}
        <div className="space-y-16">
          {pathKeys.map((key, pathIdx) => {
            const path = learningPaths[key];
            const pathTopics = path.slugs
              .map(slug => topics.find(t => t.slug === slug))
              .filter(Boolean) as typeof topics;
            const totalReadTime   = pathTopics.reduce((sum, t) => sum + t.readTime, 0);
            const completedInPath = pathTopics.filter(t => isComplete(t.slug)).length;
            const pct             = pathTopics.length > 0 ? Math.round((completedInPath / pathTopics.length) * 100) : 0;

            return (
              <div key={key}>
                {/* Path header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-9 h-9 rounded-md ${pathAccent[key]} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm font-mono">
                      {String(pathIdx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold tracking-tight mb-0.5">{path.title}</h2>
                    <p className="text-sm text-muted-foreground">{path.subtitle}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                        {pathTopics.length} topics
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span aria-label={`approximately ${Math.round(totalReadTime / 60 * 10) / 10} hours reading`}>
                          ~{Math.round(totalReadTime / 60 * 10) / 10}h reading
                        </span>
                      </span>
                      {completedInPath > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {completedInPath}/{pathTopics.length} done
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    {completedInPath > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <div 
                          className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${path.title} progress: ${completedInPath} of ${pathTopics.length} topics completed`}
                        >
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-muted-foreground tabular-nums w-8 text-right" aria-hidden="true">{pct}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Topic list */}
                <div className="border border-border rounded-lg overflow-hidden">
                  {pathTopics.map((topic, i) => {
                    const done = isComplete(topic.slug);
                    return (
                      <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                        <div className={`group flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-b-0 bg-card hover:bg-muted/40 transition-colors cursor-pointer ${
                          done ? "topic-completed" : ""
                        }`}>
                          <span className="text-xs font-mono text-muted-foreground/50 w-5 text-right tabular-nums flex-shrink-0">
                            {done
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              : String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium group-hover:text-primary transition-colors leading-snug ${done ? "text-muted-foreground" : ""}`}>
                              {topic.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{topic.description}</div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline ${categoryColors[topic.category]}`}>
                              {topic.category}
                            </span>
                            <span className="text-xs text-muted-foreground tabular-nums">{topic.readTime}m</span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Start / Continue button */}
                <div className="mt-4">
                  {pct === 100 ? (
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Path complete!
                    </div>
                  ) : (
                    <Link href={`/topic/${
                      completedInPath > 0
                        ? (pathTopics.find(t => !isComplete(t.slug))?.slug ?? pathTopics[0].slug)
                        : pathTopics[0]?.slug
                    }`}>
                      <button className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity">
                        {completedInPath > 0 ? "Continue" : "Start"} {path.title}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-10 border-t border-border">
          <p className="text-sm font-semibold mb-1">Prefer to explore freely?</p>
          <p className="text-sm text-muted-foreground mb-4">Browse all topics by category or difficulty and create your own path.</p>
          <Link href="/topics">
            <button className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors">
              Browse All Topics
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
