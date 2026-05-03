const KEY = "genai-learn:srs";
const INTERVALS = [1, 3, 7, 14, 30]; // days between reviews

export interface SRSEntry {
  slug: string;
  lastReviewed: string; // YYYY-MM-DD
  intervalIdx: number;
  totalReviews: number;
}

function load(): Record<string, SRSEntry> {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}

function save(data: Record<string, SRSEntry>) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

function today(): string { return new Date().toISOString().split("T")[0]; }

function daysBetween(from: string, to: string): number {
  return Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 86400000);
}

export function recordTopicRead(slug: string) {
  const data = load();
  const existing = data[slug];
  data[slug] = {
    slug,
    lastReviewed: today(),
    intervalIdx: existing ? Math.min(existing.intervalIdx + 1, INTERVALS.length - 1) : 0,
    totalReviews: (existing?.totalReviews ?? 0) + 1,
  };
  save(data);
}

export function getDueReviews(completedSlugs: string[]): string[] {
  const data = load();
  const t = today();
  return completedSlugs.filter(slug => {
    const entry = data[slug];
    if (!entry) return false;
    const interval = INTERVALS[entry.intervalIdx];
    return daysBetween(entry.lastReviewed, t) >= interval;
  });
}

export function getReviewStatus(slug: string): {
  daysUntilDue: number;
  intervalDays: number;
  totalReviews: number;
} | null {
  const data = load();
  const entry = data[slug];
  if (!entry) return null;
  const interval = INTERVALS[entry.intervalIdx];
  const elapsed = daysBetween(entry.lastReviewed, today());
  return {
    daysUntilDue: Math.max(0, interval - elapsed),
    intervalDays: interval,
    totalReviews: entry.totalReviews,
  };
}
