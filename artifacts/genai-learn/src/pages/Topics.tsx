import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Filter, Clock, ArrowRight } from "lucide-react";
import {
  topics,
  categories,
  difficulties,
  categoryColors,
  difficultyColors,
  type Category,
  type Difficulty,
} from "@/data/topics";

export default function Topics() {
  const [location] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");

  // Parse query params on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const cat = url.searchParams.get("category");
    if (cat && (categories as string[]).includes(cat)) {
      setSelectedCategory(cat as Category);
    }
  }, []);

  const filtered = useMemo(() => {
    return topics.filter(t => {
      const matchSearch = search === "" ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "All" || t.category === selectedCategory;
      const matchDiff = selectedDifficulty === "All" || t.difficulty === selectedDifficulty;
      return matchSearch && matchCat && matchDiff;
    });
  }, [search, selectedCategory, selectedDifficulty]);

  const grouped = useMemo(() => {
    if (selectedCategory !== "All") {
      return [{ category: selectedCategory, topics: filtered }];
    }
    return categories
      .map(cat => ({ category: cat, topics: filtered.filter(t => t.category === cat) }))
      .filter(g => g.topics.length > 0);
  }, [filtered, selectedCategory]);

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

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 sticky top-16 z-10 py-4 bg-background/80 backdrop-blur-xl -mx-4 px-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search topics..."
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
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[category as Category]}`}>
                    {category}
                  </span>
                  <span className="text-sm text-muted-foreground">{catTopics.length} topic{catTopics.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catTopics.map(topic => (
                    <Link key={topic.slug} href={`/topic/${topic.slug}`} data-testid={`card-topic-${topic.slug}`}>
                      <div className="group h-full p-5 rounded-2xl border border-border bg-card hover:border-primary/40 card-glow transition-all duration-200 cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColors[topic.difficulty]}`}>
                            {topic.difficulty}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {topic.readTime} min
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{topic.description}</p>
                        <div className="flex items-center gap-1 text-primary text-xs font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
