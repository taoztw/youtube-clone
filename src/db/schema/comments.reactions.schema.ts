import {
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-zod";
import { comments } from "./comments.schema";

export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);

export const commentReactions = pgTable(
  "comment_reactions",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    commentId: uuid("comment_id")
      .references(() => comments.id, {
        onDelete: "cascade",
      })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      name: "comment_reactions_pk",
      columns: [t.userId, t.commentId],
    }),
  ]
);

export const videoReactionsInsertSchema = createInsertSchema(commentReactions);
export const videoReactionsSelectSchema = createSelectSchema(commentReactions);
export const videoReactionsUpdateSchema = createUpdateSchema(commentReactions);
