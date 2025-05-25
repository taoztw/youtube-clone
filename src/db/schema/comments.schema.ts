import { foreignKey, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { videos } from "./videos.schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const comments = pgTable(
	"comments",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		parentId: uuid("parent_id"),
		videoId: uuid("video_id")
			.references(() => videos.id, {
				onDelete: "cascade"
			})
			.notNull(),
		value: text("value").notNull(),
		createAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow()
	},
	t => {
		return [
			foreignKey({
				columns: [t.parentId],
				foreignColumns: [t.id],
				name: "comments_parent_id_fkey"
			}).onDelete("cascade")
		];
	}
);

export const commentInsertSchema = createInsertSchema(comments);
export const commentSelectSchema = createSelectSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);
