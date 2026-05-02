import { Link } from "wouter";
import { ArrowRight, BookOpen, Zap, Brain, Layers, ChevronRight } from "lucide-react";
import { topics, categoryColors, difficultyColors, categories } from "@/data/topics";

const featuredSlugs = [
  "what-is-generative-ai",
  "transformers",
  "diffusion-models",
  "large-language-models",
  "rag",
  "ai-agents",
];

const stats = [
  { value: "28+", label: "Topics Covered" },
  { value: "5", label: "Categories" },
  { value: "3", label: "Learning Paths" },
  { value: "∞", label: "Things to Learn" },
];

export default function Home() {
  const featuredTopics = featuredSlugs
    .map(slug => topics.find(t => t.slug === slug))
    .filter(Boolean) as typeof topics;

  const topicsByCategory = categories.map(cat => ({
    category: cat,
    count: topics.filter(t => t.category === cat).length,
    topics: topics.filter(t => t.category === cat).slice(0, 3),
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8" data-testid="badge-hero">
            <Zap className="w-3.5 h-3.5" />
            From Basics to Cutting-Edge Research
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]" data-testid="heading-hero">
            Master{" "}
            <span className="gradient-text">Generative AI</span>
            <br />
            from First Principles
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A comprehensive, structured curriculum covering every facet of generative AI — from neural network fundamentals to the latest research frontiers. Written for engineers, researchers, and curious minds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learning-paths"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              data-testid="button-start-learning"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/topics"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors"
              data-testid="button-browse-topics"
            >
              <BookOpen className="w-4 h-4" />
              Browse All Topics
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative max-w-3xl mx-auto mt-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl border border-border bg-card/50 backdrop-blur" data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Topics</h2>
              <p className="text-muted-foreground">Start with the most impactful concepts</p>
            </div>
            <Link href="/topics" className="flex items-center gap-1 text-sm text-primary hover:underline font-medium" data-testid="link-view-all-topics">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTopics.map((topic) => (
              <Link key={topic.slug} href={`/topic/${topic.slug}`} data-testid={`card-topic-${topic.slug}`}>
                <div className="group h-full p-6 rounded-2xl border border-border bg-card hover:border-primary/40 card-glow transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[topic.category]}`}>
                        {topic.category}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColors[topic.difficulty]}`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{topic.readTime} min</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{topic.description}</p>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read topic <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Explore by Category</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Five structured categories covering the full breadth of generative AI — from foundations to the research frontier.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topicsByCategory.map(({ category, count, topics: catTopics }) => (
              <Link key={category} href={`/topics?category=${encodeURIComponent(category)}`} data-testid={`card-category-${category.toLowerCase().replace(" ", "-")}`}>
                <div className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 card-glow transition-all duration-200 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${categoryColors[category]}`}>
                      {category}
                    </span>
                    <span className="text-xs text-muted-foreground">{count} topics</span>
                  </div>
                  <ul className="space-y-1.5">
                    {catTopics.map(t => (
                      <li key={t.slug} className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                        {t.title}
                      </li>
                    ))}
                    {count > 3 && (
                      <li className="text-sm text-primary/70">+{count - 3} more</li>
                    )}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-10 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 pointer-events-none" />
            <Brain className="w-12 h-12 text-primary mx-auto mb-4 relative z-10" />
            <h2 className="text-3xl font-bold mb-3 relative z-10">Ready to dive in?</h2>
            <p className="text-muted-foreground mb-8 relative z-10 max-w-md mx-auto">
              Follow a guided learning path from zero to expert, or jump into any topic that interests you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                href="/learning-paths"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                data-testid="button-cta-learning-paths"
              >
                <Layers className="w-4 h-4" />
                View Learning Paths
              </Link>
              <Link
                href="/topics"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors"
                data-testid="button-cta-all-topics"
              >
                Browse All Topics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
