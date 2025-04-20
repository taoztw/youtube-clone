import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { videos } from "./videos.schema";

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  videoId: uuid("video_id").references(() => videos.id, {
    onDelete: "cascade",
  }),
  value: text("value").notNull(),
  createAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
