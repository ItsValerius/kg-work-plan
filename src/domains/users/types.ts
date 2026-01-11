import { users } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export const userUpdateSchema = createInsertSchema(users).pick({
  id: true,
  name: true,
}).extend({
  name: z.string().optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
