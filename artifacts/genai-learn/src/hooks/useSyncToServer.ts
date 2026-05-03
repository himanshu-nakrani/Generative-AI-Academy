import { useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/react";
import { useSyncUserData } from "@workspace/api-client-react";
import { useApp } from "@/context/AppContext";
import { useAchievements } from "@/context/AchievementsContext";

const LAST_SYNC_KEY = "genai-learn:last-sync";
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function getBookmarkSlugs(): string[] {
  try {
    const raw = localStorage.getItem("genai-learn:bookmarks");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function getLastActivityDate(): string | null {
  try {
    return localStorage.getItem("genai-learn:last-date") ?? null;
  } catch { return null; }
}

export function useSyncToServer() {
  const { user, isSignedIn } = useUser();
  const { completed, streak, bestStreak } = useApp();
  const { achievements } = useAchievements();
  const { mutateAsync: syncMutate } = useSyncUserData();
  const syncingRef = useRef(false);

  const syncNow = useCallback(async () => {
    if (!isSignedIn || !user || syncingRef.current) return;
    syncingRef.current = true;

    try {
      const earnedIds = achievements
        .filter((a) => a.earned)
        .map((a) => a.id);

      await syncMutate({
        data: {
          completedSlugs:  [...completed],
          bookmarkedSlugs: getBookmarkSlugs(),
          achievementIds:  earnedIds,
          currentStreak:   streak,
          bestStreak,
          lastActivityDate: getLastActivityDate() ?? undefined,
          displayName:     user.firstName ?? user.username ?? undefined,
          email:           user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? "",
        },
      });

      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    } catch (err) {
      // Silent fail — local state is always authoritative
    } finally {
      syncingRef.current = false;
    }
  }, [isSignedIn, user, completed, streak, bestStreak, achievements, syncMutate]);

  // Sync on login
  useEffect(() => {
    if (isSignedIn) {
      syncNow();
    }
  }, [isSignedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  // Periodic sync every 5 minutes
  useEffect(() => {
    if (!isSignedIn) return;
    const interval = setInterval(syncNow, SYNC_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isSignedIn, syncNow]);

  // Sync on page unload
  useEffect(() => {
    const handleUnload = () => {
      if (isSignedIn) syncNow();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [isSignedIn, syncNow]);

  const lastSyncStr = localStorage.getItem(LAST_SYNC_KEY);
  const lastSync = lastSyncStr ? new Date(lastSyncStr) : null;

  return { syncNow, lastSync };
}
