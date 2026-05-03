import { useMemo } from "react";
import { topics } from "@/data/topics";

export interface SearchResult {
  type: "topic" | "section" | "glossary";
  slug: string;
  title: string;
  preview: string;
  category?: string;
  difficulty?: string;
  sectionIndex?: number;
}

export function useSearch(query: string): SearchResult[] {
  return useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search topics + sections
    topics.forEach(topic => {
      // Topic match
      if (topic.title.toLowerCase().includes(q) || topic.description.toLowerCase().includes(q)) {
        results.push({
          type: "topic",
          slug: topic.slug,
          title: topic.title,
          preview: topic.description,
          category: topic.category,
          difficulty: topic.difficulty,
        });
      }

      // Section match
      topic.sections.forEach((section, idx) => {
        if (section.title.toLowerCase().includes(q)) {
          results.push({
            type: "section",
            slug: topic.slug,
            title: `${topic.title} — ${section.title}`,
            preview: section.content.substring(0, 120) + "...",
            category: topic.category,
            difficulty: topic.difficulty,
            sectionIndex: idx,
          });
        }
      });

      // Content match in section bodies
      topic.sections.forEach((section, idx) => {
        if (section.content.toLowerCase().includes(q)) {
          const start = Math.max(0, section.content.toLowerCase().indexOf(q) - 40);
          const end = Math.min(section.content.length, start + 150);
          const preview = "..." + section.content.substring(start, end) + "...";
          results.push({
            type: "section",
            slug: topic.slug,
            title: `${topic.title} — ${section.title}`,
            preview,
            category: topic.category,
            difficulty: topic.difficulty,
            sectionIndex: idx,
          });
        }
      });
    });

    // Deduplicate and sort by relevance (exact match > title match > content match)
    const seen = new Set<string>();
    const deduped = results.filter(r => {
      const key = `${r.slug}:${r.sectionIndex ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    deduped.sort((a, b) => {
      const aExact = a.title.toLowerCase() === q;
      const bExact = b.title.toLowerCase() === q;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aTitle = a.title.toLowerCase().includes(q);
      const bTitle = b.title.toLowerCase().includes(q);
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;

      return 0;
    });

    return deduped;
  }, [query]);
}

export interface FilterOptions {
  categories: Set<string>;
  difficulties: Set<string>;
  completionStatus: Set<"completed" | "not-started">;
  minReadTime?: number;
  maxReadTime?: number;
  quizOnly: boolean;
  minQuizScore?: number; // 0-100 percentage
}

export function useFilteredTopics(filters: Partial<FilterOptions>, completed: Set<string>, quizScores: Record<string, { score: number; total: number }>) {
  return useMemo(() => {
    let result = [...topics];

    // Category filter
    if (filters.categories && filters.categories.size > 0) {
      result = result.filter(t => filters.categories!.has(t.category));
    }

    // Difficulty filter
    if (filters.difficulties && filters.difficulties.size > 0) {
      result = result.filter(t => filters.difficulties!.has(t.difficulty));
    }

    // Completion status filter
    if (filters.completionStatus && filters.completionStatus.size > 0) {
      result = result.filter(t => {
        const isCompleted = completed.has(t.slug);
        if (filters.completionStatus!.has("completed")) return isCompleted;
        if (filters.completionStatus!.has("not-started")) return !isCompleted;
        return true;
      });
    }

    // Read time filter
    if (filters.minReadTime !== undefined || filters.maxReadTime !== undefined) {
      result = result.filter(t => {
        const min = filters.minReadTime ?? 0;
        const max = filters.maxReadTime ?? Infinity;
        return t.readTime >= min && t.readTime <= max;
      });
    }

    // Quiz only filter
    if (filters.quizOnly) {
      result = result.filter(t => quizScores[t.slug] !== undefined);
    }

    // Min quiz score filter
    if (filters.minQuizScore !== undefined && filters.minQuizScore > 0) {
      result = result.filter(t => {
        const score = quizScores[t.slug];
        if (!score) return false;
        const pct = Math.round((score.score / score.total) * 100);
        return pct >= filters.minQuizScore!;
      });
    }

    return result;
  }, [filters, completed, quizScores]);
}
