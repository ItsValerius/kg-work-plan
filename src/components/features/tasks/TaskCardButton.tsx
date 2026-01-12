"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface TaskCardButtonProps {
  eventId: string;
  shiftId: string;
  taskId: string;
  isFull: boolean;
  isUserAssigned: boolean;
}

export function TaskCardButton({
  eventId,
  shiftId,
  taskId,
  isFull,
  isUserAssigned,
}: TaskCardButtonProps) {
  if (isUserAssigned) {
    return (
      <Button
        asChild
        variant="outline"
        className="whitespace-nowrap w-full h-10 md:h-11 text-sm md:text-base font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Link
          href={`/events/${eventId}/shifts/${shiftId}/tasks/${taskId}`}
          className="flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="size-4" />
          Teilnahme bearbeiten
        </Link>
      </Button>
    );
  }

  if (isFull) {
    return (
      <Button
        disabled
        className="whitespace-nowrap disabled:cursor-not-allowed w-full h-10 md:h-11 text-sm md:text-base font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
      >
        Vollständig besetzt
      </Button>
    );
  }

  return (
    <Button
      asChild
      className="whitespace-nowrap w-full h-10 md:h-11 text-sm md:text-base font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Link
        href={`/events/${eventId}/shifts/${shiftId}/tasks/${taskId}`}
        className="flex items-center justify-center"
      >
        Zur Aufgabe anmelden
      </Link>
    </Button>
  );
}
