import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Zap, Brain, Layers, ChevronRight, Cpu, Network, FlaskConical, Microscope, BarChart3, Sparkles } from "lucide-react";
import { topics, categoryColors, difficultyColors, categories } from "@/data/topics";
import { NeuralNetViz } from "@/components/NeuralNetViz";
import { ParticleField } from "@/components/ParticleField";
import { useScrollReveal, useCountUp } from "@/hooks/useScrollReveal";

const featuredSlugs = [
  "what-is-generative-ai",
  "transformers",
  "diffusion-models",
  "large-language-models",
  "rag",
  "ai-agents",
];

const statsData = [
  { value: 40, suffix: "+", label: "Topics Covered" },
  { value: 5, suffix: "", label: "Categories" },
  { value: 3, suffix: "", label: "Learning Paths" },
  { value: 100, suffix: "+", label: "Code Examples" },
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Foundations":        <BookOpen className="w-5 h-5" />,
  "Core Models":        <Network className="w-5 h-5" />,
  "Techniques":         <FlaskConical className="w-5 h-5" />,
  "Applications":       <Cpu className="w-5 h-5" />,
  "Advanced Research":  <Microscope className="w-5 h-5" />,
};

const howItWorks = [
  { step: "01", title: "Pick your path", desc: "Beginner, practitioner, or researcher — start exactly where you are.", icon: <Layers className="w-6 h-6" /> },
  { step: "02", title: "Read in-depth articles", desc: "Real explanations with math, code, and intuition — no hand-waving.", icon: <BookOpen className="w-6 h-6" /> },
  { step: "03", title: "Explore interlinked topics", desc: "Every article cross-links related concepts so you build a complete map.", icon: <Network className="w-6 h-6" /> },
  { step: "04", title: "Apply what you learn", desc: "Runnable code examples let you test every concept as you read.", icon: <Sparkles className="w-6 h-6" /> },
];

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const numRef = useCountUp(value, 1600);
  const cardRef = useScrollReveal();

  return (
    <div ref={cardRef as React.Ref<HTMLDivElement>} className="reveal text-center p-5 rounded-2xl border border-border bg-card/50 backdrop-blur card-pulse">
      <div className="text-3xl font-bold gradient-text">
        <span ref={numRef as React.Ref<HTMLSpanElement>}>0</span>{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export default function Home() {
  const featuredTopics = featuredSlugs
    .map(slug => topics.find(t => t.slug === slug))
    .filter(Boolean) as typeof topics;

  const topicsByCategory = categories.map(cat => ({
    category: cat,
    count: topics.filter(t => t.category === cat).length,
    topics: topics.filter(t => t.category === cat).slice(0, 3),
  }));

  const heroRef = useScrollReveal();
  const badgeRef = useScrollReveal();
  const featuredRef = useScrollReveal();
  const howRef = useScrollReveal();
  const catRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-24 px-4">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <ParticleField />

        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb-float absolute top-1/4 left-[15%] w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
          <div className="orb-float-slow absolute top-1/3 right-[12%] w-64 h-64 bg-accent/8 rounded-full blur-3xl" />
          <div className="orb-float-alt absolute bottom-1/4 left-[40%] w-48 h-48 bg-primary/6 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div
            ref={badgeRef as React.Ref<HTMLDivElement>}
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Zap className="w-3.5 h-3.5" />
            From Basics to Cutting-Edge Research
          </div>

          <h1 className="fade-up-1 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Master{" "}
            <span className="shimmer-text">Generative AI</span>
            <br />
            from First Principles
          </h1>

          <p className="fade-up-2 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A comprehensive, structured curriculum covering every facet of generative AI — from neural network fundamentals to the latest research frontiers. Written for engineers, researchers, and curious minds.
          </p>

          <div className="fade-up-3 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learning-paths"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/topics"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted hover:border-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              Browse All Topics
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative max-w-3xl mx-auto mt-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statsData.map((s, i) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* Neural net visualization */}
        <div className="fade-up-4 relative max-w-3xl mx-auto mt-16 h-52 rounded-2xl border border-border bg-card/30 overflow-hidden backdrop-blur">
          <div className="scan-line" />
          <NeuralNetViz />
          <div className="absolute inset-0 flex items-end p-4 pointer-events-none">
            <span className="text-xs text-muted-foreground/60 font-mono">neural network — live visualization</span>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-border bg-card/20">
        <div ref={howRef as React.Ref<HTMLDivElement>} className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Structured depth — not a shallow overview. Every topic is a real article you can learn from.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {howItWorks.map((step, i) => (
              <div
                key={step.step}
                className={`reveal reveal-delay-${i + 1} relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all group`}
              >
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2.5 -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-primary/40" />
                  </div>
                )}
                <div className="text-4xl font-black text-primary/10 mb-4 font-mono leading-none">{step.step}</div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  {step.icon}
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Topics ──────────────────────────────────── */}
      <section className="py-20 px-4">
        <div ref={featuredRef as React.Ref<HTMLDivElement>} className="max-w-7xl mx-auto">
          <div className="reveal flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Topics</h2>
              <p className="text-muted-foreground">Start with the most impactful concepts</p>
            </div>
            <Link href="/topics" className="flex items-center gap-1 text-sm text-primary hover:underline font-medium">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTopics.map((topic, i) => (
              <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                <div className={`reveal reveal-delay-${Math.min(i + 1, 6)} group h-full p-6 rounded-2xl border border-border bg-card hover:border-primary/40 card-glow card-pulse transition-all duration-200 cursor-pointer`}>
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

      {/* ── Topic Count Banner ──────────────────────────────── */}
      <section className="py-10 px-4 border-y border-border bg-card/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="font-semibold">{topics.length} in-depth articles</span>
            <span className="text-muted-foreground text-sm">covering every GenAI topic from foundations to research frontiers</span>
          </div>
          <Link href="/topics" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline">
            Browse all topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div ref={catRef as React.Ref<HTMLDivElement>} className="max-w-7xl mx-auto">
          <div className="reveal text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Explore by Category</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Five structured categories covering the full breadth of generative AI — from foundations to the research frontier.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topicsByCategory.map(({ category, count, topics: catTopics }, i) => (
              <Link key={category} href={`/topics?category=${encodeURIComponent(category)}`}>
                <div className={`reveal reveal-delay-${Math.min(i + 1, 5)} group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 card-glow card-pulse transition-all duration-200 h-full`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        {categoryIcons[category]}
                      </div>
                      <span className={`text-sm px-2.5 py-1 rounded-full font-medium ${categoryColors[category]}`}>
                        {category}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{count} topics</span>
                  </div>
                  <ul className="space-y-2">
                    {catTopics.map(t => (
                      <li key={t.slug} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                        {t.title}
                      </li>
                    ))}
                    {count > 3 && (
                      <li className="text-sm text-primary/70 pl-3.5">+{count - 3} more topics</li>
                    )}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div ref={ctaRef as React.Ref<HTMLDivElement>} className="max-w-3xl mx-auto">
          <div className="reveal p-10 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="orb-float-slow absolute -top-16 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="orb-float absolute -bottom-16 -left-16 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
                <Brain className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Ready to dive in?</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Follow a guided learning path from zero to expert, or jump into any topic that interests you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/learning-paths"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/25"
                >
                  <Layers className="w-4 h-4" />
                  View Learning Paths
                </Link>
                <Link
                  href="/topics"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted transition-all hover:scale-[1.02]"
                >
                  Browse All Topics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
