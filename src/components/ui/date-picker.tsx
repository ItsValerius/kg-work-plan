"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatLongDate, fromBerlin, toBerlinInputParts } from "@/lib/datetime";

/**
 * A Berlin calendar day as a button with a calendar popover. `onChange` gets midnight
 * Berlin time of the picked day; days before `min` or after `max` can't be picked.
 */
export function DatePicker({
  value,
  onChange,
  min,
  max,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "value" | "onChange"> & {
  value: Date | undefined;
  onChange: (date: Date) => void;
  min?: Date;
  max?: Date;
}) {
  const [open, setOpen] = useState(false);
  const minDay = min && toBerlinInputParts(min).day;
  const maxDay = max && toBerlinInputParts(max).day;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !value && "text-muted-foreground",
              className,
            )}
            {...props}
          >
            {value ? formatLongDate(value) : <span>Datum wählen</span>}
            <CalendarIcon className="ml-auto size-4 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          required
          selected={value}
          onSelect={(date) => {
            if (!date) return;
            onChange(fromBerlin(toBerlinInputParts(date).day));
            setOpen(false);
          }}
          disabled={
            minDay || maxDay
              ? (date) => {
                  const day = toBerlinInputParts(date).day;
                  return (!!minDay && day < minDay) || (!!maxDay && day > maxDay);
                }
              : undefined
          }
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
