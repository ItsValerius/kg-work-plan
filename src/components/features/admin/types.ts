import { tasks } from "@/db/schema/index";
import { taskParticipants } from "@/db/schema";

/**
 * Base type for delete action callback
 * Server actions are async and return Promise<void>
 */
export type DeleteAction = (id: string) => Promise<void>;

export type Participant = typeof taskParticipants.$inferSelect & {
  user: { name: string | null; email: string | null } | null;
};

/**
 * Props for EventAdminActions component
 */
export interface EventAdminActionsProps {
  eventId: string;
  eventName: string;
  eventStartDate: Date;
  eventEndDate: Date;
  deleteAction: DeleteAction;
}

/**
 * Props for ShiftAdminActions component
 */
export interface ShiftAdminActionsProps {
  eventId: string;
  shiftId: string;
  deleteAction: DeleteAction;
}

/**
 * Props for TaskAdminActions component
 */
export interface TaskAdminActionsProps {
  eventId: string;
  shiftId: string;
  taskId: string;
  deleteAction: DeleteAction;
  task: typeof tasks.$inferSelect;
  participants: Participant[];
  isLoggedIn: boolean;
  isFull: boolean;
  progressPercentage: number;
  progressBarColor: string;
}

