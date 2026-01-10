"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
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
import { shifts } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const response = await fetch(`/api/events/${eventId}/shifts`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
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
                <DateTimePicker setDate={field.onChange} date={field.value} />
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
                <DateTimePicker setDate={field.onChange} date={field.value} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">
          {loading ? <Loader2 className="animate-spin" /> : "Speichern"}
        </Button>
      </form>
    </Form>
  );
}
