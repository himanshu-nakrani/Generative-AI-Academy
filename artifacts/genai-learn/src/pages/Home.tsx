import { Link } from "wouter";
import {
  ArrowRight, BookOpen, Layers, Network, FlaskConical, Cpu, Microscope, ChevronRight
} from "lucide-react";
import { topics, categoryColors, categories, type Category } from "@/data/topics";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const featuredSlugs = [
  "transformers",
  "large-language-models",
  "diffusion-models",
  "rlhf",
  "ai-agents",
  "attention-mechanism",
];

const categoryMeta: Record<string, { icon: React.ReactNode; summary: string }> = {
  "Foundations": {
    icon: <BookOpen className="w-4 h-4" />,
    summary: "Neural networks, probability, training — the bedrock every practitioner needs.",
  },
  "Core Models": {
    icon: <Network className="w-4 h-4" />,
    summary: "Transformers, diffusion, LLMs — the architectures powering modern AI.",
  },
  "Techniques": {
    icon: <FlaskConical className="w-4 h-4" />,
    summary: "RLHF, RAG, fine-tuning, prompt engineering — how to train and deploy models.",
  },
  "Applications": {
    icon: <Cpu className="w-4 h-4" />,
    summary: "Code, vision, speech, video — real-world applications across modalities.",
  },
  "Advanced Research": {
    icon: <Microscope className="w-4 h-4" />,
    summary: "Interpretability, safety, world models — the research frontier.",
  },
};

function CategoryPanel({ category, idx }: { category: Category; idx: number }) {
  const catTopics = topics.filter(t => t.category === category);
  const meta = categoryMeta[category];
  const ref = useScrollReveal();
  return (
    <Link href={`/topics?category=${encodeURIComponent(category)}`}>
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={`reveal reveal-delay-${idx + 1} topic-card group rounded-lg p-5 h-full cursor-pointer`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
              {meta.icon}
            </span>
            <span className="text-sm font-semibold text-foreground">{category}</span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">{catTopics.length}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{meta.summary}</p>
        <ul className="space-y-1.5">
          {catTopics.slice(0, 4).map(t => (
            <li key={t.slug} className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-border flex-shrink-0" />
              {t.title}
            </li>
          ))}
          {catTopics.length > 4 && (
            <li className="text-xs text-primary/80 flex items-center gap-1 pl-3">
              +{catTopics.length - 4} more
            </li>
          )}
        </ul>
      </div>
    </Link>
  );
}

export default function Home() {
  const featuredTopics = featuredSlugs
    .map(slug => topics.find(t => t.slug === slug))
    .filter(Boolean) as typeof topics;

  const heroRef = useScrollReveal();
  const featuredRef = useScrollReveal();
  const catRef = useScrollReveal();

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-20 pb-14 px-5 sm:px-8 border-b border-border">
        <div className="max-w-5xl mx-auto">
          {/* Eyebrow */}
          <div className="fade-up mb-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground border border-border rounded px-2 py-1 bg-muted/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              v2025 · {topics.length} articles
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up-1 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-5 max-w-3xl">
            Generative AI<br />
            <span className="gradient-text">from First Principles</span>
          </h1>

          <p className="fade-up-2 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
            A structured, citable curriculum covering every concept in modern generative AI —
            from neural network fundamentals to mechanistic interpretability and safety. Written for
            engineers, researchers, and anyone who wants to understand, not just use, AI.
          </p>

          <div className="fade-up-3 flex flex-wrap gap-3 mb-10">
            <Link
              href="/learning-paths"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start with a Learning Path
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/topics"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Browse All Topics
            </Link>
          </div>

          {/* Stat strip */}
          <div className="fade-up-4 flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 border-t border-border text-sm text-muted-foreground">
            {[
              { val: topics.length, label: "in-depth articles" },
              { val: categories.length, label: "topic categories" },
              { val: 3, label: "guided learning paths" },
              { val: "100+", label: "runnable code examples" },
            ].map(({ val, label }) => (
              <span key={label} className="flex items-baseline gap-1.5">
                <span className="text-foreground font-semibold tabular-nums">{val}</span>
                <span>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curriculum Overview ──────────────────────────────── */}
      <section className="py-14 px-5 sm:px-8 border-b border-border">
        <div ref={catRef as React.Ref<HTMLDivElement>} className="max-w-5xl mx-auto">
          <div className="reveal flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-1">Curriculum</h2>
              <p className="text-sm text-muted-foreground">Five structured categories — browse by topic or follow a guided path.</p>
            </div>
            <Link href="/topics" className="text-sm text-primary hover:underline hidden sm:flex items-center gap-1">
              All topics <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(categories as Category[]).map((cat, i) => (
              <CategoryPanel key={cat} category={cat} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Topics ──────────────────────────────────── */}
      <section className="py-14 px-5 sm:px-8 border-b border-border">
        <div ref={featuredRef as React.Ref<HTMLDivElement>} className="max-w-5xl mx-auto">
          <div className="reveal flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-1">Core Articles</h2>
              <p className="text-sm text-muted-foreground">The six most foundational topics — start here if you're new to the field.</p>
            </div>
            <Link href="/topics" className="text-sm text-primary hover:underline hidden sm:flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {featuredTopics.map((topic, i) => (
              <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                <div
                  className={`reveal reveal-delay-${Math.min(i + 1, 6)} topic-card group rounded-lg p-5 cursor-pointer`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors leading-snug">
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground tabular-nums">{topic.readTime}m</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[topic.category]}`}>
                      {topic.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{topic.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why This Curriculum ──────────────────────────────── */}
      <section className="py-14 px-5 sm:px-8 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: "Citable sources",
                body: "Every major claim links to the original paper — Vaswani et al., Rombach et al., Brown et al. No hand-waving.",
              },
              {
                label: "Working code",
                body: "100+ examples in Python and PyTorch that implement what the text describes. Copy, run, modify.",
              },
              {
                label: "Structured depth",
                body: "Three difficulty levels, five categories, three curated learning paths. Read linearly or jump to what you need.",
              },
            ].map(({ label, body }) => (
              <div key={label} className="reveal">
                <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-14 px-5 sm:px-8">
        <div ref={heroRef as React.Ref<HTMLDivElement>} className="max-w-5xl mx-auto">
          <div className="reveal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-7 rounded-lg border border-border bg-card">
            <div>
              <p className="text-base font-semibold mb-1">Ready to build your understanding?</p>
              <p className="text-sm text-muted-foreground">
                Follow a structured path from zero to researcher, or jump directly to any topic.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                href="/learning-paths"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Layers className="w-3.5 h-3.5" />
                Learning Paths
              </Link>
              <Link
                href="/topics"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                Browse Topics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
