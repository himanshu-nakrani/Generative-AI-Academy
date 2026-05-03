import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { useApp } from "@/context/AppContext";
import { topics, learningPaths } from "@/data/topics";

const ACHIEVEMENTS_KEY = "genai-learn:achievements";

export type AchievementRarity = "common" | "uncommon" | "rare" | "legendary";
export type AchievementCategory = "learning" | "streak" | "quiz" | "exploration";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  rarity: AchievementRarity;
  icon: string;
  category: AchievementCategory;
}

export interface AchievementState extends AchievementDef {
  earned: boolean;
  earnedAt?: string;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // Learning
  { id: "first_read",        title: "First Step",             description: "Complete your first topic",                     rarity: "common",    icon: "BookOpen",      category: "learning"     },
  { id: "five_complete",     title: "Getting Started",        description: "Complete 5 topics",                             rarity: "common",    icon: "Layers",        category: "learning"     },
  { id: "ten_complete",      title: "Deep Diver",             description: "Complete 10 topics",                            rarity: "uncommon",  icon: "TrendingUp",    category: "learning"     },
  { id: "twenty_complete",   title: "Halfway There",          description: "Complete 20 topics",                            rarity: "rare",      icon: "Zap",           category: "learning"     },
  { id: "all_complete",      title: "GenAI Master",           description: "Complete all 40 topics",                        rarity: "legendary", icon: "Trophy",        category: "learning"     },
  { id: "foundations_done",  title: "Foundations Expert",     description: "Complete all Foundations topics",               rarity: "uncommon",  icon: "Cpu",           category: "learning"     },
  { id: "core_models_done",  title: "Model Whisperer",        description: "Complete all Core Models topics",               rarity: "uncommon",  icon: "Brain",         category: "learning"     },
  { id: "techniques_done",   title: "Technique Expert",       description: "Complete all Techniques topics",                rarity: "rare",      icon: "Wrench",        category: "learning"     },
  { id: "applications_done", title: "Applied Practitioner",   description: "Complete all Applications topics",              rarity: "rare",      icon: "FlaskConical",  category: "learning"     },
  { id: "advanced_done",     title: "Research Grade",         description: "Complete all Advanced Research topics",         rarity: "rare",      icon: "Microscope",    category: "learning"     },
  { id: "beginner_path",     title: "Beginner Graduate",      description: "Complete the Beginner learning path",           rarity: "uncommon",  icon: "GraduationCap", category: "learning"     },
  { id: "intermediate_path", title: "Intermediate Graduate",  description: "Complete the Intermediate learning path",       rarity: "rare",      icon: "GraduationCap", category: "learning"     },
  { id: "advanced_path",     title: "Advanced Graduate",      description: "Complete the Advanced learning path",           rarity: "legendary", icon: "GraduationCap", category: "learning"     },
  // Streaks
  { id: "first_streak",      title: "On a Roll",              description: "Reach a 3-day learning streak",                 rarity: "common",    icon: "Flame",         category: "streak"       },
  { id: "week_warrior",      title: "Week Warrior",           description: "Maintain a 7-day streak",                       rarity: "uncommon",  icon: "Flame",         category: "streak"       },
  { id: "month_master",      title: "Month Master",           description: "Maintain a 30-day streak",                      rarity: "legendary", icon: "Gem",           category: "streak"       },
  // Quizzes
  { id: "first_quiz",        title: "Quiz Taker",             description: "Complete your first quiz",                      rarity: "common",    icon: "HelpCircle",    category: "quiz"         },
  { id: "perfect_quiz",      title: "Perfect Score",          description: "Get 100% on any quiz",                          rarity: "uncommon",  icon: "CheckCircle2",  category: "quiz"         },
  { id: "five_quizzes",      title: "Quiz Champion",          description: "Complete 5 quizzes",                            rarity: "uncommon",  icon: "Award",         category: "quiz"         },
  { id: "ten_quizzes",       title: "Trivia Legend",          description: "Complete 10 quizzes",                           rarity: "rare",      icon: "Crown",         category: "quiz"         },
  // Exploration
  { id: "first_bookmark",    title: "Collector",              description: "Save your first bookmark",                      rarity: "common",    icon: "Bookmark",      category: "exploration"  },
  { id: "ten_bookmarks",     title: "Curator",                description: "Bookmark 10 topics",                            rarity: "uncommon",  icon: "Archive",       category: "exploration"  },
  { id: "first_highlight",   title: "Annotator",              description: "Create your first highlight",                   rarity: "common",    icon: "Highlighter",   category: "exploration"  },
  { id: "ten_highlights",    title: "Scholar",                description: "Create 10 highlights",                          rarity: "uncommon",  icon: "PenLine",       category: "exploration"  },
];

type EarnedRecord = Record<string, string>; // id → ISO timestamp

