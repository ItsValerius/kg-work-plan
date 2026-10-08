import { UTCDate } from "@date-fns/utc";

/**
 * Date calculation utilities
 */

/**
 * Gets the start of today (UTC) minus 1 hour
 * This is used to determine which events are "future" vs "past"
 *
 * Memoized calculation - call this once per request/page load
 */
export function getStartOfToday(): Date {
  const startOfToday = new UTCDate();
  startOfToday.setHours(-1, 0, 0, 0);
  return startOfToday;
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
 * Formats a date range for display
 * @param start - Start date
 * @param end - End date
 * @param includeDate - Whether to include date in the range (default: true)
 * @returns Formatted date/time range string
 */
export function formatDateTimeRange(start: Date, end: Date, includeDate = true): string {
  if (includeDate) {
    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  return `${formatTime(start)} - ${formatTime(end)}`;
}

/**
 * Formats an event date range for display (used in event cards)
 * @param startDate - Event start date
 * @param endDate - Event end date
 * @returns Formatted date range string
 */
export function formatEventDateRange(startDate: Date, endDate: Date): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Berlin",
  };

  return (
    startDate.toLocaleDateString("DE-de", formatOptions) +
    " - " +
    endDate.toLocaleDateString("DE-de", formatOptions)
  );
}

const BERLIN = "Europe/Berlin";

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
