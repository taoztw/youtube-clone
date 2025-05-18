import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { videos } from "./videos.schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const comments = pgTable("comments", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	videoId: uuid("video_id")
		.references(() => videos.id, {
			onDelete: "cascade"
		})
		.notNull(),
	value: text("value").notNull(),
	createAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const commentInsertSchema = createInsertSchema(comments);
export const commentSelectSchema = createSelectSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);
