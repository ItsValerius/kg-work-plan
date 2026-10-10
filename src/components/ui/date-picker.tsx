"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatLongDate, fromBerlin, toBerlinInputParts } from "@/lib/datetime";

/**
 * A Berlin calendar day as a button with a calendar popover. `onChange` gets midnight
 * Berlin time of the picked day; days before `min` can't be picked.
 */
export function DatePicker({
  value,
  onChange,
  min,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "value" | "onChange"> & {
  value: Date | undefined;
  onChange: (date: Date) => void;
  min?: Date;
}) {
  const minDay = min && toBerlinInputParts(min).day;
  return (
    <Popover>
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
          selected={value}
          onSelect={(date) => date && onChange(fromBerlin(toBerlinInputParts(date).day))}
          disabled={minDay ? (date) => toBerlinInputParts(date).day < minDay : undefined}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
