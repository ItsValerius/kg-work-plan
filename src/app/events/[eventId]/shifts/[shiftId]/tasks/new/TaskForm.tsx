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
import { tasks } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(tasks);

export function TaskForm({
  userId,
  shiftId,
  eventId,
  task,
}: {
  userId: string;
  shiftId: string;
  eventId: string;
  task: typeof tasks.$inferSelect | null | undefined;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: task?.id,
      name: task?.name || "",
      description: task?.description || "",
      createdById: userId,
      shiftId: shiftId,
      requiredParticipants: task?.requiredParticipants || 1,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const res = await fetch(`/api/events/${eventId}/shifts/${shiftId}/tasks`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    console.log(values);
    console.log(json);
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
              <FormLabel>Aufgabenname</FormLabel>
              <FormControl>
                <Input placeholder="Spülen..." {...field} />
              </FormControl>
              <FormDescription>Das ist der Name der Aufgabe.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aufgabenbeschreibung</FormLabel>
              <FormControl>
                <Input placeholder="Erste Spüle Links..." {...field} />
              </FormControl>
              <FormDescription>
                Eine kurze Beschreibung der Aufgabe.{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requiredParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mind. Benötigte Helfer</FormLabel>
              <FormControl>
                <Input
                  placeholder="1"
                  {...field}
                  type="number"
                  onChange={(event) => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormDescription>
                Die Mindestens benötigte Anzahl an Helfern.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{task ? "Bearbeiten" : "Erstellen"}</Button>
      </form>
    </Form>
  );
}
