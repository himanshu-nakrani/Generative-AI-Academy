import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Filter, Clock, ArrowRight, CheckCircle2, Sparkles, Bookmark, Lock } from "lucide-react";
import Fuse from "fuse.js";
import {
  topics,
  categories,
  difficulties,
  categoryColors,
  difficultyColors,
  type Category,
  type Difficulty,
} from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { prerequisites } from "@/data/prerequisites";

const fuse = new Fuse(topics, {
  keys: [
    { name: "title",           weight: 0.50 },
    { name: "description",     weight: 0.30 },
    { name: "category",        weight: 0.05 },
    { name: "sections.title",  weight: 0.15 },
  ],
  threshold: 0.35,
  includeScore: true,
});

export default function Topics() {
  const [location] = useLocation();
  const [search, setSearch]                   = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");
  const { isComplete, completed } = useApp();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // Parse query params on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const cat = url.searchParams.get("category");
    if (cat && (categories as string[]).includes(cat)) {
      setSelectedCategory(cat as Category);
    }
  }, []);

  const filtered = useMemo(() => {
    let base = topics;
    if (search.trim()) {
      base = fuse.search(search.trim()).map(r => r.item);
    }
    return base.filter(t => {
      const matchCat  = selectedCategory === "All" || t.category === selectedCategory;
      const matchDiff = selectedDifficulty === "All" || t.difficulty === selectedDifficulty;
      return matchCat && matchDiff;
    });
  }, [search, selectedCategory, selectedDifficulty]);

  const grouped = useMemo(() => {
    if (selectedCategory !== "All" || search.trim()) {
      return [{ category: selectedCategory === "All" ? "Results" : selectedCategory, topics: filtered }];
    }
    return categories
      .map(cat => ({ category: cat, topics: filtered.filter(t => t.category === cat) }))
      .filter(g => g.topics.length > 0);
  }, [filtered, selectedCategory, search]);

  // Recommendations: related slugs of completed topics that are not yet completed
  const recommendations = useMemo(() => {
    if (completed.size === 0) return [];
    const completedTopics = topics.filter(t => completed.has(t.slug));
    const relatedSlugs = new Set(completedTopics.flatMap(t => t.relatedSlugs));
    return topics
      .filter(t => relatedSlugs.has(t.slug) && !completed.has(t.slug))
      .slice(0, 4);
  }, [completed]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3" data-testid="heading-topics">All Topics</h1>
          <p className="text-muted-foreground text-lg">
            {topics.length} topics covering every aspect of generative AI
          </p>
        </div>

        {/* Recommendations strip */}
        {recommendations.length > 0 && (
          <div className="mb-10 p-5 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Continue Learning</p>
              <span className="text-xs text-muted-foreground">— based on your progress</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recommendations.map(t => (
                <Link key={t.slug} href={`/topic/${t.slug}`}>
                  <div className="group p-3.5 rounded-lg border border-border bg-card hover:border-primary/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[t.difficulty]}`}>
                        {t.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">{t.readTime}m</span>
                    </div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {t.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 sticky top-16 z-10 py-4 bg-background/80 backdrop-blur-xl -mx-4 px-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search topics, descriptions, sections…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              data-testid="input-search-topics"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as Category | "All")}
              className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              data-testid="select-category-filter"
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value as Difficulty | "All")}
              className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              data-testid="select-difficulty-filter"
            >
              <option value="All">All Levels</option>
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-3.5 h-3.5" />
          Showing {filtered.length} of {topics.length} topics
          {completed.size > 0 && (
            <span className="ml-2 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {completed.size} completed
            </span>
          )}
        </div>

        {/* Grouped topics */}
        {grouped.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No topics match your filters.</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedDifficulty("All"); }}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {grouped.map(({ category, topics: catTopics }) => (
              <div key={category}>
                {category !== "Results" && (
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[category as Category]}`}>
                      {category}
                    </span>
                    <span className="text-sm text-muted-foreground">{catTopics.length} topic{catTopics.length !== 1 ? "s" : ""}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catTopics.map(topic => {
                    const done = isComplete(topic.slug);
                    const bookmarked = isBookmarked(topic.slug);
                    const prereqs = prerequisites[topic.slug] ?? [];
                    const locked = prereqs.length > 0 && !prereqs.every(p => completed.has(p));
                    return (
                      <div key={topic.slug} className="relative">
                        <Link href={`/topic/${topic.slug}`} data-testid={`card-topic-${topic.slug}`}>
                          <div className={`group h-full p-5 rounded-lg border bg-card hover:border-primary/30 transition-all duration-200 cursor-pointer ${
                            done ? "border-emerald-500/25 topic-completed" : locked ? "border-border/50 opacity-70" : "border-border"
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColors[topic.difficulty]}`}>
                                {topic.difficulty}
                              </span>
                              <div className="flex items-center gap-2">
                                {locked && <span title="Complete prerequisites first"><Lock className="w-3.5 h-3.5 text-muted-foreground/40" /></span>}
                                {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {topic.readTime} min
                                </span>
                              </div>
                            </div>
                            <h3 className={`font-semibold mb-2 group-hover:text-primary transition-colors ${done ? "text-muted-foreground" : ""}`}>
                              {topic.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{topic.description}</p>
                            {locked && prereqs.length > 0 && (
                              <p className="text-xs text-muted-foreground/50 mt-2">
                                Requires: {prereqs.slice(0, 2).map(p => topics.find(t => t.slug === p)?.title ?? p).join(", ")}
                                {prereqs.length > 2 ? ` +${prereqs.length - 2} more` : ""}
                              </p>
                            )}
                            {!done && !locked && (
                              <div className="flex items-center gap-1 text-primary text-xs font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                Read <ArrowRight className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </Link>
                        {/* Bookmark toggle button (outside Link to avoid navigation) */}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(topic.slug); }}
                          className={`absolute top-3 right-3 p-1 rounded transition-all ${
                            bookmarked ? "text-primary opacity-100" : "text-muted-foreground/30 opacity-0 group-hover:opacity-100 hover:text-primary"
                          }`}
                          title={bookmarked ? "Remove bookmark" : "Bookmark"}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
