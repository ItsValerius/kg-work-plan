"use client";

import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { removeUserFromTaskAction } from "@/server/actions/participants";
import type {
  FilterOption,
  ParticipantsUserTask,
  ShiftFilterOption,
  TaskFilterOption,
} from "@/domains/dashboard/types";

interface ParticipantsTableProps {
  userTasks: ParticipantsUserTask[];
  allEvents: FilterOption[];
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
