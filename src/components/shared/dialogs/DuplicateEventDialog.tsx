"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  berlinDaysBetween,
  fromBerlin,
  moveByBerlinDays,
  toBerlinInputParts,
} from "@/lib/datetime";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { duplicateEvent } from "@/server/actions/events";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const duplicateSchema = z
  .object({
    name: z.string().trim().min(1, "Bitte gib der Veranstaltung einen Namen."),
    startDate: z.date({
      error: (issue) =>
        issue.input === undefined ? "Startdatum ist erforderlich" : "Ungültiges Startdatum",
    }),
    endDate: z.date({
      error: (issue) =>
        issue.input === undefined ? "Enddatum ist erforderlich" : "Ungültiges Enddatum",
    }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Enddatum muss nach dem Startdatum liegen",
    path: ["endDate"],
  });

type DuplicateFormValues = z.infer<typeof duplicateSchema>;

export function DuplicateEventDialog({
  eventId,
  defaultName,
  defaultStartDate,
  defaultEndDate,
  trigger,
}: {
  eventId: string;
  defaultName: string;
  defaultStartDate: Date;
  defaultEndDate: Date;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Same calendar day next year (29 Feb becomes 1 Mar), at the same Berlin time.
  const defaultDates = useMemo(() => {
    const nextYear = (date: Date) => {
      const { day, time } = toBerlinInputParts(date);
      const [year, month, dayOfMonth] = day.split("-").map(Number);
      const shifted = new Date(Date.UTC(year + 1, month - 1, dayOfMonth))
        .toISOString()
        .slice(0, 10);
      return fromBerlin(shifted, time);
    };
    return { startDate: nextYear(defaultStartDate), endDate: nextYear(defaultEndDate) };
  }, [defaultStartDate, defaultEndDate]);

  const form = useForm<DuplicateFormValues>({
    resolver: zodResolver(duplicateSchema),
    defaultValues: {
      name: defaultName,
      ...defaultDates,
    },
  });
  const startDate = useWatch({ control: form.control, name: "startDate" });

  async function onSubmit(values: DuplicateFormValues) {
    setLoading(true);
    const result = await duplicateEvent(
      eventId,
      values.name,
      values.startDate,
      values.endDate,
    ).catch(() => ({ ok: false as const, error: "Fehler beim Duplizieren der Veranstaltung" }));
    if (!result.ok) {
      toast.error(result.error);
      setLoading(false);
      return;
    }
    toast.success("Veranstaltung wurde erfolgreich dupliziert");
    setOpen(false);
    // Open the copy, which usually needs adjusting next.
    router.push(`/organisation?event=${result.id}&ansicht=planen`);
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    setLoading(false);
    form.reset({
      name: defaultName,
      ...defaultDates,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Veranstaltung duplizieren</DialogTitle>
          <DialogDescription>
            Gib den Namen und die Daten für die neue Veranstaltung ein.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veranstaltungsname</FormLabel>
                  <FormControl>
                    <Input placeholder="Biwak..." {...field} />
                  </FormControl>
                  <FormDescription>Der Name der neuen Veranstaltung.</FormDescription>
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
                      onChange={(date) => {
                        // A moved start takes the end along, so the event keeps its length.
                        const days = berlinDaysBetween(field.value, date);
                        form.setValue(
                          "endDate",
                          moveByBerlinDays(form.getValues("endDate"), days),
                          {
                            shouldValidate: true,
                          },
                        );
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Das Startdatum der neuen Veranstaltung.</FormDescription>
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
                  <FormDescription>Das Enddatum der neuen Veranstaltung.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Wird dupliziert …
                  </>
                ) : (
                  "Duplizieren"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
