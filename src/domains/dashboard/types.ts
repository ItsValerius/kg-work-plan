// Shared types for dashboard components

import type { events, taskParticipants } from "@/db/schema";

export interface FilterOption {
  id: string;
  name: string;
}

export interface ShiftFilterOption extends FilterOption {
  eventId: string;
  eventName: string;
}

export interface TaskFilterOption extends FilterOption {
  shiftId: string;
  shiftName: string;
  eventId: string;
}

export type ParticipantsUserTask = typeof taskParticipants.$inferSelect & {
  user: { name: string | null; email: string | null } | null;
  task: {
    name: string;
    startTime: Date;
    shift: {
      id: string;
      name: string;
      event: { id: string; name: string };
    };
  };
};

export interface ParticipantsData {
  userTasks: ParticipantsUserTask[];
  allEvents: (typeof events.$inferSelect)[];
  shiftsForFilter: ShiftFilterOption[];
  tasksForFilter: TaskFilterOption[];
}
