import { taskParticipants } from "@/db/schema";
import { z } from "zod";
import { idSchema } from "@/lib/validation";

const groupNameSchema = z
  .string()
  .trim()
  .max(80, "Der Gruppenname ist zu lang (höchstens 80 Zeichen).");
const groupSizeSchema = z
  .number()
  .int("Bitte gib eine ganze Zahl an.")
  .min(1, "Mindestens eine Person.")
  .max(99, "Höchstens 99 Personen.");

export type Participant = typeof taskParticipants.$inferSelect;

/** Sign-up from the event sheet (the user id comes from the session, never the client). */
export const signUpSchema = z.object({
  taskId: idSchema,
  groupName: groupNameSchema.optional(),
  groupSize: groupSizeSchema.default(1),
});

export type ParticipantInput = z.infer<typeof signUpSchema>;

export const updateGroupSchema = z.object({
  participantId: idSchema,
  groupName: groupNameSchema.optional().nullable(),
  groupSize: groupSizeSchema.optional(),
});

export type UpdateGroupData = z.infer<typeof updateGroupSchema>;

export interface UpdateGroupPayload {
  groupName?: string | null;
  groupSize?: number;
}
