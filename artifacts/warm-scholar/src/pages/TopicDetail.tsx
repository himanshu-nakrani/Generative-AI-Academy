import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { topics } from "@/data/topics";
import { getPrerequisites } from "@/data/prerequisites";
import { useApp } from "@/context/AppContext";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { usePrefs, fontSizePx, lineHeightVal } from "@/context/PrefsContext";
import { useHighlights } from "@/hooks/useHighlights";
import { CheckCircle2, ChevronLeft, ChevronRight, BookOpen, Video, FileText, Code2, Link as LinkIcon, Settings2 } from "lucide-react";

export default function TopicDetail({ params }: { params: { slug: string } }) {
  const [location, setLocation] = useLocation();
  const slug = params.slug;
  const topicIndex = topics.findIndex(t => t.slug === slug);
  const topic = topics[topicIndex];
  
  const { isComplete, toggleComplete, recordVisit } = useApp();
  const { fontSize, lineHeight, focusMode, wideColumn, setFontSize, setLineHeight, toggleFocusMode, toggleWideCol } = usePrefs();
  const { topicHighlights, add } = useHighlights(slug);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!topic) return;
    recordVisit(slug);
    
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
      
      const sections = document.querySelectorAll('section[id^="section-"]');
      let currentIdx = 0;
      sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          currentIdx = idx;
        }
      });
      setActiveSection(currentIdx);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [topic, slug, recordVisit]);

  useKeyboardNav({
    sections: topic?.sections || [],
    activeSection,
    prevSlug: topicIndex > 0 ? topics[topicIndex - 1].slug : null,
    nextSlug: topicIndex < topics.length - 1 ? topics[topicIndex + 1].slug : null,
    onToggleComplete: () => toggleComplete(slug),
    onToggleShortcuts: () => {},
  });

  if (!topic) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif mb-4">Topic not found</h1>
        <Link href="/topics" className="text-primary hover:underline">Return to Topics</Link>
      </div>
    );
  }

  const prerequisites = getPrerequisites(slug).map(s => topics.find(t => t.slug === s)).filter(Boolean);
  const related = topic.relatedSlugs.map(s => topics.find(t => t.slug === s)).filter(Boolean);
  const completed = isComplete(slug);

  return (
    <div className="relative pb-24">
      {/* Progress Bar */}
      <div className="reading-progress" style={{ width: `${scrollProgress}%` }}></div>

      {/* Prefs Toolbar */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Link href="/topics" className="hover:text-primary transition-colors">Topics</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{topic.title}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => toggleComplete(slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                completed ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {completed ? "Completed" : "Mark Complete"}
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="text-muted-foreground hover:text-foreground">
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="fixed top-32 right-6 z-50 ws-card p-4 shadow-lg w-64 space-y-4">
          <div>
            <div className="text-sm font-bold mb-2">Font Size</div>
            <div className="flex gap-2">
              {(["sm", "base", "lg"] as const).map(s => (
                <button key={s} onClick={() => setFontSize(s)} className={`flex-1 py-1 text-sm rounded border ${fontSize === s ? 'bg-primary/10 border-primary text-primary' : 'border-border'}`}>
                  {s === "sm" ? "A" : s === "base" ? "A" : "A+"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold mb-2">Line Height</div>
            <div className="flex gap-2">
              {(["compact", "normal", "relaxed"] as const).map(s => (
                <button key={s} onClick={() => setLineHeight(s)} className={`flex-1 py-1 text-sm rounded border ${lineHeight === s ? 'bg-primary/10 border-primary text-primary' : 'border-border'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`mx-auto px-6 py-12 transition-all ${wideColumn ? 'max-w-5xl' : 'max-w-3xl'}`}>
        
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="ws-badge">{topic.category}</div>
            <span className="text-sm text-muted-foreground font-medium">{topic.readTime} min read</span>
          </div>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6 leading-tight">{topic.title}</h1>
          <p className="text-xl text-[#6b4c2a] leading-relaxed">{topic.description}</p>
        </header>

        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <div className="ws-callout ws-callout-note mb-12">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-green-800">Prerequisites</h3>
            <p className="text-sm text-green-900 mb-2">For the best experience, you should understand these concepts first:</p>
            <div className="flex flex-wrap gap-2">
              {prerequisites.map(p => (
                <Link key={p?.slug} href={`/topic/${p?.slug}`} className="text-sm font-semibold bg-green-50 px-2 py-1 rounded border border-green-200 hover:border-green-400 transition-colors">
                  {p?.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article Body */}
        <article className="prose-content space-y-12" style={{ fontSize: fontSizePx[fontSize], lineHeight: lineHeightVal[lineHeight] }}>
          {topic.sections.map((section, idx) => (
            <section key={idx} id={`section-${idx}`} className="scroll-mt-32 relative group">
              <h2 className="ws-section-heading text-2xl font-bold mb-6">{section.title}</h2>
              <div className="whitespace-pre-wrap">{section.content}</div>
              
              {section.code && (
                <div className="mt-6">
                  <pre className="code-block">
                    <code>{section.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}
        </article>

        {/* Post-article Action */}
        <div className="mt-16 bg-secondary/30 p-8 rounded-xl border border-border text-center">
          <h3 className="text-2xl font-serif font-bold mb-4">Ready to test your knowledge?</h3>
          <p className="text-muted-foreground mb-6">Take a quick 5-question quiz to lock in what you've learned.</p>
          <Link href={`/quiz/${slug}`} className="inline-block px-8 py-3 bg-primary text-white font-bold rounded shadow hover:opacity-90 transition-opacity">
            Start Quiz
          </Link>
        </div>

        {/* References */}
        {topic.references && topic.references.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="ws-section-heading text-2xl font-bold mb-6">References & Further Reading</h2>
            <div className="space-y-4">
              {topic.references.map((ref, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="shrink-0 pt-1 text-primary">
                    {ref.type === 'paper' ? <FileText className="w-5 h-5" /> : 
                     ref.type === 'video' ? <Video className="w-5 h-5" /> :
                     ref.type === 'docs' ? <BookOpen className="w-5 h-5" /> :
                     <LinkIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{ref.title}</div>
                    <div className="text-sm text-muted-foreground">{ref.authors} ({ref.year}) {ref.venue && `· ${ref.venue}`}</div>
                    {ref.url && <a href={ref.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary mt-1 inline-block hover:underline">View Source →</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next */}
        <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
          {topicIndex > 0 ? (
            <Link href={`/topic/${topics[topicIndex - 1].slug}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <div>
                <div className="text-xs uppercase tracking-wider font-bold mb-1">Previous</div>
                <div className="font-serif font-bold text-foreground group-hover:text-primary">{topics[topicIndex - 1].title}</div>
              </div>
            </Link>
          ) : <div></div>}
          
          {topicIndex < topics.length - 1 ? (
            <Link href={`/topic/${topics[topicIndex + 1].slug}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group text-right">
              <div>
                <div className="text-xs uppercase tracking-wider font-bold mb-1">Next</div>
                <div className="font-serif font-bold text-foreground group-hover:text-primary">{topics[topicIndex + 1].title}</div>
              </div>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : <div></div>}
        </div>

      </div>
    </div>
  );
}
