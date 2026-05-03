import { useState } from "react";
import { Link } from "wouter";
import { topics } from "@/data/topics";
import { useHighlights, type Highlight } from "@/hooks/useHighlights";
import { Search as SearchIcon, FileText, ExternalLink, Trash2 } from "lucide-react";

// Helper to get all highlights across all topics
function loadAllHighlights(): Highlight[] {
  try { const r = localStorage.getItem("genai-learn:highlights"); return r ? JSON.parse(r) : []; }
  catch { return []; }
}

export default function Notes() {
  const [allHighlights, setAllHighlights] = useState<Highlight[]>(loadAllHighlights());
  const [search, setSearch] = useState("");

  const removeHighlight = (id: string) => {
    const next = allHighlights.filter(h => h.id !== id);
    setAllHighlights(next);
    try { localStorage.setItem("genai-learn:highlights", JSON.stringify(next)); } catch {}
  };

  const filtered = allHighlights.filter(h => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return h.selectedText.toLowerCase().includes(q) || h.note.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Scholar's Notes</h1>
          <p className="text-lg text-muted-foreground">Your personal highlights and annotations.</p>
        </div>
        <div className="relative w-full md:w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded border border-border bg-white focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>

      {allHighlights.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-xl">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold font-serif mb-2">No notes yet</h2>
          <p className="text-muted-foreground">Select text while reading any topic to add a highlight or note.</p>
          <Link href="/topics" className="mt-4 text-primary font-semibold hover:underline inline-block">Start reading →</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No notes found matching "{search}"</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map(h => {
            const topic = topics.find(t => t.slug === h.slug);
            const dateStr = new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            
            return (
              <div key={h.id} className="ws-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <Link href={`/topic/${h.slug}`} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                    <BookIcon className="w-4 h-4" />
                    {topic?.title || h.slug}
                  </Link>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{dateStr}</span>
                    <button onClick={() => removeHighlight(h.id)} className="text-muted-foreground hover:text-red-500 transition-colors" aria-label="Delete note">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div 
                  className="pl-4 py-1 mb-4 border-l-4" 
                  style={{ borderLeftColor: h.color, backgroundColor: `${h.color}15` }}
                >
                  <p className="text-foreground font-serif italic text-lg leading-relaxed">"{h.selectedText}"</p>
                </div>
                
                {h.note && (
                  <div className="bg-secondary/50 p-4 rounded text-[#4a3520] text-sm leading-relaxed">
                    {h.note}
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <Link href={`/topic/${h.slug}`} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                    Go to source <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BookIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
