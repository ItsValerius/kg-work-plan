import { check, index, timestamp, text, integer, unique } from "drizzle-orm/pg-core";
import { pgTable } from "../util";
import { users } from "./users";
import { shifts } from "./shifts";
import { relations, sql } from "drizzle-orm";

export const tasks = pgTable(
  "task",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    shiftId: text("shift_id")
      .notNull()
      .references(() => shifts.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    startTime: timestamp("start_time", { mode: "date" }).defaultNow().notNull(),
    description: text("description").notNull(),
    // Number of people needed for this task
    requiredParticipants: integer("required_participants").notNull().default(1),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    createdById: text("created_by_id")
      // Deleting a person (e.g. on request) must not delete what they planned.
      .references(() => users.id, { onDelete: "set null" }),
  },
  (table) => [
    index("task_shift_id_idx").on(table.shiftId),
    // Mirrors the form validation for writes that bypass it (MCP tools, seed script).
    check("task_required_participants_positive", sql`${table.requiredParticipants} >= 1`),
  ],
);

// Table for task participants (can be registered users or unnamed group members)
export const taskParticipants = pgTable(
  "task_participants",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    taskId: text("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    // Optional reference to a registered user
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    // Used when adding unnamed participants (e.g., "Bob's friends")
    groupName: text("group_name"),
    // Number of people in this group (defaults to 1 for individual assignments)
    groupSize: integer("group_size").notNull().default(1),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    // Who added this participant/group
    createdById: text("created_by_id")
      // Deleting a person (e.g. on request) must not delete what they planned.
      .references(() => users.id, { onDelete: "set null" }),
  },
  (table) => [
    unique().on(table.taskId, table.userId),
    // (task_id, user_id) above covers task lookups; user lookups need their own index.
    index("task_participants_user_id_idx").on(table.userId),
    check("task_participants_group_size_positive", sql`${table.groupSize} >= 1`),
  ],
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  shift: one(shifts, {
    fields: [tasks.shiftId],
    references: [shifts.id],
  }),
  participants: many(taskParticipants),
}));

export const taskParticipantsRelations = relations(taskParticipants, ({ one }) => ({
  task: one(tasks, {
    fields: [taskParticipants.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskParticipants.userId],
    references: [users.id],
  }),
}));
