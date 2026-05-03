import { Link } from "wouter";
import { topics } from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function LearningPaths() {
  const { completed } = useApp();

  const paths = [
    {
      id: "beginner",
      title: "Beginner: First Principles",
      subtitle: "Start here if you are new to AI. Learn the foundational concepts, history, and basic neural network architecture.",
      slugs: ["what-is-generative-ai", "history-of-ai", "neural-networks-basics", "probability-statistics", "tokenization", "embeddings"],
    },
    {
      id: "intermediate",
      title: "Intermediate: Core Models",
      subtitle: "Dive into the architectures powering the AI revolution — from transformers to diffusion models.",
      slugs: ["attention-mechanism", "transformers", "large-language-models", "diffusion-models", "prompt-engineering", "rag"],
    },
    {
      id: "advanced",
      title: "Advanced: Research & Techniques",
      subtitle: "Explore the cutting-edge of AI research, optimization, safety, and agentic systems.",
      slugs: ["lora", "rlhf", "speculative-decoding", "moe", "mechanistic-interpretability", "constitutional-ai"],
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Learning Paths</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Follow a structured journey through the concepts of Generative AI. 
          Each path builds upon the last.
        </p>
      </div>

      <div className="space-y-16">
        {paths.map((path, idx) => {
          const pathTopics = path.slugs.map(s => topics.find(t => t.slug === s)).filter(Boolean) as typeof topics;
          const completedCount = pathTopics.filter(t => completed.has(t.slug)).length;
          const progressPct = Math.round((completedCount / pathTopics.length) * 100);

          return (
            <div key={path.id} className="relative">
              {/* Path Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                    {idx + 1}
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-foreground">{path.title}</h2>
                </div>
                <p className="text-[#6b4c2a] text-lg ml-14 mb-6">{path.subtitle}</p>
                
                <div className="ml-14 flex items-center gap-4">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-primary w-12 text-right">{progressPct}%</span>
                </div>
              </div>

              {/* Path Topics */}
              <div className="ml-14 grid gap-4">
                {pathTopics.map((topic, i) => {
                  const isDone = completed.has(topic.slug);
                  return (
                    <Link key={topic.slug} href={`/topic/${topic.slug}`} className="ws-card p-4 flex items-center gap-4 hover:border-primary transition-colors group">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <span className="text-muted-foreground font-bold text-sm">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-serif font-bold text-foreground group-hover:text-primary transition-colors text-lg">
                          {topic.title}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>{topic.category}</span>
                          <span className="w-1 h-1 rounded-full bg-border"></span>
                          <span>{topic.readTime}m read</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
