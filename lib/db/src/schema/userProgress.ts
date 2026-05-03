import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const userProgressTable = pgTable(
  "user_progress",
  {
    userId:      text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    topicSlug:   text("topic_slug").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.topicSlug] })],
);

export const insertUserProgressSchema = createInsertSchema(userProgressTable);
export const selectUserProgressSchema = createSelectSchema(userProgressTable);
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress       = typeof userProgressTable.$inferSelect;
