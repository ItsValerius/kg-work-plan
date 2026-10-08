import { users } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { idSchema } from "@/lib/validation";

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export const userUpdateSchema = createInsertSchema(users)
  .pick({
    id: true,
    name: true,
  })
  .extend({
    id: idSchema,
    name: z
      .string()
      .trim()
      .min(1, "Bitte gib deinen Namen ein.")
      .max(100, "Der Name ist zu lang (höchstens 100 Zeichen)."),
  });

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
