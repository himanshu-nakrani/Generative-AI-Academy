import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, ArrowRight, Clock, BookOpen, ChevronRight,
  Copy, Check, ExternalLink, FileText, Globe, MessageSquare, Video, BookMarked
} from "lucide-react";
import { getTopicBySlug, topics, categoryColors, difficultyColors, type Reference } from "@/data/topics";

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
    <div className="mt-5 rounded-md overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded hover:bg-muted"
        >
          {copied
            ? <><Check className="w-3 h-3 text-green-400" />Copied</>
            : <><Copy className="w-3 h-3" />Copy</>}
        </button>
      </div>
      <pre className="code-block rounded-none border-none overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function RefTypeIcon({ type }: { type: Reference["type"] }) {
  const cls = "w-3 h-3 flex-shrink-0";
  if (type === "paper")  return <FileText   className={cls} />;
  if (type === "blog")   return <Globe      className={cls} />;
  if (type === "tweet")  return <MessageSquare className={cls} />;
  if (type === "video")  return <Video      className={cls} />;
  if (type === "docs")   return <BookMarked className={cls} />;
  return <Globe className={cls} />;
}

function ReferenceList({ refs }: { refs: Reference[] }) {
  return (
    <div className="mt-14 pt-8 border-t border-border">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">
        References &amp; Further Reading
      </h2>
      <ol className="space-y-3">
        {refs.map((ref, i) => (
          <li key={i} className="flex gap-3 group">
            <span className="text-xs font-mono text-muted-foreground/50 mt-0.5 w-5 flex-shrink-0 tabular-nums">[{i + 1}]</span>
            <div className="min-w-0">
              {ref.url ? (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 group/link"
                >
                  <span className="text-sm text-foreground group-hover/link:text-primary transition-colors leading-snug">
                    {ref.title}
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0 group-hover/link:text-primary transition-colors" />
                </a>
              ) : (
                <span className="text-sm text-foreground leading-snug">{ref.title}</span>
              )}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <RefTypeIcon type={ref.type} />
                  <span className="text-xs">{ref.authors}</span>
                </span>
                {ref.year && <span className="text-xs text-muted-foreground/60">{ref.year}</span>}
                {ref.venue && (
                  <span className="text-xs px-1.5 py-0 rounded border border-border text-muted-foreground/70 font-mono">
                    {ref.venue}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ContentParagraph({ text }: { text: string }) {
  const isNumberedList = /^\d+\./.test(text.trim());
  const isBulletList   = /^[-•]/.test(text.trim());

  if (isNumberedList || isBulletList) {
    const lines = text.split("\n").filter(Boolean);
    return (
      <ul className="space-y-2 my-1">
        {lines.map((line, k) => (
          <li key={k} className="flex gap-2.5">
            <span className="text-primary/50 flex-shrink-0 mt-0.5 text-sm font-mono">
              {isNumberedList ? `${k + 1}.` : "–"}
            </span>
            <span className="text-[0.9375rem] text-muted-foreground leading-relaxed">
              {line.replace(/^\d+\.\s*/, "").replace(/^[-•]\s*/, "")}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  // Bold inline text support: **word**
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <p className="text-[0.9375rem] text-muted-foreground leading-[1.85]">
      {parts.map((part, j) =>
        j % 2 === 1
          ? <strong key={j} className="text-foreground font-medium">{part}</strong>
          : part
      )}
    </p>
  );
}

export default function TopicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-xs font-mono text-muted-foreground mb-3">404</p>
          <h1 className="text-xl font-semibold mb-3">Topic not found</h1>
          <p className="text-sm text-muted-foreground mb-6">No topic with slug "{slug}"</p>
          <Link href="/topics" className="text-sm text-primary hover:underline">← Back to Topics</Link>
        </div>
      </div>
    );
  }

  const topicIndex  = topics.findIndex(t => t.slug === slug);
  const prevTopic   = topicIndex > 0 ? topics[topicIndex - 1] : null;
  const nextTopic   = topicIndex < topics.length - 1 ? topics[topicIndex + 1] : null;
  const relatedTopics = topic.relatedSlugs
    .map(s => topics.find(t => t.slug === s))
    .filter(Boolean) as typeof topics;

  const codeCount = topic.sections.filter(s => s.code).length;

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen py-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 fade-up">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/topics" className="hover:text-foreground transition-colors">Topics</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{topic.title}</span>
          </nav>

          <div className="flex gap-10 xl:gap-14">

            {/* ── Main Content ──────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Header */}
              <header className="mb-8 fade-up-1">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[topic.category]}`}>
                    {topic.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[topic.difficulty]}`}>
                    {topic.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {topic.readTime} min read
                  </span>
                  {topic.references && topic.references.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3" />
                      {topic.references.length} source{topic.references.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">{topic.title}</h1>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{topic.description}</p>
              </header>

              {/* Table of Contents */}
              <div className="mb-10 p-4 rounded-md border border-border bg-card/50 fade-up-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  <BookOpen className="w-3.5 h-3.5" />
                  Contents
                </p>
                <ol className="space-y-1.5">
                  {topic.sections.map((section, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors group py-0.5"
                      >
                        <span className="text-xs font-mono text-muted-foreground/40 w-4 text-right tabular-nums">{i + 1}</span>
                        <span className="group-hover:text-foreground transition-colors">{section.title}</span>
                        {section.code && (
                          <span className="ml-auto text-xs font-mono text-muted-foreground/40">code</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {topic.sections.map((section, i) => (
                  <div key={i} id={`section-${i}`} className="scroll-mt-20 fade-up">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-xs font-mono text-muted-foreground/40 tabular-nums pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="text-xl font-semibold">{section.title}</h2>
                    </div>
                    <div className="pl-8 space-y-4">
                      {section.content.split("\n\n").map((para, j) => (
                        <ContentParagraph key={j} text={para} />
                      ))}
                      {section.code && <CodeBlock code={section.code} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* References */}
              {topic.references && topic.references.length > 0 && (
                <ReferenceList refs={topic.references} />
              )}

              {/* Prev / Next Nav */}
              <div className="mt-12 pt-8 border-t border-border grid grid-cols-2 gap-4">
                {prevTopic ? (
                  <Link href={`/topic/${prevTopic.slug}`}>
                    <div className="group p-4 rounded-md border border-border bg-card hover:border-primary/30 transition-colors h-full">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <ArrowLeft className="w-3 h-3" /> Previous
                      </div>
                      <div className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {prevTopic.title}
                      </div>
                    </div>
                  </Link>
                ) : <div />}
                {nextTopic ? (
                  <Link href={`/topic/${nextTopic.slug}`}>
                    <div className="group p-4 rounded-md border border-border bg-card hover:border-primary/30 transition-colors h-full text-right">
                      <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground mb-1">
                        Next <ArrowRight className="w-3 h-3" />
                      </div>
                      <div className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {nextTopic.title}
                      </div>
                    </div>
                  </Link>
                ) : <div />}
              </div>
            </div>

            {/* ── Sidebar ───────────────────────────────────── */}
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
              <div className="sticky top-20 space-y-5">

                {/* Article meta */}
                <div className="p-4 rounded-md border border-border bg-card">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    This Article
                  </p>
                  <dl className="space-y-2">
                    {[
                      { label: "Sections", val: topic.sections.length },
                      { label: "Read time", val: `${topic.readTime} min` },
                      { label: "Code examples", val: codeCount },
                      ...(topic.references ? [{ label: "Sources", val: topic.references.length }] : []),
                    ].map(({ label, val }) => (
                      <div key={label} className="flex justify-between">
                        <dt className="text-xs text-muted-foreground">{label}</dt>
                        <dd className="text-xs font-medium tabular-nums">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Key Papers from references */}
                {topic.references && topic.references.filter(r => r.type === "paper").length > 0 && (
                  <div className="p-4 rounded-md border border-border bg-card">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Key Papers
                    </p>
                    <div className="space-y-3">
                      {topic.references.filter(r => r.type === "paper").map((ref, i) => (
                        <div key={i}>
                          {ref.url ? (
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group"
                            >
                              <p className="text-xs text-foreground group-hover:text-primary transition-colors leading-snug mb-0.5">
                                {ref.title}
                              </p>
                              <p className="text-xs text-muted-foreground/60 leading-snug">
                                {ref.authors.split(",")[0].trim()}{ref.authors.includes(",") ? " et al." : ""} · {ref.year}
                                {ref.venue && <span className="ml-1 font-mono">· {ref.venue}</span>}
                              </p>
                            </a>
                          ) : (
                            <div>
                              <p className="text-xs text-foreground leading-snug mb-0.5">{ref.title}</p>
                              <p className="text-xs text-muted-foreground/60 leading-snug">
                                {ref.authors.split(",")[0].trim()}{ref.authors.includes(",") ? " et al." : ""} · {ref.year}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Topics */}
                {relatedTopics.length > 0 && (
                  <div className="p-4 rounded-md border border-border bg-card">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Related Topics
                    </p>
                    <div className="space-y-1">
                      {relatedTopics.map(rel => (
                        <Link key={rel.slug} href={`/topic/${rel.slug}`}>
                          <div className="group flex items-center justify-between gap-2 py-1.5 px-2 rounded hover:bg-muted transition-colors cursor-pointer">
                            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-snug line-clamp-1">
                              {rel.title}
                            </span>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className="text-xs text-muted-foreground/50 tabular-nums">{rel.readTime}m</span>
                              <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nav links */}
                <div className="p-4 rounded-md border border-border bg-card">
                  <div className="space-y-1">
                    <Link href="/topics" className="flex items-center gap-2 py-1.5 px-2 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <BookOpen className="w-3.5 h-3.5" /> All Topics
                    </Link>
                    <Link href="/learning-paths" className="flex items-center gap-2 py-1.5 px-2 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" /> Learning Paths
                    </Link>
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
