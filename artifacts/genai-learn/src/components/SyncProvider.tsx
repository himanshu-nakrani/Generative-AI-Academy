import { type ReactNode } from "react";
import { useSyncToServer } from "@/hooks/useSyncToServer";

/**
 * Renders nothing but activates the background sync effect.
 * Must be rendered inside AchievementsProvider and AppProvider.
 */
export function SyncProvider({ children }: { children: ReactNode }) {
  useSyncToServer();
  return <>{children}</>;
}
