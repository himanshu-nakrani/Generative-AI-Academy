import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { usersTable, userProgressTable, userStreaksTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import { GetLeaderboardResponse, GetLeaderboardQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /leaderboard
router.get("/leaderboard", async (req, res) => {
  const { userId: currentUserId } = getAuth(req);

  const queryParsed = GetLeaderboardQueryParams.safeParse(req.query);
  const limit = queryParsed.success ? queryParsed.data.limit : 20;

  // Join users → progress count + streaks, sorted by completedCount desc
  const rows = await db
    .select({
      userId:        usersTable.id,
      displayName:   usersTable.displayName,
      avatarUrl:     usersTable.avatarUrl,
      completedCount: sql<number>`cast(count(${userProgressTable.topicSlug}) as int)`,
      currentStreak:  sql<number>`cast(coalesce(${userStreaksTable.currentStreak}, 0) as int)`,
      bestStreak:     sql<number>`cast(coalesce(${userStreaksTable.bestStreak}, 0) as int)`,
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

  // Determine current user's rank
  const currentUserRank: number | null =
    currentUserId
      ? (entries.findIndex((e) => e.userId === currentUserId) + 1) || null
      : null;

  const response = GetLeaderboardResponse.parse({ entries, currentUserRank: currentUserRank ?? null });
  res.json(response);
});

export default router;
