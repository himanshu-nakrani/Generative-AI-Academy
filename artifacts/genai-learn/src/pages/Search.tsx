import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import {
  Search as SearchIcon, ArrowLeft, Book, BookMarked, FileText, Clock, Target,
  Filter, X, ChevronDown,
} from "lucide-react";
import { topics, categoryColors, difficultyColors } from "@/data/topics";
import { useSearch, type SearchResult, useFilteredTopics, type FilterOptions } from "@/hooks/useSearch";
import { useApp } from "@/context/AppContext";
import { useQuizScores } from "@/hooks/useQuizScores";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const CATEGORIES = ["Foundations", "Core Models", "Techniques", "Applications", "Advanced Research"];

export default function Search() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Partial<FilterOptions>>({});

  const { completed } = useApp();
  const { scores } = useQuizScores();
  const searchResults = useSearch(query);
  const filteredTopics = useFilteredTopics(filters, completed, scores);

  // If filtering, show filtered topics; if searching, show search results
  const displayMode = query.trim() ? "search" : "browse";
  const results: SearchResult[] = displayMode === "search" ? searchResults : filteredTopics.map(t => ({
    type: "topic" as const,
    slug: t.slug,
    title: t.title,
    preview: t.description,
    category: t.category,
    difficulty: t.difficulty,
  }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        (document.querySelector('[data-search-input]') as HTMLInputElement)?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleCategory = (cat: string) => {
    const next = new Set(filters.categories ?? []);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setFilters({ ...filters, categories: next.size > 0 ? next : undefined });
  };

  const toggleDifficulty = (diff: string) => {
    const next = new Set(filters.difficulties ?? []);
    if (next.has(diff)) next.delete(diff);
    else next.add(diff);
    setFilters({ ...filters, difficulties: next.size > 0 ? next : undefined });
  };

  const toggleCompletion = (status: "completed" | "not-started") => {
    const next = new Set(filters.completionStatus ?? []);
    if (next.has(status)) next.delete(status);
    else next.add(status);
    setFilters({ ...filters, completionStatus: next.size > 0 ? next : undefined });
  };

  const clearFilters = () => setFilters({});

  const activeFilterCount = [
    (filters.categories?.size ?? 0),
    (filters.difficulties?.size ?? 0),
    (filters.completionStatus?.size ?? 0),
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Search header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm py-4 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                data-search-input
                type="text"
                placeholder="Search topics, sections, content..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40 hover:bg-muted"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Filters panel */}
        {showFilters && (
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</p>
                <div className="space-y-1.5">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories?.has(cat) ?? false}
                        onChange={() => toggleCategory(cat)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="flex-1">{cat}</span>
                      <span className="text-xs text-muted-foreground">
                        {topics.filter(t => t.category === cat).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difficulty</p>
                <div className="space-y-1.5">
                  {DIFFICULTIES.map(diff => (
                    <label key={diff} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.difficulties?.has(diff) ?? false}
                        onChange={() => toggleDifficulty(diff)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="flex-1">{diff}</span>
                      <span className="text-xs text-muted-foreground">
                        {topics.filter(t => t.difficulty === diff).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Completion status */}
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
                <div className="space-y-1.5">
                  {[
                    { val: "completed" as const, label: "Completed" },
                    { val: "not-started" as const, label: "Not started" },
                  ].map(({ val, label }) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.completionStatus?.has(val) ?? false}
                        onChange={() => toggleCompletion(val)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="flex-1">{label}</span>
                      <span className="text-xs text-muted-foreground">
                        {val === "completed" ? completed.size : topics.length - completed.size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quiz taken filter */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.quizOnly ?? false}
                    onChange={() => setFilters({ ...filters, quizOnly: !filters.quizOnly })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="flex-1">Quiz completed</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {displayMode === "search"
                ? query.trim()
                  ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
                  : ""
                : `${results.length} topic${results.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-sm text-muted-foreground">
                {query.trim() ? "No results found" : "No topics match your filters"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result, i) => {
                const topic = topics.find(t => t.slug === result.slug);
                const isCompleted = completed.has(result.slug);
                const quizScore = scores[result.slug];
                const quizPct = quizScore ? Math.round((quizScore.score / quizScore.total) * 100) : null;
                const href = result.sectionIndex !== undefined ? `/topic/${result.slug}#section-${result.sectionIndex}` : `/topic/${result.slug}`;

                return (
                  <Link
                    key={`${result.slug}:${result.sectionIndex ?? ""}:${i}`}
                    href={href}
                  >
                    <div className="group p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-primary/4 cursor-pointer transition-all">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {result.type === "topic"
                            ? <Book className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            : <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                            {result.title}
                          </h3>
                        </div>
                        {isCompleted && <BookMarked className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                        {result.preview}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {result.category && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[result.category as keyof typeof categoryColors]}`}>
                            {result.category}
                          </span>
                        )}
                        {result.difficulty && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[result.difficulty as keyof typeof difficultyColors]}`}>
                            {result.difficulty}
                          </span>
                        )}
                        {topic && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />{topic.readTime}m
                          </span>
                        )}
                        {quizPct !== null && (
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                            quizPct >= 80 ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                            : quizPct >= 60 ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                            : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                          }`}>
                            <Target className="w-3 h-3 inline mr-0.5" />{quizPct}%
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
