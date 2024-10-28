import { timestamp, text } from "drizzle-orm/pg-core";
import { pgTable } from "../util";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { shifts } from "./shifts";

export const events = pgTable("event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  createdById: text("created_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const eventsRelations = relations(events, ({ many }) => ({
  shifts: many(shifts),
}));
