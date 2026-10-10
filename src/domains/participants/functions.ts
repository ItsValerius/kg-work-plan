import db from "@/db";
import { shifts, taskParticipants, tasks } from "@/db/schema";
import { logger } from "@/lib/logger";
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { fitsCapacity } from "./capacity";
import { getParticipantById } from "./queries";
import {
  updateGroupSchema,
  type UpdateGroupData,
  type UpdateGroupPayload,
  type ParticipantInput,
} from "./types";

const ALREADY_SIGNED_UP = "Benutzer bereits zur Aufgabe eingetragen.";
export const SHIFT_OVER = "Diese Schicht ist schon vorbei.";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Locks the task row for the rest of the transaction and returns it with the number of
 * people already on it, so concurrent sign-ups for one task are counted one after another.
 */
async function lockTaskAndCount(tx: Tx, taskId: string, excludeParticipantId?: string) {
  const [task] = await tx.select().from(tasks).where(eq(tasks.id, taskId)).for("update");
  if (!task) {
    return null;
  }
  const [{ taken }] = await tx
    .select({ taken: sql<number>`coalesce(sum(${taskParticipants.groupSize}), 0)`.mapWith(Number) })
    .from(taskParticipants)
    .where(
      excludeParticipantId
        ? and(eq(taskParticipants.taskId, taskId), ne(taskParticipants.id, excludeParticipantId))
        : eq(taskParticipants.taskId, taskId),
    );
  return { task, taken };
}

/**
 * Helpers change their own sign-ups only until the shift ends, so the record of who
 * helped stays as it was. Admins correct it through the dashboard instead.
 */
export async function assertShiftNotOver(taskId: string, executor: Tx | typeof db = db) {
  const [row] = await executor
    .select({ endTime: shifts.endTime })
    .from(tasks)
    .innerJoin(shifts, eq(tasks.shiftId, shifts.id))
    .where(eq(tasks.id, taskId));
  if (row && row.endTime < new Date()) {
    throw new Error(SHIFT_OVER);
  }
}

/** Postgres unique violation, raw or wrapped by drizzle. */
function isUniqueViolation(error: unknown): boolean {
  const code = (e: unknown) => (e as { code?: string } | undefined)?.code;
  return code(error) === "23505" || code((error as { cause?: unknown })?.cause) === "23505";
}

export async function createParticipant(data: ParticipantInput, userId: string) {
  try {
    const newTaskParticipant = await db.transaction(async (tx) => {
      const locked = await lockTaskAndCount(tx, data.taskId);
      if (!locked) {
        throw new Error("Aufgabe existiert nicht.");
      }
      await assertShiftNotOver(data.taskId, tx);

      if (!fitsCapacity(locked.task.requiredParticipants, locked.taken, data.groupSize ?? 1)) {
        throw new Error("Die Mitgliederanzahl der Gruppe ist zu groß für diese Aufgabe.");
      }

      // The unique (task, user) constraint rejects a second sign-up by the same person.
      const [created] = await tx
        .insert(taskParticipants)
        .values({
          groupName: data.groupName,
          groupSize: data.groupSize,
          userId: userId,
          taskId: data.taskId,
          createdById: userId,
        })
        .returning();
      return created;
    });

    logger.info("Task participant created", {
      taskId: data.taskId,
      userId: userId,
    });
    return newTaskParticipant;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error(ALREADY_SIGNED_UP);
    }
    logger.error("Failed to create task participant", error, {
      taskId: data.taskId,
    });
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to register for task");
  }
}

export async function updateGroup(data: UpdateGroupData, userId: string) {
  try {
    const validated = updateGroupSchema.safeParse(data);
    if (!validated.success) {
      throw new Error("Invalid data");
    }

    // Get the current participant
    const participant = await getParticipantById(validated.data.participantId);

    if (!participant) {
      throw new Error("Participant not found");
    }

    // Verify the participant belongs to the current user
    if (participant.userId !== userId) {
      throw new Error("Unauthorized");
    }
    await assertShiftNotOver(participant.taskId);

    // Update the participant
    const updateData: UpdateGroupPayload = {};

    if (validated.data.groupName !== undefined) {
      // Allow empty string to clear the group name (set to null)
      updateData.groupName = validated.data.groupName === "" ? null : validated.data.groupName;
    }

    if (validated.data.groupSize !== undefined) {
      updateData.groupSize = validated.data.groupSize;
    }

    await db.transaction(async (tx) => {
      // A bigger group must still fit next to everyone else on the task.
      if (validated.data.groupSize !== undefined) {
        const locked = await lockTaskAndCount(tx, participant.taskId, participant.id);
        if (
          locked &&
          !fitsCapacity(locked.task.requiredParticipants, locked.taken, validated.data.groupSize)
        ) {
          throw new Error(
            `Die neue Gruppengröße würde die maximale Teilnehmeranzahl von ${locked.task.requiredParticipants} überschreiten.`,
          );
        }
      }

      await tx
        .update(taskParticipants)
        .set(updateData)
        .where(eq(taskParticipants.id, validated.data.participantId));
    });

    return { success: true };
  } catch (error) {
    logger.error("Failed to update group", error, { data });
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update group");
  }
}

export async function removeUserFromTaskAction(selectedRowIds: string[], userId: string) {
  try {
    await db.delete(taskParticipants).where(inArray(taskParticipants.id, selectedRowIds));
    logger.info("Task participants deleted", {
      count: selectedRowIds.length,
      ids: selectedRowIds,
      userId,
    });
  } catch (error) {
    logger.error("Failed to delete task participants", error, { ids: selectedRowIds });
    throw error;
  }
}
