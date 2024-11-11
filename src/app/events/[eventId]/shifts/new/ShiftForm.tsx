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
import { TimePicker } from "@/components/ui/time-picker";
import { shifts } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(shifts);

export function ShiftForm({
  userId,
  eventId,
  shift,
}: {
  userId: string;
  eventId: string;
  shift: typeof shifts.$inferSelect | null | undefined;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: shift?.id,
      name: shift?.name || "",
      startTime: shift?.startTime || new Date(),
      endTime: shift?.endTime || new Date(),
      createdById: userId,
      eventId: eventId,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await fetch(`/api/events/${eventId}/shifts`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    redirect(`/events/${eventId}`);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schichtname</FormLabel>
              <FormControl>
                <Input placeholder="1. Schicht..." {...field} />
              </FormControl>
              <FormDescription>Der Name der Schicht.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Startzeit</FormLabel>
              <FormControl>
                <TimePicker setDate={field.onChange} date={field.value} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Endzeit</FormLabel>
              <FormControl>
                <TimePicker setDate={field.onChange} date={field.value} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">{shift ? "Bearbeiten" : "Erstellen"}</Button>
      </form>
    </Form>
  );
}
