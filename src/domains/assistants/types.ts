import { z } from "zod";

/** OAuth client ids: random strings, or a URL for clients identified by a metadata document. */
export const clientIdSchema = z.string().trim().min(1).max(2048);
