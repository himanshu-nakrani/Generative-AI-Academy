import { useState } from "react";
import { Link } from "wouter";
import { Highlighter, Trash2, Edit3, Check, BookOpen, ArrowRight } from "lucide-react";
import { topics } from "@/data/topics";
import { useHighlights, HIGHLIGHT_COLORS, type Highlight } from "@/hooks/useHighlights";

function NoteCard({ h, onDelete, onUpdateNote }: {
  h: Highlight;
  onDelete: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(h.note);
  const color = HIGHLIGHT_COLORS.find(c => c.id === h.color) ?? HIGHLIGHT_COLORS[0];
  const topic = topics.find(t => t.slug === h.slug);
  const date  = new Date(h.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  const save = () => {
    onUpdateNote(h.id, draft);
    setEditing(false);
  };

  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      {/* Highlight text */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-1 flex-shrink-0 self-stretch rounded-full" style={{ background: color.border }} />
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed" style={{ background: color.bg + "80" }}>
            "{h.selectedText}"
          </p>
        </div>
      </div>

      {/* Note */}
      {editing ? (
        <div className="mb-3">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="w-full text-sm rounded border border-border bg-background px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            rows={3}
            placeholder="Add a note…"
            autoFocus
          />
          <div className="flex gap-2 mt-1.5">
            <button onClick={save} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              <Check className="w-3 h-3" />Save
            </button>
            <button onClick={() => setEditing(false)} className="text-xs px-2.5 py-1 rounded border border-border hover:bg-muted transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : h.note ? (
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 pl-4 italic">
          {h.note}
        </p>
      ) : null}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground/60">{date}</span>
          {topic && (
            <Link href={`/topic/${topic.slug}`}>
              <span className="text-xs text-primary hover:underline flex items-center gap-0.5">
                {topic.title} <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => { setDraft(h.note); setEditing(true); }}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Edit3 className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(h.id)}
            className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Notes() {
  const { allHighlights, remove, updateNote } = useHighlights("");

  if (allHighlights.length === 0) {
    return (
      <div className="min-h-screen py-20 px-5 sm:px-8 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <Highlighter className="w-6 h-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">No highlights yet</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-7">
            Select any text while reading an article to highlight it and add notes.
          </p>
          <Link href="/topics">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              <BookOpen className="w-4 h-4" />Start Reading
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Group by topic slug
  const grouped: Record<string, Highlight[]> = {};
  for (const h of allHighlights) {
    if (!grouped[h.slug]) grouped[h.slug] = [];
    grouped[h.slug].push(h);
  }

  const topicOrder = Object.keys(grouped).sort((a, b) => {
    const la = grouped[a][0].timestamp, lb = grouped[b][0].timestamp;
    return lb - la;
  });

  return (
    <div className="min-h-screen py-12 px-5 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Library</p>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Highlights & Notes</h1>
          <p className="text-sm text-muted-foreground">
            {allHighlights.length} highlight{allHighlights.length !== 1 ? "s" : ""} across {topicOrder.length} topic{topicOrder.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-8">
          {topicOrder.map(slug => {
            const topic = topics.find(t => t.slug === slug);
            const hs = grouped[slug];
            return (
              <div key={slug} className="fade-up">
                <div className="flex items-center justify-between mb-3">
                  <Link href={`/topic/${slug}`}>
                    <h2 className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1.5">
                      {topic?.title ?? slug}
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </h2>
                  </Link>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {hs.length} highlight{hs.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-2">
                  {hs.map(h => (
                    <NoteCard key={h.id} h={h} onDelete={remove} onUpdateNote={updateNote} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
