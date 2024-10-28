import { text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "../util";
import { events } from "./events";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { tasks } from "./tasks";

export const shifts = pgTable("shift", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  startTime: timestamp("start_time", { mode: "date" }).notNull(),
  endTime: timestamp("end_time", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  createdById: text("created_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const shiftsRelations = relations(shifts, ({ one, many }) => ({
  event: one(events, {
    fields: [shifts.eventId],
    references: [events.id],
  }),
  tasks: many(tasks),
}));
