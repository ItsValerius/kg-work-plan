import db from "@/db";
import { taskParticipants } from "@/db/schema";
import { logger } from "@/lib/logger";
import { eq, inArray } from "drizzle-orm";
import { getParticipantById, getParticipantsByTaskId } from "./queries";
import { getTaskWithParticipants } from "@/domains/tasks/queries";
import { getParticipantByUserAndTask } from "./queries";
import { updateGroupSchema, type UpdateGroupData, type UpdateGroupPayload, type ParticipantInput } from "./types";

export async function createParticipant(data: ParticipantInput, userId: string) {
  try {
    // Check if user is already registered
    const existingParticipant = await getParticipantByUserAndTask(
      userId,
      data.taskId
    );
    if (existingParticipant) {
      throw new Error("Benutzer bereits zur Aufgabe eingetragen.");
    }

    // Get task with participants
    const task = await getTaskWithParticipants(data.taskId);
    
    if (!task) {
      throw new Error("Aufgabe existiert nicht.");
    }

    // Check capacity
    const allParticipants = await getParticipantsByTaskId(data.taskId);
    const currentParticipantsCount = allParticipants.reduce(
      (accumulator, participant) => accumulator + participant.groupSize,
      0
    );

    const requestedGroupSize = data.groupSize ?? 1;
    if (
      requestedGroupSize > task.requiredParticipants ||
      requestedGroupSize + currentParticipantsCount > task.requiredParticipants
    ) {
      throw new Error(
        "Die Mitgliederanzahl der Gruppe ist zu groß für diese Aufgabe."
      );
    }

    // Create participant
    const newTaskParticipant = await db
      .insert(taskParticipants)
      .values({
        groupName: data.groupName,
        groupSize: data.groupSize,
        userId: userId,
        taskId: data.taskId,
        createdById: userId,
      })
      .returning();
    
    logger.info("Task participant created", {
      taskId: data.taskId,
      userId: userId,
    });
    return newTaskParticipant[0];
  } catch (error) {
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

    // If groupSize is being updated, check capacity constraints
    if (validated.data.groupSize !== undefined && participant.task) {
      // Get all participants for this task
      const allParticipants = await getParticipantsByTaskId(participant.taskId);

      // Calculate current total participants excluding the one being updated
      const currentTotal = allParticipants.reduce(
        (sum, p) => (p.id === participant.id ? sum : sum + (p.groupSize || 1)),
        0
      );

      // Check if new group size would exceed task capacity
      const newTotal = currentTotal + validated.data.groupSize;
      if (newTotal > participant.task.requiredParticipants) {
        throw new Error(
          `Die neue Gruppengröße würde die maximale Teilnehmeranzahl von ${participant.task.requiredParticipants} überschreiten.`
        );
      }

      // Check if group size exceeds required participants individually
      if (validated.data.groupSize > participant.task.requiredParticipants) {
        throw new Error(
          `Die Gruppengröße darf die maximale Teilnehmeranzahl von ${participant.task.requiredParticipants} nicht überschreiten.`
        );
      }
    }

    // Update the participant
    const updateData: UpdateGroupPayload = {};

    if (validated.data.groupName !== undefined) {
      // Allow empty string to clear the group name (set to null)
      updateData.groupName =
        validated.data.groupName === "" ? null : validated.data.groupName;
    }

    if (validated.data.groupSize !== undefined) {
      updateData.groupSize = validated.data.groupSize;
    }

    await db
      .update(taskParticipants)
      .set(updateData)
      .where(eq(taskParticipants.id, validated.data.participantId));

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
    await db
      .delete(taskParticipants)
      .where(inArray(taskParticipants.id, selectedRowIds));
    logger.info("Task participants deleted", { count: selectedRowIds.length, ids: selectedRowIds, userId });
  } catch (error) {
    logger.error("Failed to delete task participants", error, { ids: selectedRowIds });
    throw error;
  }
}

export async function removeParticipant(participantId: string, userId: string) {
  try {
    const participant = await getParticipantById(participantId);
    if (!participant || participant.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await db
      .delete(taskParticipants)
      .where(eq(taskParticipants.id, participantId));

    return;
  } catch (error) {
    logger.error("Failed to remove participant", error, { participantId });
    throw new Error("Failed to remove participant");
  }
}
