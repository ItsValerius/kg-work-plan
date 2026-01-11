"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./time-picker-input";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  // Note: Refs removed due to migration - focus handling needs to be reimplemented
  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Stunden
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          id="hours"
          onRightFocus={() => {
            const minutesInput = document.getElementById("minutes") as HTMLInputElement;
            minutesInput?.focus();
          }}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minuten
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          id="minutes"
          onLeftFocus={() => {
            const hoursInput = document.getElementById("hours") as HTMLInputElement;
            hoursInput?.focus();
          }}
          onRightFocus={() => {
            const secondsInput = document.getElementById("seconds") as HTMLInputElement;
            secondsInput?.focus();
          }}
        />
      </div>

      <div className="flex h-10 items-center">
        <Clock className="ml-2 size-4" />
      </div>
    </div>
  );
}
