import { useState, useMemo, useRef } from "react";
import { Link } from "wouter";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { glossaryTerms, glossaryByLetter, glossaryLetters } from "@/data/glossary";

export default function Glossary() {
  const [search, setSearch] = useState("");
  const letterRefs = useRef<Record<string, HTMLElement | null>>({});

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return glossaryTerms
      .filter(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [search]);

  const scrollTo = (letter: string) => {
    letterRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen py-12 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 border-b border-border pb-8 fade-up">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Reference</div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Glossary</h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {glossaryTerms.length} key terms in generative AI — from mathematical foundations to cutting-edge techniques.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 fade-up-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search terms and definitions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          />
          {search && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground tabular-nums">
              {filtered?.length ?? 0} result{filtered?.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* A–Z jump nav */}
        {!search && (
          <div className="flex flex-wrap gap-1 mb-10 fade-up-2">
            {glossaryLetters.map(l => (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                className="w-7 h-7 rounded text-xs font-mono font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Search results */}
        {search && filtered && (
          <div className="space-y-6">
            {filtered.length === 0 ? (
              <p className="text-muted-foreground text-sm py-10 text-center">No terms match "{search}".</p>
            ) : (
              filtered.map(term => (
                <TermCard key={term.term} term={term} highlight={search} />
              ))
            )}
          </div>
        )}

        {/* A–Z grouped list */}
        {!search && (
          <div className="space-y-12">
            {glossaryLetters.map(letter => (
              <section
                key={letter}
                ref={el => { letterRefs.current[letter] = el; }}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl font-bold font-mono text-primary w-8">{letter}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-6">
                  {glossaryByLetter[letter].map(term => (
                    <TermCard key={term.term} term={term} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Bottom links */}
        <div className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row gap-4">
          <Link href="/topics">
            <button className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors">
              <BookOpen className="w-3.5 h-3.5" />
              Browse All Topics
            </button>
          </Link>
          <Link href="/learning-paths">
            <button className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity">
              Start a Learning Path
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/15 text-primary rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function TermCard({ term, highlight: q }: { term: import("@/data/glossary").GlossaryTerm; highlight?: string }) {
  return (
    <div className="group">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold leading-snug">
          {q ? highlight(term.term, q) : term.term}
        </h3>
        {term.topicSlug && (
          <Link href={`/topic/${term.topicSlug}`}>
            <span className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5">
              Full article <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
        {q ? highlight(term.definition, q) : term.definition}
      </p>
    </div>
  );
}
