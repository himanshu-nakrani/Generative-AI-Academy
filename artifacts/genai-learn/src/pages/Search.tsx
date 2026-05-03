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
    <main className="min-h-screen bg-background" role="main">
      {/* Search header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm py-4 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <label htmlFor="search-input" className="sr-only">Search topics, sections, and content</label>
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="search-input"
                data-search-input
                type="search"
                placeholder="Search topics, sections, content..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                aria-describedby="search-results-status"
                autoComplete="off"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                showFilters
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40 hover:bg-muted"
              }`}
              aria-expanded={showFilters}
              aria-controls="filters-panel"
              aria-label={`Filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold" aria-hidden="true">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Filters panel */}
        {showFilters && (
          <aside id="filters-panel" className="md:col-span-1" aria-label="Search filters">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline"
                    aria-label="Clear all filters"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories */}
              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Category</legend>
                <div className="space-y-2" role="group">
                  {CATEGORIES.map(cat => {
                    const id = `filter-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`;
                    return (
                      <label key={cat} htmlFor={id} className="flex items-center gap-2 text-sm cursor-pointer min-h-[44px]">
                        <input
                          id={id}
                          type="checkbox"
                          checked={filters.categories?.has(cat) ?? false}
                          onChange={() => toggleCategory(cat)}
                          className="w-5 h-5 rounded border-border accent-primary"
                        />
                        <span className="flex-1">{cat}</span>
                        <span className="text-sm text-muted-foreground" aria-label={`${topics.filter(t => t.category === cat).length} topics`}>
                          {topics.filter(t => t.category === cat).length}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Difficulty */}
              <fieldset className="space-y-2 pt-2 border-t border-border">
                <legend className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Difficulty</legend>
                <div className="space-y-2" role="group">
                  {DIFFICULTIES.map(diff => {
                    const id = `filter-diff-${diff.toLowerCase()}`;
                    return (
                      <label key={diff} htmlFor={id} className="flex items-center gap-2 text-sm cursor-pointer min-h-[44px]">
                        <input
                          id={id}
                          type="checkbox"
                          checked={filters.difficulties?.has(diff) ?? false}
                          onChange={() => toggleDifficulty(diff)}
                          className="w-5 h-5 rounded border-border accent-primary"
                        />
                        <span className="flex-1">{diff}</span>
                        <span className="text-sm text-muted-foreground">
                          {topics.filter(t => t.difficulty === diff).length}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Completion status */}
              <fieldset className="space-y-2 pt-2 border-t border-border">
                <legend className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Status</legend>
                <div className="space-y-2" role="group">
                  {[
                    { val: "completed" as const, label: "Completed" },
                    { val: "not-started" as const, label: "Not started" },
                  ].map(({ val, label }) => {
                    const id = `filter-status-${val}`;
                    return (
                      <label key={val} htmlFor={id} className="flex items-center gap-2 text-sm cursor-pointer min-h-[44px]">
                        <input
                          id={id}
                          type="checkbox"
                          checked={filters.completionStatus?.has(val) ?? false}
                          onChange={() => toggleCompletion(val)}
                          className="w-5 h-5 rounded border-border accent-primary"
                        />
                        <span className="flex-1">{label}</span>
                        <span className="text-sm text-muted-foreground">
                          {val === "completed" ? completed.size : topics.length - completed.size}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Quiz taken filter */}
              <fieldset className="space-y-2 pt-2 border-t border-border">
                <label htmlFor="filter-quiz" className="flex items-center gap-2 text-sm cursor-pointer min-h-[44px]">
                  <input
                    id="filter-quiz"
                    type="checkbox"
                    checked={filters.quizOnly ?? false}
                    onChange={() => setFilters({ ...filters, quizOnly: !filters.quizOnly })}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <span className="flex-1">Quiz completed</span>
                </label>
              </fieldset>
            </div>
          </aside>
        )}

        {/* Results */}
        <section className={showFilters ? "md:col-span-3" : "md:col-span-4"} aria-label="Search results">
          <div className="mb-6">
            <p id="search-results-status" className="text-sm text-muted-foreground" role="status" aria-live="polite">
              {displayMode === "search"
                ? query.trim()
                  ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
                  : ""
                : `${results.length} topic${results.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12" role="status">
              <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                {query.trim() ? "No results found" : "No topics match your filters"}
              </p>
            </div>
          ) : (
            <ul className="space-y-3" role="list" aria-label="Search results list">
              {results.map((result, i) => {
                const topic = topics.find(t => t.slug === result.slug);
                const isCompleted = completed.has(result.slug);
                const quizScore = scores[result.slug];
                const quizPct = quizScore ? Math.round((quizScore.score / quizScore.total) * 100) : null;
                const href = result.sectionIndex !== undefined ? `/topic/${result.slug}#section-${result.sectionIndex}` : `/topic/${result.slug}`;

                return (
                  <li key={`${result.slug}:${result.sectionIndex ?? ""}:${i}`}>
                    <Link
                      href={href}
                      aria-label={`${result.title}${isCompleted ? ', completed' : ''}${quizPct !== null ? `, quiz score ${quizPct}%` : ''}`}
                    >
                      <article className="group p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-primary/4 cursor-pointer transition-all">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {result.type === "topic"
                              ? <Book className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                              : <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />}
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                              {result.title}
                            </h3>
                          </div>
                          {isCompleted && <BookMarked className="w-4 h-4 text-emerald-500 flex-shrink-0" aria-label="Completed" />}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                          {result.preview}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                          {result.category && (
                            <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${categoryColors[result.category as keyof typeof categoryColors]}`}>
                              {result.category}
                            </span>
                          )}
                          {result.difficulty && (
                            <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${difficultyColors[result.difficulty as keyof typeof difficultyColors]}`}>
                              {result.difficulty}
                            </span>
                          )}
                          {topic && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              <span aria-label={`${topic.readTime} minutes read time`}>{topic.readTime}m</span>
                            </span>
                          )}
                          {quizPct !== null && (
                            <span className={`text-sm px-2 py-0.5 rounded font-medium ${
                              quizPct >= 80 ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                              : quizPct >= 60 ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                              : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                            }`} aria-label={`Quiz score ${quizPct} percent`}>
                              <Target className="w-3 h-3 inline mr-0.5" aria-hidden="true" />{quizPct}%
                            </span>
                          )}
                        </div>
                      </article>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
