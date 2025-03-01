import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { categories } from "./categories.schema";

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),

  userId: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  createAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
