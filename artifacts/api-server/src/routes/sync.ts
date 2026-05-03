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
import { SyncRequestBody, SyncResponseBody } from "@workspace/api-zod";

const router: IRouter = Router();

// POST /sync — upsert all user learning data
router.post("/sync", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;

  const parsed = SyncRequestBody.safeParse(req.body);
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

  // Upsert user
  await db
    .insert(usersTable)
    .values({
      id: userId,
      email,
      displayName: displayName ?? null,
    })
    .onConflictDoUpdate({
      target: usersTable.id,
      set: {
        email,
        displayName: displayName ?? null,
        updatedAt: new Date(),
      },
    });

  // Upsert progress — delete existing and re-insert for simplicity
  await db.delete(userProgressTable).where(eq(userProgressTable.userId, userId));
  if (completedSlugs.length > 0) {
    await db.insert(userProgressTable).values(
      completedSlugs.map((slug) => ({ userId, topicSlug: slug })),
    );
  }

  // Upsert bookmarks
  await db.delete(userBookmarksTable).where(eq(userBookmarksTable.userId, userId));
  if (bookmarkedSlugs.length > 0) {
    await db.insert(userBookmarksTable).values(
      bookmarkedSlugs.map((slug) => ({ userId, topicSlug: slug })),
    );
  }

  // Upsert achievements
  await db.delete(userAchievementsTable).where(eq(userAchievementsTable.userId, userId));
  if (achievementIds.length > 0) {
    await db.insert(userAchievementsTable).values(
      achievementIds.map((id) => ({ userId, achievementId: id })),
    );
  }

  // Upsert streak
  await db
    .insert(userStreaksTable)
    .values({
      userId,
      currentStreak,
      bestStreak,
      lastActivityDate: lastActivityDate ?? null,
    })
    .onConflictDoUpdate({
      target: userStreaksTable.userId,
      set: {
        currentStreak,
        bestStreak,
        lastActivityDate: lastActivityDate ?? null,
      },
    });

  const syncedAt = new Date().toISOString();
  const response = SyncResponseBody.parse({
    completedSlugs,
    bookmarkedSlugs,
    achievementIds,
    currentStreak,
    bestStreak,
    lastActivityDate: lastActivityDate ?? null,
    syncedAt,
  });
  res.json(response);
});

// GET /sync — retrieve user's synced state
router.get("/sync", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;

  const [progress, bookmarks, achievements, streak] = await Promise.all([
    db.select().from(userProgressTable).where(eq(userProgressTable.userId, userId)),
    db.select().from(userBookmarksTable).where(eq(userBookmarksTable.userId, userId)),
    db.select().from(userAchievementsTable).where(eq(userAchievementsTable.userId, userId)),
    db.select().from(userStreaksTable).where(eq(userStreaksTable.userId, userId)),
  ]);

  const streakRow = streak[0];
  const response = SyncResponseBody.parse({
    completedSlugs:  progress.map((r) => r.topicSlug),
    bookmarkedSlugs: bookmarks.map((r) => r.topicSlug),
    achievementIds:  achievements.map((r) => r.achievementId),
    currentStreak:   streakRow?.currentStreak ?? 0,
    bestStreak:      streakRow?.bestStreak ?? 0,
    lastActivityDate: streakRow?.lastActivityDate ?? null,
    syncedAt:        new Date().toISOString(),
  });
  res.json(response);
});

export default router;
