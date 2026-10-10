"use client";

import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useId } from "react";

interface EventPickerProps {
  events: { id: string; label: string }[];
  selectedId: string;
  view: string;
}

/** On phones the event rail collapses into this native picker. */
export function EventPicker({ events, selectedId, view }: EventPickerProps) {
  const router = useRouter();
  const id = useId();

  return (
    <div className="grid gap-1.5 md:hidden print:hidden">
      <Label htmlFor={id} className="text-[15px] font-semibold">
        Veranstaltung
      </Label>
      <select
        id={id}
        value={selectedId}
        onChange={(e) => router.push(`/organisation?event=${e.target.value}&ansicht=${view}`)}
        className="min-h-12 w-full rounded-md border border-input bg-background px-3 text-[17px]"
      >
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.label}
          </option>
        ))}
      </select>
    </div>
  );
}
