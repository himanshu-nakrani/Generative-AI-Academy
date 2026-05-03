import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { db } from "@workspace/db";
import { usersTable, userProgressTable, userStreaksTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { UserProfileBody, UpdateProfileRequestBody } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /user/me
router.get("/user/me", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;

  const [userRow, streakRow, progressResult] = await Promise.all([
    db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1),
    db.select().from(userStreaksTable).where(eq(userStreaksTable.userId, userId)).limit(1),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(userProgressTable)
      .where(eq(userProgressTable.userId, userId)),
  ]);

  const user = userRow[0];
  if (!user) {
    res.status(404).json({ error: "User not found. Sync your data first." });
    return;
  }

  const streak = streakRow[0];
  const response = UserProfileBody.parse({
    id:             user.id,
    email:          user.email,
    displayName:    user.displayName ?? null,
    avatarUrl:      user.avatarUrl ?? null,
    completedCount: progressResult[0]?.count ?? 0,
    currentStreak:  streak?.currentStreak ?? 0,
    bestStreak:     streak?.bestStreak ?? 0,
    createdAt:      user.createdAt.toISOString(),
  });
  res.json(response);
});

// PATCH /user/me
router.patch("/user/me", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;

  const parsed = UpdateProfileRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const updates: Partial<typeof usersTable.$inferInsert> = { updatedAt: new Date() };
  if ("displayName" in parsed.data) {
    updates.displayName = parsed.data.displayName ?? null;
  }

  const updated = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, userId))
    .returning();

  const user = updated[0];
  if (!user) {
    res.status(404).json({ error: "User not found. Sync your data first." });
    return;
  }

  const [streakRow, progressResult] = await Promise.all([
    db.select().from(userStreaksTable).where(eq(userStreaksTable.userId, userId)).limit(1),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(userProgressTable)
      .where(eq(userProgressTable.userId, userId)),
  ]);

  const response = UserProfileBody.parse({
    id:             user.id,
    email:          user.email,
    displayName:    user.displayName ?? null,
    avatarUrl:      user.avatarUrl ?? null,
    completedCount: progressResult[0]?.count ?? 0,
    currentStreak:  streakRow[0]?.currentStreak ?? 0,
    bestStreak:     streakRow[0]?.bestStreak ?? 0,
    createdAt:      user.createdAt.toISOString(),
  });
  res.json(response);
});

export default router;
