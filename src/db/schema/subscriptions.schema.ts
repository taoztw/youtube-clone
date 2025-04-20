import { pgTable, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const subscriptions = pgTable(
  "subscriptions",
  {
    viewerId: uuid("viewer_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    creatorId: uuid("creator_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: uuid("created_at").defaultRandom().notNull(),
    updatedAt: uuid("updated_at").defaultRandom().notNull(),
  },
  (t) => [
    {
      name: "subscriptions_pk",
      columns: [t.viewerId, t.creatorId],
    },
  ]
);
