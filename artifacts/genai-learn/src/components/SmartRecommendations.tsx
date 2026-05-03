import { Link } from "wouter";
import { ArrowRight, Zap } from "lucide-react";
import { useSmartRecommendations } from "@/hooks/useSmartRecommendations";

export function SmartRecommendations() {
  const recommendations = useSmartRecommendations();

  if (recommendations.length === 0) return null;

  const top3 = recommendations.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-purple-500" />
        Recommended Next
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {top3.map((rec) => (
          <Link key={rec.topic.slug} href={`/topic/${rec.topic.slug}`}>
            <div className="p-4 rounded-lg bg-background/80 border border-purple-500/20 hover:border-purple-500/50 hover:bg-background transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-foreground text-sm group-hover:text-purple-400 transition-colors flex-1">
                  {rec.topic.title}
                </h3>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 transition-colors flex-shrink-0 ml-2" />
              </div>
              <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
              <span className={`inline-block text-xs px-2 py-1 rounded-md font-medium ${
                rec.topic.difficulty === "Beginner" ? "bg-emerald-500/20 text-emerald-600" :
                rec.topic.difficulty === "Intermediate" ? "bg-blue-500/20 text-blue-600" :
                "bg-orange-500/20 text-orange-600"
              }`}>
                {rec.topic.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
