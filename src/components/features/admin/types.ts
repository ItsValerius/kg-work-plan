/**
 * Base type for delete action callback
 */
export type DeleteAction = (id: string) => void;

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
}

