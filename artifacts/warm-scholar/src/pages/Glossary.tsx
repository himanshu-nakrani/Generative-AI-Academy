import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search as SearchIcon, ExternalLink } from "lucide-react";
import { glossaryTerms } from "@/data/glossary";

export default function Glossary() {
  const [search, setSearch] = useState("");

  const filteredTerms = useMemo(() => {
    let result = glossaryTerms;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.term.toLowerCase().includes(q) || 
        t.definition.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => a.term.localeCompare(b.term));
  }, [search]);

  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof glossaryTerms> = {};
    filteredTerms.forEach(t => {
      const letter = t.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    });
    return groups;
  }, [filteredTerms]);

  const letters = Object.keys(groupedTerms).sort();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-5xl font-serif font-bold text-foreground mb-6 leading-tight">Glossary</h1>
        <p className="text-xl text-[#6b4c2a] leading-relaxed mb-8">
          A comprehensive dictionary of terminology, concepts, and algorithms in Generative AI.
        </p>
        
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search terms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
          />
        </div>
      </div>

      {!search && (
        <div className="flex flex-wrap gap-2 mb-12">
          {letters.map(letter => (
            <a 
              key={letter} 
              href={`#letter-${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded bg-secondary/50 text-primary font-bold hover:bg-primary/20 transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      )}

      <div className="space-y-12">
        {letters.map(letter => (
          <div key={letter} id={`letter-${letter}`} className="scroll-mt-24">
            <h2 className="text-3xl font-serif font-bold text-primary mb-6 border-b border-border pb-2">{letter}</h2>
            <div className="space-y-6">
              {groupedTerms[letter].map(term => (
                <div key={term.term} className="ws-card p-6">
                  <h3 className="font-serif font-bold text-xl text-foreground mb-3">{term.term}</h3>
                  <p className="text-[#4a3520] leading-relaxed mb-4">{term.definition}</p>
                  {term.topicSlug && (
                    <Link href={`/topic/${term.topicSlug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      <ExternalLink className="w-4 h-4" />
                      Read related topic
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {letters.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No terms found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
