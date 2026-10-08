"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { quickAddTask } from "@/server/actions/tasks";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

interface QuickAddTaskProps {
  eventId: string;
  shiftId: string;
  /** Shift start as "YYYY-MM-DD" and "HH:mm" in Berlin time, the default for a new task. */
  shiftDay: string;
  shiftStart: string;
}

/**
 * Organizer-only row at the end of a shift: name, start and headcount in one line,
 * so a whole shift can be filled with tasks without leaving the work plan.
 */
export function QuickAddTask({ eventId, shiftId, shiftDay, shiftStart }: QuickAddTaskProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const id = useId();

  if (!isOpen) {
    return (
      <div className="flex flex-wrap gap-2.5">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Plus aria-hidden="true" />
          Aufgabe hinzufügen
        </Button>
        <Link href={`/dashboard/events/${eventId}/shifts/${shiftId}/tasks/new`} className={cn(buttonVariants({ variant: "link", size: "sm" }), "px-2 text-muted-foreground")}>mit Beschreibung …</Link>
      </div>
    );
  }

  function submit(formData: FormData) {
    setError(null);
    const time = String(formData.get("start") || shiftStart);
    startTransition(async () => {
      const result = await quickAddTask({
        shiftId,
        name: String(formData.get("name") ?? ""),
        startTime: new Date(`${shiftDay}T${time}`),
        requiredParticipants: Number(formData.get("count")),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success(`Aufgabe „${String(formData.get("name")).trim()}“ angelegt.`);
      formRef.current?.reset();
      nameRef.current?.focus();
      router.refresh();
    });
  }

  return (
    <form
      ref={formRef}
      action={submit}
      className="animate-reveal grid gap-3 rounded-lg bg-muted p-4 sm:grid-cols-[1fr_136px_110px_auto] sm:items-end"
    >
      <div className="grid gap-2.5">
        <Label htmlFor={`${id}-name`}>Neue Aufgabe</Label>
        <Input ref={nameRef} id={`${id}-name`} name="name" placeholder="z. B. Garderobe" required autoFocus className="bg-background" />
      </div>
      <div className="grid gap-2.5">
        <Label htmlFor={`${id}-start`}>Beginn</Label>
        <Input id={`${id}-start`} name="start" type="time" defaultValue={shiftStart} required className="bg-background tabular" />
      </div>
      <div className="grid gap-2.5">
        <Label htmlFor={`${id}-count`}>Helfer</Label>
        <Input id={`${id}-count`} name="count" type="number" min={1} max={99} defaultValue={2} required className="bg-background tabular" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Plus aria-hidden="true" />}
          {isPending ? "Wird angelegt …" : "Anlegen"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isPending}>
          Fertig
        </Button>
      </div>
      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive-surface px-3 py-2.5 text-[15px] text-destructive sm:col-span-4">
          {error}
        </p>
      )}
    </form>
  );
}
