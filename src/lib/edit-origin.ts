/** Editing is only reachable from Organisation, so edit pages return there. */
export function organisationBackLink(eventId: string, view: "luecken" | "planen") {
  return { href: `/dashboard?event=${eventId}&ansicht=${view}`, label: "Zurück zur Organisation" };
}
