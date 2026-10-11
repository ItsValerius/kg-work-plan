"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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
import { DatePicker } from "@/components/ui/date-picker";
import { berlinDaysBetween, berlinToday, fromBerlin, moveByBerlinDays } from "@/lib/datetime";
import { events } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/domains/events/types";
import { AlertCircle, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { saveEvent } from "@/server/actions/events";

const SAVE_FAILED =
  "Die Veranstaltung konnte nicht gespeichert werden. Bitte versuch es noch einmal.";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

export function EventForm({
  userId,
  event,
  returnTo,
}: {
  userId: string;
  event: typeof events.$inferSelect | null | undefined;
  /** Where to go after saving an edit; defaults to the event's work plan. */
  returnTo?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      id: event?.id,
      name: event?.name || "",
      startDate: event?.startDate ?? fromBerlin(berlinToday()),
      endDate: event?.endDate ?? fromBerlin(berlinToday()),
      description: event?.description || "",
      createdById: userId,
    },
  });

  const startDate = useWatch({ control: form.control, name: "startDate" });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof eventSchema>) {
    setLoading(true);
    const result = await saveEvent(values).catch(() => ({
      ok: false as const,
      error: SAVE_FAILED,
    }));
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    // New events continue straight into planning shifts and tasks.
    redirect(
      event
        ? (returnTo ?? `/veranstaltungen/${event.id}`)
        : `/organisation?event=${result.id}&ansicht=planen`,
    );
  }

  return (
    <Form {...form}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
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
              <FormLabel>Veranstaltungsname</FormLabel>
              <FormControl>
                <Input placeholder="Biwak..." {...field} />
              </FormControl>
              <FormDescription>Das ist der Name der Veranstaltung</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschreibung</FormLabel>
              <FormControl>
                <Input placeholder="Aufbau..." {...field} />
              </FormControl>
              <FormDescription>Das ist eine kurze Beschreibung der Veranstaltung.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Startdatum</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  min={new Date()}
                  onChange={(date) => {
                    // A moved start takes the end along, so the event keeps its length.
                    const days = berlinDaysBetween(field.value, date);
                    form.setValue("endDate", moveByBerlinDays(form.getValues("endDate"), days), {
                      shouldValidate: true,
                    });
                    field.onChange(date);
                  }}
                />
              </FormControl>
              <FormDescription>Das Startdatum der Veranstaltung.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Enddatum</FormLabel>
              <FormControl>
                <DatePicker value={field.value} min={startDate} onChange={field.onChange} />
              </FormControl>
              <FormDescription>Das Enddatum der Veranstaltung.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
          {loading ? "Wird gespeichert …" : "Speichern"}
        </Button>
      </form>
    </Form>
  );
}
