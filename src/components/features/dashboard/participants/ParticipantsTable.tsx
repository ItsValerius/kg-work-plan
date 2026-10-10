"use client";

import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { removeUserFromTaskAction } from "@/server/actions/participants";
import { UserTaskSchema } from "./columns";
import { z } from "zod";
import { events } from "@/db/schema";
import type { ShiftFilterOption, TaskFilterOption } from "@/domains/dashboard/types";

type UserTask = z.infer<typeof UserTaskSchema>;

interface ParticipantsTableProps {
  userTasks: UserTask[];
  allEvents: (typeof events.$inferSelect)[];
  shiftsForFilter: ShiftFilterOption[];
  tasksForFilter: TaskFilterOption[];
}

export function ParticipantsTable({
  userTasks,
  allEvents,
  shiftsForFilter,
  tasksForFilter,
}: ParticipantsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={userTasks}
      events={allEvents}
      shifts={shiftsForFilter}
      tasks={tasksForFilter}
      onDeleteRows={removeUserFromTaskAction}
    />
  );
}
