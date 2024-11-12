import { timestamp, text, integer, unique } from "drizzle-orm/pg-core";
import { pgTable } from "../util";
import { users } from "./users";
import { shifts } from "./shifts";
import { relations } from "drizzle-orm";

export const tasks = pgTable("task", {
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
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

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
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    unique_task_user: unique().on(table.taskId, table.userId),
  })
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  shift: one(shifts, {
    fields: [tasks.shiftId],
    references: [shifts.id],
  }),
  participants: many(taskParticipants),
}));

export const taskParticipantsRelations = relations(
  taskParticipants,
  ({ one }) => ({
    task: one(tasks, {
      fields: [taskParticipants.taskId],
      references: [tasks.id],
    }),
    user: one(users, {
      fields: [taskParticipants.userId],
      references: [users.id],
    }),
  })
);
