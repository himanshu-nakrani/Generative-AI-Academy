import { useMemo } from "react";
import { Topic, topics, learningPaths } from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { getDueReviews } from "@/hooks/useSpacedRepetition";

export interface Recommendation {
  topic: Topic;
  reason: string;
  priority: number; // 1-5, higher = more urgent
}

export function useSmartRecommendations(): Recommendation[] {
  const { completed, isComplete } = useApp();
  const dueReviews = useMemo(() => getDueReviews(Array.from(completed)), [completed]);

  return useMemo(() => {
    const recommendations: Recommendation[] = [];

    // Priority 1: Topics due for spaced repetition
    dueReviews.forEach(slug => {
      const topic = topics.find(t => t.slug === slug);
      if (topic) {
        recommendations.push({
          topic,
          reason: "Due for review (spaced repetition)",
          priority: 5,
        });
      }
    });

    // Priority 2: First unstarted topic from learning paths
    const pathsList = Object.values(learningPaths);
    pathsList.forEach(path => {
      const firstUnstarted = path.slugs.find((slug: string) => !isComplete(slug));
      if (firstUnstarted) {
        const topic = topics.find(t => t.slug === firstUnstarted);
        if (topic && !recommendations.find(r => r.topic.slug === topic.slug)) {
          recommendations.push({
            topic,
            reason: `Next in "${path.title}" path`,
            priority: 4,
          });
        }
      }
    });

    // Priority 3: Unstarted topics in Beginner difficulty
    topics.forEach(topic => {
      if (isComplete(topic.slug)) return;
      if (topic.difficulty === "Beginner" && 
          !recommendations.find(r => r.topic.slug === topic.slug)) {
        recommendations.push({
          topic,
          reason: "Great starting point",
          priority: 3,
        });
      }
    });

    // Sort by priority (descending) then alphabetically
    return recommendations
      .sort((a, b) => b.priority - a.priority || a.topic.title.localeCompare(b.topic.title))
      .slice(0, 10); // Return top 10 recommendations
  }, [completed, isComplete, dueReviews]);
}
