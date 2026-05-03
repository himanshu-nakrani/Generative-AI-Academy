import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { db } from "@workspace/db";
import { usersTable, userProgressTable, userStreaksTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { GetMyProfileResponse, UpdateMyProfileBody, UpdateMyProfileResponse } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /user/me
router.get("/user/me", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;

  const [userRows, streakRows, progressResult] = await Promise.all([
    db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1),
    db.select().from(userStreaksTable).where(eq(userStreaksTable.userId, userId)).limit(1),
    db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(userProgressTable)
      .where(eq(userProgressTable.userId, userId)),
  ]);

  const user = userRows[0];
  if (!user) {
    res.status(404).json({ error: "User not found. Sync your data first." });
    return;
  }

  const streak = streakRows[0];
  const response = GetMyProfileResponse.parse({
    id:             user.id,
    email:          user.email,
    displayName:    user.displayName ?? null,
    avatarUrl:      user.avatarUrl ?? null,
    completedCount: progressResult[0]?.count ?? 0,
    currentStreak:  streak?.currentStreak ?? 0,
    bestStreak:     streak?.bestStreak ?? 0,
    createdAt:      user.createdAt,
  });
  res.json(response);
});

// PATCH /user/me
router.patch("/user/me", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;

  const parsed = UpdateMyProfileBody.safeParse(req.body);
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

  const [streakRows, progressResult] = await Promise.all([
    db.select().from(userStreaksTable).where(eq(userStreaksTable.userId, userId)).limit(1),
    db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(userProgressTable)
      .where(eq(userProgressTable.userId, userId)),
  ]);

  const response = UpdateMyProfileResponse.parse({
    id:             user.id,
    email:          user.email,
    displayName:    user.displayName ?? null,
    avatarUrl:      user.avatarUrl ?? null,
    completedCount: progressResult[0]?.count ?? 0,
    currentStreak:  streakRows[0]?.currentStreak ?? 0,
    bestStreak:     streakRows[0]?.bestStreak ?? 0,
    createdAt:      user.createdAt,
  });
  res.json(response);
});

export default router;
