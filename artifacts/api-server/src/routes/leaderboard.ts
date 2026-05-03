import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import {
  usersTable,
  userProgressTable,
  userStreaksTable,
} from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import { LeaderboardResponseBody } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /leaderboard
router.get("/leaderboard", async (req, res) => {
  const { userId: currentUserId } = getAuth(req);

  const limitRaw = parseInt(String(req.query.limit ?? "20"));
  const limit    = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 20;

  // Join users → progress count + streaks, sorted by completedCount desc
  const rows = await db
    .select({
      userId:        usersTable.id,
      displayName:   usersTable.displayName,
      avatarUrl:     usersTable.avatarUrl,
      completedCount: sql<number>`count(${userProgressTable.topicSlug})::int`,
      currentStreak: sql<number>`coalesce(${userStreaksTable.currentStreak}, 0)::int`,
      bestStreak:    sql<number>`coalesce(${userStreaksTable.bestStreak}, 0)::int`,
    })
    .from(usersTable)
    .leftJoin(userProgressTable, eq(userProgressTable.userId, usersTable.id))
    .leftJoin(userStreaksTable,  eq(userStreaksTable.userId,  usersTable.id))
    .groupBy(usersTable.id, userStreaksTable.currentStreak, userStreaksTable.bestStreak)
    .orderBy(desc(sql`count(${userProgressTable.topicSlug})`))
    .limit(limit);

  const entries = rows.map((row, i) => ({
    rank:           i + 1,
    userId:         row.userId,
    displayName:    row.displayName ?? null,
    avatarUrl:      row.avatarUrl ?? null,
    completedCount: row.completedCount,
    currentStreak:  row.currentStreak,
    bestStreak:     row.bestStreak,
    isCurrentUser:  row.userId === currentUserId,
  }));

  // Find current user rank if they're not in top N
  let currentUserRank: number | null = null;
  if (currentUserId) {
    const idx = entries.findIndex((e) => e.userId === currentUserId);
    if (idx >= 0) {
      currentUserRank = idx + 1;
    } else {
      // Count users with more completions
      const [{ above }] = await db
        .select({
          above: sql<number>`count(distinct u.id)::int`,
        })
        .from(usersTable.as("u"))
        .leftJoin(userProgressTable.as("p"), sql`p.user_id = u.id`)
        .groupBy(sql`u.id`)
        .having(sql`count(p.topic_slug) > (
          select count(*) from user_progress where user_id = ${currentUserId}
        )`);
      currentUserRank = (above ?? 0) + 1;
    }
  }

  const response = LeaderboardResponseBody.parse({ entries, currentUserRank });
  res.json(response);
});

export default router;
