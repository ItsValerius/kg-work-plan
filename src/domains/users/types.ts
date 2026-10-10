import { users } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { idSchema } from "@/lib/validation";

export type User = typeof users.$inferSelect;

export const userUpdateSchema = createInsertSchema(users)
  .pick({
    id: true,
    name: true,
  })
  .extend({
    id: idSchema,
    // Empty is allowed: helpers who don't want their name shown stay "Ohne Namen".
    name: z.string().trim().max(100, "Der Name ist zu lang (höchstens 100 Zeichen)."),
  });

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
