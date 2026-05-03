import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search as SearchIcon, Filter, BookOpen } from "lucide-react";
import { useSearch, useFilteredTopics } from "@/hooks/useSearch";
import { useApp } from "@/context/AppContext";
import { useQuizScores } from "@/hooks/useQuizScores";
import { topics } from "@/data/topics";

export default function Search() {
  const { completed } = useApp();
  const { scores } = useQuizScores();
  const [query, setQuery] = useState("");
  const searchResults = useSearch(query);

  const [activeTab, setActiveTab] = useState<"all" | "topics" | "sections">("all");

  const results = useMemo(() => {
    if (activeTab === "all") return searchResults;
    if (activeTab === "topics") return searchResults.filter(r => r.type === "topic");
    if (activeTab === "sections") return searchResults.filter(r => r.type === "section");
    return searchResults;
  }, [searchResults, activeTab]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Search</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics, concepts, and content..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 text-lg text-foreground transition-all"
            autoFocus
          />
        </div>
      </div>

      {query.trim() && (
        <div className="flex gap-2 mb-6 border-b border-border pb-4">
          {(["all", "topics", "sections"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-md capitalize ${
                activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {tab} ({tab === "all" ? searchResults.length : searchResults.filter(r => r.type === (tab === "topics" ? "topic" : "section")).length})
            </button>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="text-center py-20 bg-white border border-border rounded-xl">
          <p className="text-muted-foreground text-lg mb-2">No results found for "{query}"</p>
          <p className="text-sm text-muted-foreground">Try using different keywords or browsing the topics directly.</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((result, i) => (
          <Link key={`${result.slug}-${result.sectionIndex ?? 'main'}`} href={result.sectionIndex !== undefined ? `/topic/${result.slug}#section-${result.sectionIndex}` : `/topic/${result.slug}`} className="block">
            <div className="ws-card p-5 hover:border-primary transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {result.type === "topic" ? "Topic" : "Section"}
                </span>
                <span className="w-1 h-1 rounded-full bg-border"></span>
                <span className="text-xs font-medium text-primary">{result.category}</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                {result.title}
              </h3>
              <p className="text-sm text-[#6b5030] leading-relaxed">
                {result.preview}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
