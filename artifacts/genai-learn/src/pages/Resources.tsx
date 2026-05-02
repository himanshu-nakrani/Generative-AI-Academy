import { ExternalLink, BookOpen, GraduationCap, Wrench } from "lucide-react";
import { resources } from "@/data/topics";

const categoryMeta: Record<string, { icon: React.ReactNode; label: string }> = {
  "Foundational Papers": { icon: <BookOpen className="w-4 h-4" />, label: "01" },
  "Courses & Books":     { icon: <GraduationCap className="w-4 h-4" />, label: "02" },
  "Tools & Frameworks":  { icon: <Wrench className="w-4 h-4" />, label: "03" },
};

export default function Resources() {
  return (
    <div className="min-h-screen py-14 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-14 border-b border-border pb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Reference Library
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Resources</h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            Curated papers, textbooks, courses, and tools — selected for depth and lasting relevance.
          </p>
        </div>

        {/* Resource sections */}
        <div className="space-y-14">
          {resources.map(section => {
            const meta = categoryMeta[section.category];
            return (
              <div key={section.category}>
                {/* Section heading */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-xs font-mono font-bold text-muted-foreground/50">
                    {meta?.label ?? "–"}
                  </span>
                  <h2 className="text-lg font-bold tracking-tight">{section.category}</h2>
                </div>

                {/* Items — editorial table layout */}
                <div className="border border-border rounded-lg overflow-hidden">
                  {section.items.map((item, i) => (
                    <a
                      key={item.title}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 px-5 py-4 border-b border-border last:border-b-0 bg-card hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-semibold group-hover:text-primary transition-colors leading-snug">
                            {item.title}
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                        </div>
                        {"author" in item && item.author && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {item.author}{"year" in item && item.year ? ` · ${item.year}` : ""}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Learning tips */}
        <div className="mt-16 pt-10 border-t border-border">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Learning Notes</h3>
          <div className="space-y-3">
            {[
              "Build foundations before papers — the math pays off.",
              "Read papers alongside code implementations. Abstract concepts become concrete in PyTorch.",
              "Karpathy's from-scratch series (makemore, nanoGPT) is essential.",
              "Learn HuggingFace early — it's the standard for working with models.",
              "Build something with every concept. The best way to understand RAG is to build a RAG system.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs font-mono font-bold text-muted-foreground/40 mt-0.5 w-5 text-right flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
