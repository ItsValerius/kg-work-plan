"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { tasks } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@/domains/tasks/types";
import { AlertCircle, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      id: task?.id,
      name: task?.name || "",
      description: task?.description || "",
      createdById: userId,
      shiftId: shiftId,
      requiredParticipants: task?.requiredParticipants || 1,
      startTime: task?.startTime || new Date(),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof taskSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const response = await fetch(
      `/api/events/${eventId}/shifts/${shiftId}/tasks`,
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const data = await response.json();
      setError(data.error);
      setLoading(false);

      return;
    }
    redirect(`/events/${eventId}`);
  }
  return (
    <Form {...form}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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

        <Button type="submit">
          {" "}
          {loading ? <Loader2 className="animate-spin" /> : "Speichern"}
        </Button>
      </form>
    </Form>
  );
}