function loadEarned(): EarnedRecord {
  try { const r = localStorage.getItem(ACHIEVEMENTS_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function saveEarned(r: EarnedRecord) {
  try { localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(r)); } catch {}
}

function getQuizStats(): { quizCount: number; perfectQuizCount: number } {
  try {
    const raw = localStorage.getItem("genai-learn:quiz-scores");
    if (!raw) return { quizCount: 0, perfectQuizCount: 0 };
    const data = JSON.parse(raw) as Record<string, { score: number; total: number }>;
    const entries = Object.values(data);
    return {
      quizCount: entries.length,
      perfectQuizCount: entries.filter(e => e.score === e.total && e.total > 0).length,
    };
  } catch { return { quizCount: 0, perfectQuizCount: 0 }; }
}

function getHighlightCount(): number {
  try {
    const raw = localStorage.getItem("genai-learn:highlights");
    if (!raw) return 0;
    return (JSON.parse(raw) as unknown[]).length;
  } catch { return 0; }
}

function getBookmarkCount(): number {
  try {
    const raw = localStorage.getItem("genai-learn:bookmarks");
    if (!raw) return 0;
    return (JSON.parse(raw) as unknown[]).length;
  } catch { return 0; }
}

type Category = "Foundations" | "Core Models" | "Techniques" | "Applications" | "Advanced Research";

function computeShouldBeUnlocked(
  completed: Set<string>,
  streak: number,
  quizCount: number,
  perfectQuizCount: number,
  bookmarkCount: number,
  highlightCount: number,
): Set<string> {
  const count = completed.size;
  const unlocked = new Set<string>();

  if (count >= 1)  unlocked.add("first_read");
  if (count >= 5)  unlocked.add("five_complete");
  if (count >= 10) unlocked.add("ten_complete");
  if (count >= 20) unlocked.add("twenty_complete");
  if (count >= 40) unlocked.add("all_complete");

  const cats: Array<[Category, string]> = [
    ["Foundations",       "foundations_done"],
    ["Core Models",       "core_models_done"],
    ["Techniques",        "techniques_done"],
    ["Applications",      "applications_done"],
    ["Advanced Research", "advanced_done"],
  ];
  for (const [cat, id] of cats) {
    const catTopics = topics.filter(t => t.category === cat);
    if (catTopics.length > 0 && catTopics.every(t => completed.has(t.slug))) {
      unlocked.add(id);
    }
  }

  const paths: Array<[string, string]> = [
    ["beginner",     "beginner_path"],
    ["intermediate", "intermediate_path"],
    ["advanced",     "advanced_path"],
  ];
  for (const [pathKey, id] of paths) {
    const path = (learningPaths as Record<string, { slugs: string[] }>)[pathKey];
    if (path && path.slugs.every((s: string) => completed.has(s))) {
      unlocked.add(id);
    }
  }

  if (streak >= 3)  unlocked.add("first_streak");
  if (streak >= 7)  unlocked.add("week_warrior");
  if (streak >= 30) unlocked.add("month_master");

  if (quizCount >= 1)        unlocked.add("first_quiz");
  if (quizCount >= 5)        unlocked.add("five_quizzes");
  if (quizCount >= 10)       unlocked.add("ten_quizzes");
  if (perfectQuizCount >= 1) unlocked.add("perfect_quiz");

  if (bookmarkCount >= 1)  unlocked.add("first_bookmark");
  if (bookmarkCount >= 10) unlocked.add("ten_bookmarks");

  if (highlightCount >= 1)  unlocked.add("first_highlight");
  if (highlightCount >= 10) unlocked.add("ten_highlights");

  return unlocked;
}

interface AchievementsContextType {
  achievements: AchievementState[];
  earnedCount: number;
  totalCount: number;
  newlyEarned: AchievementDef[];
  dismissNew: (id: string) => void;
  recheckAchievements: () => void;
}

const AchievementsContext = createContext<AchievementsContextType | null>(null);

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const { completed, streak } = useApp();
  const [earned, setEarned] = useState<EarnedRecord>(loadEarned);
  const [newlyEarned, setNewlyEarned] = useState<AchievementDef[]>([]);
  const earnedRef = useRef(earned);

  const runCheck = useCallback(() => {
    const { quizCount, perfectQuizCount } = getQuizStats();
    const highlightCount = getHighlightCount();
    const bookmarkCount  = getBookmarkCount();

    const shouldBeUnlocked = computeShouldBeUnlocked(
      completed, streak, quizCount, perfectQuizCount, bookmarkCount, highlightCount
    );

    const current = earnedRef.current;
    const newOnes: AchievementDef[] = [];
    const now = new Date().toISOString();

    for (const id of shouldBeUnlocked) {
      if (!current[id]) {
        const def = ACHIEVEMENT_DEFS.find(a => a.id === id);
        if (def) newOnes.push(def);
      }
    }

    if (newOnes.length > 0) {
      const updated = { ...current };
      for (const a of newOnes) updated[a.id] = now;
      earnedRef.current = updated;
      setEarned(updated);
      saveEarned(updated);
      setNewlyEarned(prev => [...prev, ...newOnes]);
    }
  }, [completed, streak]);

  useEffect(() => { runCheck(); }, [runCheck]);

  const dismissNew = useCallback((id: string) => {
    setNewlyEarned(prev => prev.filter(a => a.id !== id));
  }, []);

  const achievements: AchievementState[] = ACHIEVEMENT_DEFS.map(def => ({
    ...def,
    earned: !!earned[def.id],
    earnedAt: earned[def.id],
  }));

  return (
    <AchievementsContext.Provider value={{
      achievements,
      earnedCount: Object.keys(earned).length,
      totalCount: ACHIEVEMENT_DEFS.length,
      newlyEarned,
      dismissNew,
      recheckAchievements: runCheck,
    }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext);
  if (!ctx) throw new Error("useAchievements must be within AchievementsProvider");
  return ctx;
}
