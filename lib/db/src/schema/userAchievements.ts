import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const userAchievementsTable = pgTable(
  "user_achievements",
  {
    userId:        text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    achievementId: text("achievement_id").notNull(),
    earnedAt:      timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.achievementId] })],
);

export const insertUserAchievementSchema = createInsertSchema(userAchievementsTable);
export const selectUserAchievementSchema = createSelectSchema(userAchievementsTable);
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement       = typeof userAchievementsTable.$inferSelect;
