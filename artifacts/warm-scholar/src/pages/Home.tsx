import { Link } from "wouter";
import { topics } from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { ArrowRight, BookOpen, Map as MapIcon, PenTool, Layout, CheckCircle2, ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CATEGORIES = [
  { name: "Foundations", count: topics.filter(t => t.category === "Foundations").length, icon: BookOpen },
  { name: "Core Models", count: topics.filter(t => t.category === "Core Models").length, icon: Layout },
  { name: "Techniques", count: topics.filter(t => t.category === "Techniques").length, icon: PenTool },
  { name: "Applications", count: topics.filter(t => t.category === "Applications").length, icon: MapIcon },
  { name: "Advanced Research", count: topics.filter(t => t.category === "Advanced Research").length, icon: MapIcon },
];

export default function Home() {
  const { recentlyRead, isComplete } = useApp();
  const heroReveal = useScrollReveal();
  
  const recentTopics = recentlyRead
    .map(slug => topics.find(t => t.slug === slug))
    .filter((t): t is typeof topics[0] => t !== undefined)
    .slice(0, 3);

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="pt-24 pb-20 px-6 max-w-5xl mx-auto text-center reveal" ref={heroReveal as any}>
        <div className="inline-block ws-badge mb-6">Generative AI</div>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Generative AI from <br/>
          <span className="relative">
            First Principles
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          A warm, scholarly reference for understanding the architecture, math, and concepts behind modern artificial intelligence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/learning-paths" className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
            Start a Learning Path <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/topics" className="w-full sm:w-auto px-8 py-3.5 bg-white text-foreground border border-border font-semibold rounded-md hover:bg-secondary/50 transition-all">
            Browse Topics
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t ws-divider max-w-3xl mx-auto">
          {[
            { label: "Articles", value: "40" },
            { label: "Categories", value: "5" },
            { label: "Paths", value: "3" },
            { label: "Terms", value: "70+" },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-serif font-bold text-foreground">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 space-y-24">
        
        {/* Categories */}
        <section>
          <h2 className="ws-section-heading text-2xl font-bold mb-8">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.name} href={`/topics?category=${encodeURIComponent(cat.name)}`} className="ws-card p-6 flex items-start gap-4 fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="p-3 bg-secondary rounded-lg text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-foreground mb-1">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count} topics</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recently Read */}
        {recentTopics.length > 0 && (
          <section>
            <h2 className="ws-section-heading text-2xl font-bold mb-8">Continue Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentTopics.map(topic => (
                <Link key={topic.slug} href={`/topic/${topic.slug}`} className="ws-card p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{topic.category}</div>
                    {isComplete(topic.slug) && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-foreground mb-2 line-clamp-2">{topic.title}</h3>
                  <div className="mt-auto pt-4 text-sm font-semibold text-primary flex items-center gap-1">
                    Resume <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="ws-section-heading text-2xl font-bold">Featured Topics</h2>
            <Link href="/topics" className="text-primary font-semibold text-sm hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.slice(0, 6).map(topic => (
              <Link key={topic.slug} href={`/topic/${topic.slug}`} className="ws-card p-6 flex items-center gap-5">
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{topic.category}</div>
                  <h3 className="font-serif font-bold text-lg text-foreground mb-1">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{topic.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
