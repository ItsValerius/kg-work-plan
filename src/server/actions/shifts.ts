"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/shifts/functions";
import type { ShiftInput } from "@/domains/shifts/types";
import { revalidatePath } from "next/cache";

export async function createOrUpdateShift(data: ShiftInput) {
  const userId = await getAuthenticatedAdminUserId();
  const result = await domainActions.createOrUpdateShift(data, userId);
  revalidatePath(`/events/${data.eventId}`);
  return result;
}
