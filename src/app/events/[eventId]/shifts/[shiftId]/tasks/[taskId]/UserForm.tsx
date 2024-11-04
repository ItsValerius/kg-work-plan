"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { taskParticipants, tasks, users } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(taskParticipants).extend({
  groupName: z.string().optional(),
  groupSize: z.number().optional(),
});
export function UserForm({
  userId,
  taskId,
  shiftId,
  eventId,
}: {
  userId: string;
  taskId: string;
  shiftId: string;
  eventId: string;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      groupSize: 1,
      createdById: userId,
      taskId: taskId,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await fetch(
      `/api/events/${eventId}/shifts/${shiftId}/tasks/${taskId}/users`,
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gruppen Name</FormLabel>
              <FormControl>
                <Input placeholder="Max Mustermann & Freunde..." {...field} />
              </FormControl>
              <FormDescription>Der Name der Gruppe.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gruppengröße</FormLabel>
              <FormControl>
                <Input
                  placeholder="1"
                  {...field}
                  type="number"
                  onChange={(event) => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormDescription>
                Die Anzahl der Gruppenmitglieder.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Anmelden</Button>
      </form>
    </Form>
  );
}
