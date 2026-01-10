"use client";

import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { removeUserFromTaskAction } from "@/server/actions/participants";
import { UserTaskSchema } from "./columns";
import { z } from "zod";
import { events } from "@/db/schema";

type UserTask = z.infer<typeof UserTaskSchema>;

interface ParticipantsTableProps {
  userTasks: UserTask[];
  allEvents: (typeof events.$inferSelect)[];
  shiftsForFilter: Array<{ id: string; name: string; eventName: string }>;
  tasksForFilter: Array<{ id: string; name: string; shiftName: string }>;
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

