import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { db } from "@workspace/db";
import {
  usersTable,
  userProgressTable,
  userStreaksTable,
  userAchievementsTable,
  userBookmarksTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { SyncUserDataBody, SyncUserDataResponse, GetUserSyncDataResponse } from "@workspace/api-zod";

const router: IRouter = Router();

// POST /sync — upsert all user learning data
router.post("/sync", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;

  const parsed = SyncUserDataBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const {
    completedSlugs,
    bookmarkedSlugs,
    achievementIds,
    currentStreak,
    bestStreak,
    lastActivityDate,
    displayName,
    email,
  } = parsed.data;

  // Upsert user record
  await db
    .insert(usersTable)
    .values({ id: userId, email, displayName: displayName ?? null })
    .onConflictDoUpdate({
      target: usersTable.id,
      set: { email, displayName: displayName ?? null, updatedAt: new Date() },
    });

  // Replace progress
  await db.delete(userProgressTable).where(eq(userProgressTable.userId, userId));
  if (completedSlugs.length > 0) {
    await db.insert(userProgressTable).values(
      completedSlugs.map((slug) => ({ userId, topicSlug: slug })),
    );
  }

  // Replace bookmarks
  await db.delete(userBookmarksTable).where(eq(userBookmarksTable.userId, userId));
  if (bookmarkedSlugs.length > 0) {
    await db.insert(userBookmarksTable).values(
      bookmarkedSlugs.map((slug) => ({ userId, topicSlug: slug })),
    );
  }

  // Replace achievements
  await db.delete(userAchievementsTable).where(eq(userAchievementsTable.userId, userId));
  if (achievementIds.length > 0) {
    await db.insert(userAchievementsTable).values(
      achievementIds.map((id) => ({ userId, achievementId: id })),
    );
  }

  // Upsert streak
  const lastDate = lastActivityDate instanceof Date
    ? lastActivityDate.toISOString().split("T")[0]
    : (lastActivityDate ?? null);

  await db
    .insert(userStreaksTable)
    .values({ userId, currentStreak, bestStreak, lastActivityDate: lastDate })
    .onConflictDoUpdate({
      target: userStreaksTable.userId,
      set: { currentStreak, bestStreak, lastActivityDate: lastDate },
    });

  const response = SyncUserDataResponse.parse({
    completedSlugs,
    bookmarkedSlugs,
    achievementIds,
    currentStreak,
    bestStreak,
    lastActivityDate: lastDate ?? null,
    syncedAt: new Date(),
  });
  res.json(response);
});

// GET /sync — retrieve user's synced state
router.get("/sync", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;

  const [progress, bookmarks, achievements, streakRows] = await Promise.all([
    db.select().from(userProgressTable).where(eq(userProgressTable.userId, userId)),
    db.select().from(userBookmarksTable).where(eq(userBookmarksTable.userId, userId)),
    db.select().from(userAchievementsTable).where(eq(userAchievementsTable.userId, userId)),
    db.select().from(userStreaksTable).where(eq(userStreaksTable.userId, userId)),
  ]);

  const streak = streakRows[0];
  const response = GetUserSyncDataResponse.parse({
    completedSlugs:  progress.map((r) => r.topicSlug),
    bookmarkedSlugs: bookmarks.map((r) => r.topicSlug),
    achievementIds:  achievements.map((r) => r.achievementId),
    currentStreak:   streak?.currentStreak ?? 0,
    bestStreak:      streak?.bestStreak ?? 0,
    lastActivityDate: streak?.lastActivityDate ?? null,
    syncedAt:        new Date(),
  });
  res.json(response);
});

export default router;
