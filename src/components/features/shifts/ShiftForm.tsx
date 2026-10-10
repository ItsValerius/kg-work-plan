"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { berlinTimeFrom, fromBerlin, toBerlinInputParts } from "@/lib/datetime";
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
import { shiftSchema } from "@/domains/shifts/types";
import { AlertCircle, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { saveShift } from "@/server/actions/shifts";

const SAVE_FAILED = "Die Schicht konnte nicht gespeichert werden. Bitte versuch es noch einmal.";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function ShiftForm({
  userId,
  eventId,
  eventStart,
  shift,
  returnTo,
}: {
  userId: string;
  eventId: string;
  /** New shifts start on the event's first day. */
  eventStart: Date;
  shift: typeof shifts.$inferSelect | null | undefined;
  /** Where to go after saving an edit; defaults to the event's work plan. */
  returnTo?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof shiftSchema>>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      id: shift?.id,
      name: shift?.name || "",
      startTime: shift?.startTime ?? fromBerlin(toBerlinInputParts(eventStart).day, "18:00"),
      endTime: shift?.endTime ?? fromBerlin(toBerlinInputParts(eventStart).day, "22:00"),
      createdById: userId,
      eventId: eventId,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof shiftSchema>) {
    setLoading(true);
    const result = await saveShift(values).catch(() => ({
      ok: false as const,
      error: SAVE_FAILED,
    }));
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    redirect(
      shift
        ? (returnTo ?? `/veranstaltungen/${eventId}`)
        : `/organisation?event=${eventId}&ansicht=planen`,
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
          render={({ field }) => {
            const { day, time } = toBerlinInputParts(field.value);
            // Moving the start keeps the shift's end time and length rules (end after start).
            const setStart = (start: Date) => {
              field.onChange(start);
              const endTime = toBerlinInputParts(form.getValues("endTime")).time;
              form.setValue("endTime", berlinTimeFrom(start, endTime), { shouldValidate: true });
            };
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Tag und Beginn</FormLabel>
                <div className="flex flex-wrap gap-3">
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={(date) => setStart(fromBerlin(toBerlinInputParts(date).day, time))}
                    />
                  </FormControl>
                  <Input
                    type="time"
                    aria-label="Beginn"
                    className="w-36"
                    value={time}
                    onChange={(event) =>
                      event.target.value && setStart(fromBerlin(day, event.target.value))
                    }
                  />
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ende</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  className="w-36"
                  value={toBerlinInputParts(field.value).time}
                  onChange={(event) =>
                    event.target.value &&
                    field.onChange(berlinTimeFrom(form.getValues("startTime"), event.target.value))
                  }
                />
              </FormControl>
              <FormDescription>
                Endet sie vor dem Beginn, liegt das Ende am nächsten Tag.
              </FormDescription>
              <FormMessage />
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
