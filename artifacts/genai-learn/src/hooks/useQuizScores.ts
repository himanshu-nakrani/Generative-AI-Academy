import { useState, useCallback } from "react";

const SCORES_KEY  = "genai-learn:quiz-scores";
const DAILY_KEY   = "genai-learn:daily-challenge";

export interface QuizScore {
  score:  number;
  total:  number;
  date:   number; // timestamp
}

export interface DailyRecord {
  dateKey:  string;
  selected: number;
  correct:  boolean;
}

type ScoreMap = Record<string, QuizScore>;

function loadScores(): ScoreMap {
  try { return JSON.parse(localStorage.getItem(SCORES_KEY) ?? "{}"); } catch { return {}; }
}
function saveScores(m: ScoreMap) {
  try { localStorage.setItem(SCORES_KEY, JSON.stringify(m)); } catch {}
}

export function useQuizScores() {
  const [scores, setScores] = useState<ScoreMap>(loadScores);

  const saveScore = useCallback((slug: string, score: QuizScore) => {
    const next = { ...scores, [slug]: score };
    setScores(next);
    saveScores(next);
  }, [scores]);

  const getScore  = useCallback((slug: string) => scores[slug] ?? null, [scores]);
  const totalDone = Object.keys(scores).length;
  const avgScore  = totalDone === 0 ? 0 :
    Math.round(Object.values(scores).reduce((s, r) => s + r.score / r.total, 0) / totalDone * 100);

  return { scores, getScore, saveScore, totalDone, avgScore };
}

export function loadDailyRecord(): DailyRecord | null {
  try { return JSON.parse(localStorage.getItem(DAILY_KEY) ?? "null"); } catch { return null; }
}
export function saveDailyRecord(r: DailyRecord) {
  try { localStorage.setItem(DAILY_KEY, JSON.stringify(r)); } catch {}
}
