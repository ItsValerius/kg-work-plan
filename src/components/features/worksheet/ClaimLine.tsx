"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpForTask } from "@/server/actions/participants";
import { Loader2, Minus, PenLine, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

interface ClaimLineProps {
  eventId: string;
  taskId: string;
  taskName: string;
  lineNumber: number;
  openSpots: number;
  isLoggedIn: boolean;
}

/**
 * The first empty line of a sign-up sheet. Tapping it opens the choice right on the
 * line: sign up alone in one tap, or as a group with a name and headcount.
 */
export function ClaimLine({
  eventId,
  taskId,
  taskName,
  lineNumber,
  openSpots,
  isLoggedIn,
}: ClaimLineProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [asGroup, setAsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupSize, setGroupSize] = useState(Math.min(2, openSpots));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const groupNameId = useId();

  const lineNumberCell = (
    <span
      className="tabular font-display text-[22px] leading-none font-bold text-primary"
      aria-hidden="true"
    >
      {lineNumber}
    </span>
  );

  if (!isLoggedIn) {
    const callbackUrl = `/events/${eventId}#aufgabe-${taskId}`;
    return (
      <li className="grid grid-cols-[44px_1fr] items-center py-2 md:grid-cols-[52px_1fr]">
        {lineNumberCell}
        <Link
          href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="flex min-h-12 flex-col items-start justify-center gap-0.5 rounded-lg border-[1.5px] border-primary bg-background px-4 py-2 font-semibold text-primary transition-colors hover:bg-accent sm:flex-row sm:items-center sm:justify-between sm:gap-3"
        >
          <span className="flex items-center gap-2.5 whitespace-nowrap">
            <PenLine className="size-4" aria-hidden="true" />
            Hier eintragen
          </span>
          <span className="pl-[26px] text-sm font-normal text-muted-foreground sm:pl-0">
            Anmeldung nötig
          </span>
        </Link>
      </li>
    );
  }

  function close() {
    setIsOpen(false);
    setAsGroup(false);
    setError(null);
    triggerRef.current?.focus();
  }

  function submit(groupSignUp: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await signUpForTask({
        taskId,
        groupName: groupSignUp ? groupName : undefined,
        groupSize: groupSignUp ? groupSize : 1,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success(`Du bist eingetragen: ${taskName}`, {
        action: { label: "Meine Aufgaben", onClick: () => router.push("/meine-aufgaben") },
      });
      setIsOpen(false);
      router.replace(`/events/${eventId}?eingetragen=${taskId}#aufgabe-${taskId}`, {
        scroll: false,
      });
      router.refresh();
    });
  }

  return (
    <li className="grid grid-cols-[44px_1fr] items-start py-2 md:grid-cols-[52px_1fr]">
      <span className="flex min-h-12 items-center">{lineNumberCell}</span>
      <div>
        {!isOpen ? (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-expanded={false}
            aria-controls={panelId}
            className="flex min-h-12 w-full items-center gap-2.5 rounded-lg border-[1.5px] border-primary bg-background px-4 text-left font-semibold text-primary transition-colors hover:bg-accent"
          >
            <PenLine className="size-4" aria-hidden="true" />
            Hier eintragen
          </button>
        ) : (
          <div
            id={panelId}
            className="animate-reveal rounded-lg border-[1.5px] border-primary bg-surface-open p-4 md:p-5"
          >
            <p className="font-semibold text-foreground">Wie möchtest du dich eintragen?</p>

            {!asGroup ? (
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <Button onClick={() => submit(false)} disabled={isPending} autoFocus>
                  {isPending ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <PenLine aria-hidden="true" />
                  )}
                  {isPending ? "Wird eingetragen …" : "Allein eintragen"}
                </Button>
                {openSpots > 1 && (
                  <Button variant="outline" onClick={() => setAsGroup(true)} disabled={isPending}>
                    <Users aria-hidden="true" />
                    Als Gruppe eintragen
                  </Button>
                )}
                <Button variant="ghost" onClick={close} disabled={isPending} className="sm:ml-auto">
                  Abbrechen
                </Button>
              </div>
            ) : (
              <form
                className="mt-4 grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(true);
                }}
              >
                <div className="grid gap-1.5">
                  <Label htmlFor={groupNameId}>Name eurer Gruppe (optional)</Label>
                  <Input
                    id={groupNameId}
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="z. B. Familie Jansen"
                    autoFocus
                    className="h-12 bg-background text-base"
                  />
                </div>
                <div className="grid gap-1.5">
                  <span className="text-sm font-semibold" id={`${groupNameId}-size`}>
                    Wie viele seid ihr?{" "}
                    <span className="font-normal text-muted-foreground">
                      (noch {openSpots} frei)
                    </span>
                  </span>
                  <div
                    className="flex items-center gap-3"
                    role="group"
                    aria-labelledby={`${groupNameId}-size`}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setGroupSize((n) => Math.max(2, n - 1))}
                      disabled={groupSize <= 2}
                      aria-label="Eine Person weniger"
                    >
                      <Minus aria-hidden="true" />
                    </Button>
                    <output
                      className="tabular min-w-12 text-center font-display text-[32px] leading-none font-bold"
                      aria-live="polite"
                    >
                      {groupSize}
                    </output>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setGroupSize((n) => Math.min(openSpots, n + 1))}
                      disabled={groupSize >= openSpots}
                      aria-label="Eine Person mehr"
                    >
                      <Plus aria-hidden="true" />
                    </Button>
                    <span className="text-muted-foreground">Personen</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="animate-spin" aria-hidden="true" />
                    ) : (
                      <Users aria-hidden="true" />
                    )}
                    {isPending ? "Wird eingetragen …" : `Gruppe mit ${groupSize} eintragen`}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAsGroup(false)}
                    disabled={isPending}
                  >
                    Zurück
                  </Button>
                </div>
              </form>
            )}

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-md border border-destructive/30 bg-destructive-surface px-3 py-2.5 text-[15px] text-destructive"
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
