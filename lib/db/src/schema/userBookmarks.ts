import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const userBookmarksTable = pgTable(
  "user_bookmarks",
  {
    userId:    text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    topicSlug: text("topic_slug").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.topicSlug] })],
);

export const insertUserBookmarkSchema = createInsertSchema(userBookmarksTable);
export const selectUserBookmarkSchema = createSelectSchema(userBookmarksTable);
export type InsertUserBookmark = z.infer<typeof insertUserBookmarkSchema>;
export type UserBookmark       = typeof userBookmarksTable.$inferSelect;
