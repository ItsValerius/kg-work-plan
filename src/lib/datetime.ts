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
export function formatDateTimeRange(
  start: Date,
  end: Date,
  includeDate = true
): string {
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
