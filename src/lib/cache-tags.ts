/** Every event, shift, task and sign-up read is tagged with this; any write invalidates it. */
export const WORKPLAN_TAG = "workplan";

/** Profile data of one user. */
export const userTag = (userId: string) => `user-${userId}`;
