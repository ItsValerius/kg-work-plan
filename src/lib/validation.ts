import { z } from "zod";

/**
 * Shared input validation. Server actions are public endpoints, so every one of them
 * parses its arguments with a schema before touching the database.
 */

/** Record ids: generated UUIDs, or readable ids like the demo seed's "demo-…". */
export const idSchema = z.string().trim().min(1).max(64);

export const idListSchema = z.array(idSchema).min(1).max(500);

export const INVALID_INPUT = "Ungültige Eingabe.";

/** Parses or throws a generic error, for actions whose callers expect a throw. */
export function parseOrThrow<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(INVALID_INPUT);
  }
  return result.data;
}

/** The first readable message of a failed parse, for actions that return errors. */
export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? INVALID_INPUT;
}

/**
 * What server actions return when the user must see why they failed: production builds
 * replace thrown messages with a generic one, so expected errors are return values
 * (Next.js docs: Getting Started → Error Handling → "Handling expected errors").
 */
export type ActionResult = { ok: true } | { ok: false; error: string };
