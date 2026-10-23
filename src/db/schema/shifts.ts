import { check, index, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "../util";
import { events } from "./events";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";
import { tasks } from "./tasks";

export const shifts = pgTable(
  "shift",
  {
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
      // Deleting a person (e.g. on request) must not delete what they planned.
      .references(() => users.id, { onDelete: "set null" }),
  },
  (table) => [
    index("shift_event_id_idx").on(table.eventId),
    // Mirrors the form validation for writes that bypass it (MCP tools, seed script).
    check("shift_ends_after_start", sql`${table.endTime} > ${table.startTime}`),
  ],
);

export const shiftsRelations = relations(shifts, ({ one, many }) => ({
  event: one(events, {
    fields: [shifts.eventId],
    references: [events.id],
  }),
  tasks: many(tasks),
}));
