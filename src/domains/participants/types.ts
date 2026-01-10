import { taskParticipants } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type Participant = typeof taskParticipants.$inferSelect;
export type ParticipantInsert = typeof taskParticipants.$inferInsert;

export const participantSchema = createInsertSchema(taskParticipants).extend({
  groupName: z.string().optional(),
  groupSize: z.number().optional(),
});

export type ParticipantInput = z.infer<typeof participantSchema>;

export const updateGroupSchema = z.object({
  participantId: z.string(),
  groupName: z.string().optional().nullable(),
  groupSize: z.number().int().min(1).optional(),
});

export type UpdateGroupData = z.infer<typeof updateGroupSchema>;

export interface UpdateGroupPayload {
  groupName?: string | null;
  groupSize?: number;
}
