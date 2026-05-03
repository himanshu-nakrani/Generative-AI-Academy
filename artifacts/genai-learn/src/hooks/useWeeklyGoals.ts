import { useState, useEffect } from "react";

const GOALS_KEY = "genai-learn:weekly-goals";

export interface WeeklyGoals {
  topicsPerWeek: number;
  minutesPerDay: number;
}

const DEFAULT_GOALS: WeeklyGoals = {
  topicsPerWeek: 5,
  minutesPerDay: 30,
};

export function useWeeklyGoals() {
  const [goals, setGoals] = useState<WeeklyGoals>(DEFAULT_GOALS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GOALS_KEY);
      if (stored) {
        setGoals(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const saveGoals = (newGoals: WeeklyGoals) => {
    setGoals(newGoals);
    localStorage.setItem(GOALS_KEY, JSON.stringify(newGoals));
  };

  // Get start of current week (Sunday)
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  return { goals, saveGoals, weekStart };
}
