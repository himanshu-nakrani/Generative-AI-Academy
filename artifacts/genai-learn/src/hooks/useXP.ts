import { useApp } from "@/context/AppContext";

export const XP_LEVELS = [
  { level: 1,  minXP: 0,    name: "Novice",       color: "text-zinc-400"   },
  { level: 2,  minXP: 50,   name: "Explorer",     color: "text-emerald-400" },
  { level: 3,  minXP: 150,  name: "Learner",      color: "text-cyan-400"   },
  { level: 4,  minXP: 300,  name: "Student",      color: "text-blue-400"   },
  { level: 5,  minXP: 500,  name: "Practitioner", color: "text-violet-400" },
  { level: 6,  minXP: 750,  name: "Expert",       color: "text-purple-400" },
  { level: 7,  minXP: 1050, name: "Scholar",      color: "text-pink-400"   },
  { level: 8,  minXP: 1400, name: "Master",       color: "text-rose-400"   },
  { level: 9,  minXP: 1800, name: "Professor",    color: "text-orange-400" },
  { level: 10, minXP: 2250, name: "GenAI Sage",   color: "text-amber-400"  },
];

function getQuizXP(): number {
  try {
    const raw = localStorage.getItem("genai-learn:quiz-scores");
    if (!raw) return 0;
    const scores = JSON.parse(raw) as Record<string, { score: number; total: number }>;
    return Object.values(scores).reduce((sum, s) => {
      const pct = s.total > 0 ? s.score / s.total : 0;
      return sum + (pct === 1.0 ? 25 : 5);
    }, 0);
  } catch { return 0; }
}

function getAchievementXP(): number {
  try {
    const raw = localStorage.getItem("genai-learn:achievements");
    if (!raw) return 0;
    return Object.keys(JSON.parse(raw)).length * 15;
  } catch { return 0; }
}

export function getQuestBonusXP(): number {
  try {
    const raw = localStorage.getItem("genai-learn:xp-bonus");
    if (!raw) return 0;
    return Number(JSON.parse(raw)) || 0;
  } catch { return 0; }
}

export function addQuestBonusXP(amount: number): void {
  try {
    const current = getQuestBonusXP();
    localStorage.setItem("genai-learn:xp-bonus", JSON.stringify(current + amount));
  } catch {}
}

export function useXP() {
  const { completedCount, streak } = useApp();

  const topicXP       = completedCount * 10;
  const quizXP        = getQuizXP();
  const achievementXP = getAchievementXP();
  const streakXP      = streak * 3;
  const questXP       = getQuestBonusXP();
  const totalXP       = topicXP + quizXP + achievementXP + streakXP + questXP;

  let currentLevel = XP_LEVELS[0];
  let nextLevel: (typeof XP_LEVELS)[0] | null = null;
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i].minXP) {
      currentLevel = XP_LEVELS[i];
      nextLevel    = XP_LEVELS[i + 1] ?? null;
      break;
    }
  }

  const xpIntoLevel   = totalXP - currentLevel.minXP;
  const xpForLevel    = nextLevel ? nextLevel.minXP - currentLevel.minXP : 1;
  const levelProgress = nextLevel ? Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100)) : 100;

  return {
    totalXP, level: currentLevel.level, levelName: currentLevel.name,
    levelColor: currentLevel.color,
    levelProgress, xpIntoLevel, xpForLevel,
    nextLevelName: nextLevel?.name ?? null,
    nextLevelXP: nextLevel?.minXP ?? null,
    breakdown: { topicXP, quizXP, achievementXP, streakXP, questXP },
  };
}
