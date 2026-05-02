import { ExternalLink, BookOpen, GraduationCap, Wrench } from "lucide-react";
import { resources } from "@/data/topics";

const categoryIcons: Record<string, typeof BookOpen> = {
  "Foundational Papers": BookOpen,
  "Courses & Books": GraduationCap,
  "Tools & Frameworks": Wrench,
};

export default function Resources() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3" data-testid="heading-resources">Resources</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A curated collection of papers, books, courses, and tools to go deeper. Each resource is hand-picked for quality and relevance.
          </p>
        </div>

        {/* Resource sections */}
        <div className="space-y-12">
          {resources.map(section => {
            const Icon = categoryIcons[section.category] ?? BookOpen;
            return (
              <div key={section.category} data-testid={`section-${section.category.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">{section.category}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.items.map(item => (
                    <a
                      key={item.title}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/40 card-glow transition-all duration-200 block"
                      data-testid={`resource-${item.title.toLowerCase().replace(/\s+/g, "-").substring(0, 20)}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                      {"author" in item && item.author && (
                        <div className="text-xs text-muted-foreground mb-1.5">
                          {item.author}{"year" in item && item.year ? ` · ${item.year}` : ""}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-16 p-8 rounded-2xl border border-border bg-card/50">
          <h3 className="font-bold text-lg mb-4">Learning Tips</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">1.</span>
              Start with the Beginner Learning Path to build strong foundations before diving into models.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">2.</span>
              Read papers alongside code implementations — abstract concepts become clear when you see them in PyTorch.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">3.</span>
              Andrej Karpathy's videos on implementing transformers and GPT from scratch are essential viewing.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">4.</span>
              Hugging Face is the de-facto standard for working with models — learn their ecosystem early.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">5.</span>
              Build something with what you learn. The best way to understand RAG is to build a RAG system.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
