import { Link } from "wouter";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { topics, learningPaths, difficultyColors, categoryColors } from "@/data/topics";

const pathKeys = ["beginner", "intermediate", "advanced"] as const;

export default function LearningPaths() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4" data-testid="heading-learning-paths">Guided Learning Paths</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three structured tracks designed to take you from complete beginner to research-level understanding. Follow a path or mix and match topics as you explore.
          </p>
        </div>

        {/* Paths */}
        <div className="space-y-16">
          {pathKeys.map(key => {
            const path = learningPaths[key];
            const pathTopics = path.slugs
              .map(slug => topics.find(t => t.slug === slug))
              .filter(Boolean) as typeof topics;
            const totalReadTime = pathTopics.reduce((sum, t) => sum + t.readTime, 0);

            return (
              <div key={key} className="relative" data-testid={`path-${key}`}>
                {/* Path header */}
                <div className="flex items-start gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <span className="text-white font-bold text-lg">
                      {key === "beginner" ? "1" : key === "intermediate" ? "2" : "3"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{path.title}</h2>
                    <p className="text-muted-foreground">{path.subtitle}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {pathTopics.length} topics
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        ~{Math.round(totalReadTime / 60 * 10) / 10}h total reading
                      </span>
                    </div>
                  </div>
                </div>

                {/* Topic list with connector */}
                <div className="ml-6 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border to-transparent" />
                  <div className="space-y-3 pl-8">
                    {pathTopics.map((topic, i) => (
                      <div key={topic.slug} className="relative" data-testid={`path-topic-${topic.slug}`}>
                        {/* Connector dot */}
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex items-center">
                          <div className={`w-3 h-3 rounded-full border-2 bg-background border-primary/50`} />
                        </div>
                        <Link href={`/topic/${topic.slug}`}>
                          <div className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/40 card-glow transition-all duration-200 cursor-pointer">
                            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-mono font-bold text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm group-hover:text-primary transition-colors">{topic.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{topic.description}</div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[topic.category]}`}>
                                {topic.category}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                                <Clock className="w-3 h-3" />
                                {topic.readTime}m
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start button */}
                <div className="ml-6 pl-8 mt-4">
                  <Link href={`/topic/${pathTopics[0]?.slug}`} data-testid={`button-start-${key}-path`}>
                    <button className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r ${path.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg`}>
                      Start {path.title}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 p-8 rounded-2xl border border-border bg-card text-center">
          <h3 className="text-xl font-bold mb-2">Prefer to explore freely?</h3>
          <p className="text-muted-foreground mb-6 text-sm">Browse all topics by category or difficulty and create your own path.</p>
          <Link href="/topics" data-testid="button-browse-all-topics">
            <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-muted text-foreground font-semibold text-sm hover:bg-muted/70 transition-colors">
              Browse All Topics
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
