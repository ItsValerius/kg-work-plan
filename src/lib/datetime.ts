const BERLIN = "Europe/Berlin";

/*
  Dates are stored as UTC instants. Everything people see or type is Berlin wall-clock
  time: inputs go through fromBerlin(), output through the format helpers below.
*/

/** The instant of a Berlin wall-clock time, e.g. fromBerlin("2026-11-11", "20:00"). */
export function fromBerlin(day: string, time = "00:00"): Date {
  const asUtc = Date.parse(`${day}T${time}:00Z`);
  // Berlin's offset at an instant: how far its wall clock runs ahead of UTC.
  const offset = (instant: number) => {
    const { day, time } = toBerlinInputParts(new Date(instant));
    return Date.parse(`${day}T${time}:00Z`) - instant;
  };
  // Twice, so a time on a DST-change day picks up that day's offset.
  return new Date(asUtc - offset(asUtc - offset(asUtc)));
}

/** A Berlin time on `start`'s day, or the next day when it would fall before `start` (night shifts). */
export function berlinTimeFrom(start: Date, time: string): Date {
  const { day } = toBerlinInputParts(start);
  const date = fromBerlin(day, time);
  return date < start ? fromBerlin(addDays(day, 1), time) : date;
}

/** Today's Berlin calendar day ("YYYY-MM-DD"); compare days as these strings. */
export function berlinToday(): string {
  return toBerlinInputParts(new Date()).day;
}

/** A Berlin day string moved by whole days. */
export function addDays(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Whole Berlin calendar days from one date to another. */
export function berlinDaysBetween(from: Date, to: Date): number {
  const day = (date: Date) => Date.parse(`${toBerlinInputParts(date).day}T00:00:00Z`);
  return Math.round((day(to) - day(from)) / 86_400_000);
}

/** The same Berlin wall-clock time a number of days later, correct across DST changes. */
export function moveByBerlinDays(date: Date, days: number): Date {
  const { day, time } = toBerlinInputParts(date);
  return fromBerlin(addDays(day, days), time);
}

/**
 * Date formatting utilities
 */

/**
 * Formats a date to German locale (dd.mm.yyyy)
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    timeZone: "Europe/Berlin",
  });
}

/**
 * Formats a time to German locale (HH:mm)
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "numeric",
    minute: "numeric",
  });
}

/**
 * Splits a date into the pieces of a calendar date block: "20", "Fr.", "Nov."
 */
export function getDateParts(date: Date) {
  return {
    day: date.toLocaleDateString("de-DE", { timeZone: BERLIN, day: "numeric" }).replace(".", ""),
    weekday: date.toLocaleDateString("de-DE", { timeZone: BERLIN, weekday: "short" }),
    month: date.toLocaleDateString("de-DE", { timeZone: BERLIN, month: "short" }),
    year: date.toLocaleDateString("de-DE", { timeZone: BERLIN, year: "numeric" }),
  };
}

/**
 * Formats a date as "Fr., 20. Nov." (with the year when it differs from today's)
 */
export function formatShortDate(date: Date): string {
  const sameYear =
    date.toLocaleDateString("de-DE", { timeZone: BERLIN, year: "numeric" }) ===
    new Date().toLocaleDateString("de-DE", { timeZone: BERLIN, year: "numeric" });
  return date.toLocaleDateString("de-DE", {
    timeZone: BERLIN,
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

/**
 * True when both dates fall on the same calendar day in Berlin.
 */
export function isSameBerlinDay(a: Date, b: Date): boolean {
  return formatDate(a) === formatDate(b);
}

/**
 * A date's Berlin calendar day ("YYYY-MM-DD") and time ("HH:mm"), as date/time inputs expect them.
 */
export function toBerlinInputParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BERLIN,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

/** "9. Oktober 2026" */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    timeZone: BERLIN,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "09.10.2026, 20:00" */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)}, ${formatTime(date)}`;
}
