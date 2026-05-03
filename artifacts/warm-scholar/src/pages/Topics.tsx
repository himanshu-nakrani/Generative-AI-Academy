import { useState, useMemo } from "react";
import { Link } from "wouter";
import Fuse from "fuse.js";
import { Search as SearchIcon, Filter, CheckCircle2 } from "lucide-react";
import { topics, type Category, type Difficulty } from "@/data/topics";
import { useApp } from "@/context/AppContext";

const CATEGORIES: Category[] = ["Foundations", "Core Models", "Techniques", "Applications", "Advanced Research"];
const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export default function Topics() {
  const { isComplete } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");
  const [diffFilter, setDiffFilter] = useState<Difficulty | "All">("All");

  const fuse = useMemo(() => new Fuse(topics, {
    keys: ["title", "description", "category"],
    threshold: 0.3
  }), []);

  const filteredTopics = useMemo(() => {
    let result = topics;
    
    if (search.trim()) {
      result = fuse.search(search).map(r => r.item);
    }
    
    if (categoryFilter !== "All") {
      result = result.filter(t => t.category === categoryFilter);
    }
    
    if (diffFilter !== "All") {
      result = result.filter(t => t.difficulty === diffFilter);
    }
    
    return result;
  }, [search, categoryFilter, diffFilter, fuse]);

  // Group by category if no search/filters are active
  const isGrouped = !search && categoryFilter === "All" && diffFilter === "All";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">All Topics</h1>
        <p className="text-lg text-muted-foreground">Browse the complete library of Generative AI concepts.</p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-secondary/30 p-4 rounded-xl border border-border mb-12 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-5 h-5 text-muted-foreground shrink-0 mr-2" />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value as Category | "All")}
            className="bg-white border border-border text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <select 
            value={diffFilter} 
            onChange={(e) => setDiffFilter(e.target.value as Difficulty | "All")}
            className="bg-white border border-border text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-xl">
          <p className="text-muted-foreground text-lg">No topics found matching your criteria.</p>
          <button 
            onClick={() => { setSearch(""); setCategoryFilter("All"); setDiffFilter("All"); }}
            className="mt-4 text-primary font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : isGrouped ? (
        <div className="space-y-16">
          {CATEGORIES.map(category => {
            const catTopics = topics.filter(t => t.category === category);
            if (catTopics.length === 0) return null;
            return (
              <section key={category}>
                <h2 className="ws-section-heading text-2xl font-bold mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catTopics.map(topic => (
                    <TopicCard key={topic.slug} topic={topic} completed={isComplete(topic.slug)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map(topic => (
            <TopicCard key={topic.slug} topic={topic} completed={isComplete(topic.slug)} />
          ))}
        </div>
      )}
    </div>
  );
}

function TopicCard({ topic, completed }: { topic: typeof topics[0], completed: boolean }) {
  return (
    <Link href={`/topic/${topic.slug}`} className="ws-card p-6 flex flex-col h-full relative overflow-hidden group">
      {completed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{topic.category}</span>
          <span className="w-1 h-1 rounded-full bg-border"></span>
          <span className="text-xs font-medium text-muted-foreground">{topic.readTime}m</span>
        </div>
        {completed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
      </div>
      <h3 className="font-serif font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{topic.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{topic.description}</p>
      
      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded font-medium border ${
          topic.difficulty === 'Beginner' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          topic.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-red-50 text-red-700 border-red-200'
        }`}>
          {topic.difficulty}
        </span>
        <span className="text-sm font-semibold text-primary">Read →</span>
      </div>
    </Link>
  );
}
