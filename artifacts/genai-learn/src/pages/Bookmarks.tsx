import { Link } from "wouter";
import { Bookmark, BookOpen, Clock, ArrowRight, CheckCircle2, Trash2, BookMarked } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useApp } from "@/context/AppContext";
import { topics, categoryColors, difficultyColors } from "@/data/topics";

export default function Bookmarks() {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { isComplete } = useApp();

  const bookmarkedTopics = topics.filter(t => bookmarks.has(t.slug));

  if (bookmarks.size === 0) {
    return (
      <div className="min-h-screen py-20 px-5 sm:px-8 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <BookMarked className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">No bookmarks yet</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Save topics to your reading list by clicking the bookmark icon while reading. They'll appear here for quick access.
          </p>
          <Link href="/topics">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Browse Topics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const unread    = bookmarkedTopics.filter(t => !isComplete(t.slug));
  const completed = bookmarkedTopics.filter(t => isComplete(t.slug));

  return (
    <div className="min-h-screen py-12 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Reading List</p>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Bookmarks</h1>
          <p className="text-muted-foreground text-sm">
            {bookmarks.size} saved topic{bookmarks.size !== 1 ? "s" : ""}
            {unread.length > 0 && ` · ${unread.length} unread`}
          </p>
        </div>

        {/* Unread section */}
        {unread.length > 0 && (
          <section className="mb-8 fade-up-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              To Read ({unread.length})
            </h2>
            <div className="space-y-2">
              {unread.map(topic => (
                <div key={topic.slug} className="group flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[topic.category]}`}>
                        {topic.category}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[topic.difficulty]}`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <Link href={`/topic/${topic.slug}`}>
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors cursor-pointer mb-0.5">
                        {topic.title}
                      </p>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-1">{topic.description}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />{topic.readTime}m
                    </span>
                    <Link href={`/topic/${topic.slug}`}>
                      <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                        Read <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                    <button
                      onClick={() => toggleBookmark(topic.slug)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed section */}
        {completed.length > 0 && (
          <section className="mb-8 fade-up-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Completed ({completed.length})
            </h2>
            <div className="space-y-2">
              {completed.map(topic => (
                <div key={topic.slug} className="group flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors opacity-70 hover:opacity-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link href={`/topic/${topic.slug}`}>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                        {topic.title}
                      </p>
                    </Link>
                    <span className="text-xs text-muted-foreground">{topic.category} · {topic.readTime}m</span>
                  </div>
                  <button
                    onClick={() => toggleBookmark(topic.slug)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick stats */}
        <div className="mt-6 pt-6 border-t border-border flex items-center justify-between fade-up-3">
          <p className="text-xs text-muted-foreground">
            Total reading time saved: ~{bookmarkedTopics.reduce((s, t) => s + t.readTime, 0)} min
          </p>
          <Link href="/topics">
            <button className="text-xs text-primary hover:underline flex items-center gap-1">
              <BookOpen className="w-3 h-3" />Browse more
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
