import { pgTable, text, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const userStreaksTable = pgTable("user_streaks", {
  userId:           text("user_id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  currentStreak:    integer("current_streak").notNull().default(0),
  bestStreak:       integer("best_streak").notNull().default(0),
  lastActivityDate: date("last_activity_date"),
});

export const insertUserStreakSchema = createInsertSchema(userStreaksTable);
export const selectUserStreakSchema = createSelectSchema(userStreaksTable);
export type InsertUserStreak = z.infer<typeof insertUserStreakSchema>;
export type UserStreak       = typeof userStreaksTable.$inferSelect;
