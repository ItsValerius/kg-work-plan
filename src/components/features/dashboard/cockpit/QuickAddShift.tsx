"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { quickAddShift } from "@/server/actions/shifts";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

interface QuickAddShiftProps {
  eventId: string;
  /** The event's day ("YYYY-MM-DD", Berlin) and a suggested start ("HH:mm"). */
  eventDay: string;
  suggestedStart: string;
  /** Opens straight away when the event has no shifts yet. */
  startOpen?: boolean;
}

function addHours(time: string, hours: number) {
  const [h, m] = time.split(":").map(Number);
  return `${String(Math.min(23, h + hours)).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Inline row for adding a shift: name, start and end on the event's day. */
export function QuickAddShift({
  eventId,
  eventDay,
  suggestedStart,
  startOpen = false,
}: QuickAddShiftProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(startOpen);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  if (!isOpen) {
    return (
      <div className="flex flex-wrap gap-2.5">
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Plus aria-hidden="true" />
          Schicht hinzufügen
        </Button>
        <Link
          href={`/dashboard/events/${eventId}/shifts/new`}
          className={cn(buttonVariants({ variant: "link" }), "px-2 text-muted-foreground")}
        >
          an einem anderen Tag …
        </Link>
      </div>
    );
  }

  function submit(formData: FormData) {
    setError(null);
    const name = String(formData.get("name") ?? "");
    startTransition(async () => {
      const result = await quickAddShift({
        eventId,
        name,
        startTime: new Date(`${eventDay}T${String(formData.get("start"))}`),
        endTime: new Date(`${eventDay}T${String(formData.get("end"))}`),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success(`Schicht „${name.trim()}“ angelegt.`);
      formRef.current?.reset();
      setIsOpen(false);
      router.refresh();
    });
  }

  return (
    <form
      ref={formRef}
      action={submit}
      className="grid animate-reveal gap-3 rounded-lg border-[1.5px] border-primary bg-surface-open p-4 sm:grid-cols-[1fr_136px_136px_auto] sm:items-end"
    >
      <div className="grid gap-2.5">
        <Label htmlFor={`${id}-name`}>Neue Schicht</Label>
        <Input
          id={`${id}-name`}
          name="name"
          placeholder="z. B. Aufbau"
          required
          autoFocus
          className="bg-background"
        />
      </div>
      <div className="grid gap-2.5">
        <Label htmlFor={`${id}-start`}>Beginn</Label>
        <Input
          id={`${id}-start`}
          name="start"
          type="time"
          defaultValue={suggestedStart}
          required
          className="tabular bg-background"
        />
      </div>
      <div className="grid gap-2.5">
        <Label htmlFor={`${id}-end`}>Ende</Label>
        <Input
          id={`${id}-end`}
          name="end"
          type="time"
          defaultValue={addHours(suggestedStart, 3)}
          required
          className="tabular bg-background"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <Plus aria-hidden="true" />
          )}
          {isPending ? "Wird angelegt …" : "Anlegen"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isPending}>
          Abbrechen
        </Button>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive-surface px-3 py-2.5 text-[15px] text-destructive sm:col-span-4"
        >
          {error}
        </p>
      )}
    </form>
  );
}
