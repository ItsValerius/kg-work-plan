export function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    timeZone: "Europe/Berlin",
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "numeric",
    minute: "numeric",
  });
}

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
