"use client";

import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { removeUserFromTaskAction } from "@/server/actions/participants";
import { events } from "@/db/schema";
import type {
  ParticipantsUserTask,
  ShiftFilterOption,
  TaskFilterOption,
} from "@/domains/dashboard/types";

interface ParticipantsTableProps {
  userTasks: ParticipantsUserTask[];
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
