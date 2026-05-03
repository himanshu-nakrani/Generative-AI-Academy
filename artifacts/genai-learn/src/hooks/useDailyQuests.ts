import { useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { addQuestBonusXP } from "@/hooks/useXP";

const LS_KEY = "genai-learn:daily-quests";

type QuestType = "visit" | "complete" | "quiz_any" | "quiz_score" | "quiz_perfect" | "streak" | "categories";

interface QuestTemplate {
  id:     string;
  title:  string;
  desc:   string;
  type:   QuestType;
  target: number;
  xp:     number;
  emoji:  string;
}

const QUEST_POOL: QuestTemplate[] = [
  { id: "visit_3",      title: "Explorer",         desc: "Visit 3 different topics today",             type: "visit",        target: 3,  xp: 20, emoji: "🗺️" },
  { id: "visit_5",      title: "Deep Diver",        desc: "Visit 5 different topics today",             type: "visit",        target: 5,  xp: 35, emoji: "🤿" },
  { id: "complete_1",   title: "Make Progress",     desc: "Complete 1 new topic today",                 type: "complete",     target: 1,  xp: 30, emoji: "✅" },
  { id: "complete_2",   title: "Double Up",         desc: "Complete 2 new topics today",                type: "complete",     target: 2,  xp: 50, emoji: "⚡" },
  { id: "quiz_any",     title: "Quiz Time",         desc: "Complete any quiz today",                    type: "quiz_any",     target: 1,  xp: 20, emoji: "📝" },
  { id: "quiz_80",      title: "High Scorer",       desc: "Score 80%+ on any quiz today",               type: "quiz_score",   target: 80, xp: 40, emoji: "🎯" },
  { id: "quiz_perfect", title: "Perfectionist",     desc: "Score 100% on any quiz today",               type: "quiz_perfect", target: 1,  xp: 60, emoji: "💯" },
  { id: "streak",       title: "Stay Consistent",   desc: "Keep your learning streak alive",            type: "streak",       target: 1,  xp: 15, emoji: "🔥" },
  { id: "categories_2", title: "Category Hopper",   desc: "Visit topics from 2 different categories",   type: "categories",   target: 2,  xp: 25, emoji: "🧩" },
  { id: "categories_3", title: "Generalist",        desc: "Visit topics from 3 different categories",   type: "categories",   target: 3,  xp: 40, emoji: "🌐" },
];

function hashDate(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return Math.abs(h);
}

function todayStr(): string { return new Date().toISOString().split("T")[0]; }

interface DailyRecord {
  date:           string;
  selectedIds:    string[];              // which 3 quest IDs are active today
  visitedSlugs:   string[];
  visitedCats:    string[];
  quizDoneToday:  string[];              // slugs
  highestQuizPct: number;
  hasPerfectQuiz: boolean;
  startCompleted: number;               // completedCount at quest generation time
  claimed:        Record<string, boolean>; // questId → claimed
}

export interface DailyQuest extends QuestTemplate {
  progress: number;
  done: boolean;
  claimed: boolean;
}

function loadRecord(): DailyRecord | null {
  try {
    const r = localStorage.getItem(LS_KEY);
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}

function saveRecord(r: DailyRecord) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(r)); } catch {}
}

function initRecord(completedCount: number): DailyRecord {
  const today = todayStr();
  const h     = hashDate(today);
  // pick 3 unique quests from pool using hash
  const pool  = [...QUEST_POOL];
  const selected: string[] = [];
  let seed = h;
  while (selected.length < 3 && pool.length > 0) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    const idx = Math.abs(seed) % pool.length;
    selected.push(pool[idx].id);
    pool.splice(idx, 1);
  }
  return { date: today, selectedIds: selected, visitedSlugs: [], visitedCats: [],
           quizDoneToday: [], highestQuizPct: 0, hasPerfectQuiz: false,
           startCompleted: completedCount, claimed: {} };
}

function computeProgress(q: QuestTemplate, rec: DailyRecord, completedCount: number, streak: number): number {
  switch (q.type) {
    case "visit":       return rec.visitedSlugs.length;
    case "complete":    return Math.max(0, completedCount - rec.startCompleted);
    case "quiz_any":    return rec.quizDoneToday.length;
    case "quiz_score":  return rec.highestQuizPct >= q.target ? 1 : 0;
    case "quiz_perfect":return rec.hasPerfectQuiz ? 1 : 0;
    case "streak":      return streak > 0 ? 1 : 0;
    case "categories":  return rec.visitedCats.length;
    default:            return 0;
  }
}

export function useDailyQuests() {
  const { completedCount, streak } = useApp();
  const [record, setRecord] = useState<DailyRecord>(() => {
    const today = todayStr();
    const stored = loadRecord();
    if (stored?.date === today) return stored;
    return initRecord(completedCount);
  });

  // Persist whenever record changes
  useEffect(() => { saveRecord(record); }, [record]);

  // Listen to app events for activity tracking
  useEffect(() => {
    const onVisit = (e: Event) => {
      const { slug, category } = (e as CustomEvent<{ slug: string; category: string }>).detail;
      setRecord(prev => {
        if (prev.date !== todayStr()) {
          return initRecord(completedCount);
        }
        const visitedSlugs = prev.visitedSlugs.includes(slug) ? prev.visitedSlugs : [...prev.visitedSlugs, slug];
        const visitedCats  = prev.visitedCats.includes(category) ? prev.visitedCats : [...prev.visitedCats, category];
        return { ...prev, visitedSlugs, visitedCats };
      });
    };
    const onQuiz = (e: Event) => {
      const { slug, score, total } = (e as CustomEvent<{ slug: string; score: number; total: number }>).detail;
      setRecord(prev => {
        if (prev.date !== todayStr()) return initRecord(completedCount);
        const pct           = total > 0 ? Math.round((score / total) * 100) : 0;
        const quizDoneToday = prev.quizDoneToday.includes(slug) ? prev.quizDoneToday : [...prev.quizDoneToday, slug];
        const highestQuizPct = Math.max(prev.highestQuizPct, pct);
        const hasPerfectQuiz = prev.hasPerfectQuiz || pct === 100;
        return { ...prev, quizDoneToday, highestQuizPct, hasPerfectQuiz };
      });
    };
    window.addEventListener("genai:topic-visit", onVisit);
    window.addEventListener("genai:quiz-complete", onQuiz);
    return () => {
      window.removeEventListener("genai:topic-visit", onVisit);
      window.removeEventListener("genai:quiz-complete", onQuiz);
    };
  }, [completedCount]);

  const quests: DailyQuest[] = record.selectedIds.map(id => {
    const tmpl = QUEST_POOL.find(q => q.id === id)!;
    const progress = computeProgress(tmpl, record, completedCount, streak);
    return { ...tmpl, progress, done: progress >= tmpl.target, claimed: !!record.claimed[id] };
  });

  const claimXP = useCallback((questId: string) => {
    const q = quests.find(q => q.id === questId);
    if (!q || !q.done || q.claimed) return;
    addQuestBonusXP(q.xp);
    setRecord(prev => ({ ...prev, claimed: { ...prev.claimed, [questId]: true } }));
  }, [quests]);

  const completedCount2 = quests.filter(q => q.done).length;
  const totalXP         = quests.filter(q => q.done && q.claimed).reduce((s, q) => s + q.xp, 0);
  const claimableXP     = quests.filter(q => q.done && !q.claimed).reduce((s, q) => s + q.xp, 0);

  return { quests, claimXP, completedQuests: completedCount2, totalXPEarned: totalXP, claimableXP };
}
