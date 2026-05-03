import { useEffect } from "react";
import { useAchievements, type AchievementDef } from "@/context/AchievementsContext";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen, Layers, TrendingUp, Zap, Trophy, Cpu, Brain, Wrench,
  FlaskConical, Microscope, GraduationCap, Flame, Gem, HelpCircle,
  CheckCircle2, Award, Crown, Bookmark, Archive, Highlighter, PenLine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen, Layers, TrendingUp, Zap, Trophy, Cpu, Brain, Wrench,
  FlaskConical, Microscope, GraduationCap, Flame, Gem, HelpCircle,
  CheckCircle2, Award, Crown, Bookmark, Archive, Highlighter, PenLine,
};

const RARITY_STYLES = {
  common:    { ring: "border-border",          label: "Common",    glow: "" },
  uncommon:  { ring: "border-emerald-500/50",  label: "Uncommon",  glow: "shadow-[0_0_12px_hsl(142_70%_45%/0.25)]" },
  rare:      { ring: "border-violet-500/50",   label: "Rare",      glow: "shadow-[0_0_12px_hsl(262_60%_55%/0.3)]" },
  legendary: { ring: "border-amber-400/60",    label: "Legendary", glow: "shadow-[0_0_16px_hsl(45_90%_52%/0.4)]" },
};

function AchievementToastContent({ achievement }: { achievement: AchievementDef }) {
  const Icon = ICON_MAP[achievement.icon] ?? Trophy;
  const style = RARITY_STYLES[achievement.rarity];
  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 bg-muted ${style.ring} ${style.glow}`}>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Achievement Unlocked</span>
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${
            achievement.rarity === "legendary" ? "border-amber-400/40 text-amber-400 bg-amber-400/8" :
            achievement.rarity === "rare"      ? "border-violet-400/40 text-violet-400 bg-violet-400/8" :
            achievement.rarity === "uncommon"  ? "border-emerald-400/40 text-emerald-400 bg-emerald-400/8" :
            "border-border text-muted-foreground bg-muted"
          }`}>
            {style.label}
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground">{achievement.title}</p>
        <p className="text-xs text-muted-foreground leading-snug mt-0.5">{achievement.description}</p>
      </div>
    </div>
  );
}

export function AchievementToastManager() {
  const { newlyEarned, dismissNew } = useAchievements();
  const { toast } = useToast();

  useEffect(() => {
    if (newlyEarned.length === 0) return;
    const achievement = newlyEarned[0];
    toast({
      duration: 5000,
      description: <AchievementToastContent achievement={achievement} />,
    });
    dismissNew(achievement.id);
  }, [newlyEarned, toast, dismissNew]);

  return null;
}
