import { useApp } from "@/context/AppContext";
import { topics } from "@/data/topics";
import { useQuizScores } from "@/hooks/useQuizScores";
import { Link } from "wouter";
import { Flame, Award, BookOpen, BrainCircuit } from "lucide-react";

export default function Progress() {
  const { completed, streak, bestStreak, recentlyRead } = useApp();
  const { totalDone: quizDone, avgScore } = useQuizScores();

  const totalTopics = topics.length;
  const completedCount = completed.size;
  const progressPct = Math.round((completedCount / totalTopics) * 100);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  const recentTopics = recentlyRead
    .map(s => topics.find(t => t.slug === s))
    .filter(Boolean) as typeof topics;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Your Progress</h1>
        <p className="text-lg text-muted-foreground">Track your learning journey through the library.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        {/* Main Progress Ring */}
        <div className="ws-card p-8 md:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70" cy="70" r={radius}
                className="stroke-secondary fill-none"
                strokeWidth="12"
              />
              <circle
                cx="70" cy="70" r={radius}
                className="stroke-primary fill-none transition-all duration-1000"
                strokeWidth="12"
                strokeLinecap="round"
                style={{ strokeDasharray: circumference, strokeDashoffset }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-serif text-foreground">{progressPct}%</span>
            </div>
          </div>
          <h2 className="text-xl font-bold font-serif text-foreground mb-1">Overall Completion</h2>
          <p className="text-muted-foreground">{completedCount} of {totalTopics} topics read</p>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-8 grid grid-cols-2 gap-4">
          <div className="ws-card p-6 flex items-start gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold font-serif text-foreground mb-1">{streak}</div>
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Day Streak</div>
              <div className="text-xs text-[#6b4c2a] mt-1">Best: {bestStreak} days</div>
            </div>
          </div>
          
          <div className="ws-card p-6 flex items-start gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shrink-0">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold font-serif text-foreground mb-1">{quizDone}</div>
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quizzes Done</div>
              <div className="text-xs text-[#6b4c2a] mt-1">Avg Score: {avgScore}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Category Breakdown */}
        <div>
          <h2 className="ws-section-heading text-2xl font-bold mb-6">By Category</h2>
          <div className="space-y-6 bg-white p-6 rounded-xl border border-border">
            {["Foundations", "Core Models", "Techniques", "Applications", "Advanced Research"].map(cat => {
              const catTopics = topics.filter(t => t.category === cat);
              const catCompleted = catTopics.filter(t => completed.has(t.slug)).length;
              const pct = catTopics.length === 0 ? 0 : Math.round((catCompleted / catTopics.length) * 100);
              
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-foreground">{cat}</span>
                    <span className="text-muted-foreground">{catCompleted} / {catTopics.length}</span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recently Read */}
        <div>
          <h2 className="ws-section-heading text-2xl font-bold mb-6">Recently Read</h2>
          {recentTopics.length > 0 ? (
            <div className="space-y-3">
              {recentTopics.slice(0, 5).map(topic => (
                <Link key={topic.slug} href={`/topic/${topic.slug}`} className="ws-card p-4 flex items-center gap-4 hover:border-primary transition-colors">
                  <div className="p-2 bg-secondary rounded text-primary shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-foreground line-clamp-1">{topic.title}</div>
                    <div className="text-xs text-muted-foreground">{topic.category}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 ws-card">
              <p className="text-muted-foreground">No topics read yet.</p>
              <Link href="/topics" className="text-primary font-semibold text-sm mt-2 inline-block hover:underline">Start browsing →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
