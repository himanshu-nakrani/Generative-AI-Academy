import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Clock, BookOpen, ChevronRight, Copy, Check } from "lucide-react";
import { getTopicBySlug, topics, categoryColors, difficultyColors } from "@/data/topics";

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="reading-progress" style={{ width: `${progress}%` }} />;
}

function CodeBlock({ code, language = "python" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="mt-6 rounded-xl overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{language}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
        >
          {copied ? <><Check className="w-3 h-3 text-emerald-400" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
        </button>
      </div>
      <pre className="code-block rounded-none border-none text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function TopicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">Topic not found</h1>
          <p className="text-muted-foreground mb-6">The topic "{slug}" doesn't exist.</p>
          <Link href="/topics" className="text-primary hover:underline">Back to Topics</Link>
        </div>
      </div>
    );
  }

  const topicIndex = topics.findIndex(t => t.slug === slug);
  const prevTopic = topicIndex > 0 ? topics[topicIndex - 1] : null;
  const nextTopic = topicIndex < topics.length - 1 ? topics[topicIndex + 1] : null;
  const relatedTopics = topic.relatedSlugs
    .map(s => topics.find(t => t.slug === s))
    .filter(Boolean) as typeof topics;

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 fade-up">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/topics" className="hover:text-foreground transition-colors">Topics</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground">{topic.title}</span>
          </nav>

          <div className="flex gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="mb-10 fade-up-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[topic.category]}`}>
                    {topic.category}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColors[topic.difficulty]}`}>
                    {topic.difficulty}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-muted text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.readTime} min read
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">{topic.title}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">{topic.description}</p>
              </div>

              {/* Table of Contents */}
              <div className="mb-10 p-5 rounded-2xl border border-border bg-card fade-up-2">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  Contents
                </div>
                <ol className="space-y-2">
                  {topic.sections.map((section, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 font-mono group-hover:bg-primary/30 transition-colors">
                          {i + 1}
                        </span>
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Sections */}
              <div className="space-y-14">
                {topic.sections.map((section, i) => (
                  <div key={i} id={`section-${i}`} className="scroll-mt-20 fade-up">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-8 h-8 rounded-xl bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0 font-mono font-bold border border-primary/20">
                        {i + 1}
                      </span>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                    </div>
                    <div className="space-y-4 pl-11">
                      {section.content.split("\n\n").map((para, j) => {
                        const isNumberedList = /^\d+\./.test(para.trim());
                        const isBulletList = /^[-•]/.test(para.trim());
                        if (isNumberedList || isBulletList) {
                          const lines = para.split("\n").filter(Boolean);
                          return (
                            <ul key={j} className="space-y-2">
                              {lines.map((line, k) => (
                                <li key={k} className="text-muted-foreground leading-relaxed flex gap-2">
                                  <span className="text-primary/60 flex-shrink-0 mt-0.5">
                                    {isNumberedList ? `${k + 1}.` : "•"}
                                  </span>
                                  <span>{line.replace(/^\d+\.\s*/, "").replace(/^[-•]\s*/, "")}</span>
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={j} className="text-muted-foreground leading-relaxed">{para}</p>;
                      })}
                      {section.code && <CodeBlock code={section.code} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev / Next Nav */}
              <div className="mt-16 pt-8 border-t border-border grid grid-cols-2 gap-4">
                {prevTopic ? (
                  <Link href={`/topic/${prevTopic.slug}`}>
                    <div className="group p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all h-full hover:shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Previous
                      </div>
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">{prevTopic.title}</div>
                    </div>
                  </Link>
                ) : <div />}
                {nextTopic ? (
                  <Link href={`/topic/${nextTopic.slug}`}>
                    <div className="group p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all h-full text-right hover:shadow-sm">
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-1">
                        Next
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">{nextTopic.title}</div>
                    </div>
                  </Link>
                ) : <div />}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {relatedTopics.length > 0 && (
                  <div className="p-5 rounded-2xl border border-border bg-card">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Related Topics</h3>
                    <div className="space-y-2">
                      {relatedTopics.map(rel => (
                        <Link key={rel.slug} href={`/topic/${rel.slug}`}>
                          <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">{rel.title}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${difficultyColors[rel.difficulty]}`}>{rel.difficulty}</span>
                                <span className="text-xs text-muted-foreground">{rel.readTime}m</span>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-5 rounded-2xl border border-border bg-card">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Navigation</h3>
                  <div className="space-y-2">
                    <Link href="/topics" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50">
                      <BookOpen className="w-4 h-4" />
                      All Topics
                    </Link>
                    <Link href="/learning-paths" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50">
                      <ArrowRight className="w-4 h-4" />
                      Learning Paths
                    </Link>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="p-5 rounded-2xl border border-border bg-card">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">This Article</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{topic.sections.length} sections</span>
                      <span>{topic.readTime} min read</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent w-full opacity-30" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {topic.sections.filter(s => s.code).length} code example{topic.sections.filter(s => s.code).length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
