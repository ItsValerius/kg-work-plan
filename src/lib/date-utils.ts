import { UTCDate } from "@date-fns/utc";

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
 * Formats a date range for display
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

