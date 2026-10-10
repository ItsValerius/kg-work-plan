/** Editing is only reachable from Organisation, so edit pages return there. */
export function organisationBackLink(eventId: string, view: "luecken" | "planen") {
  return {
    href: `/organisation?event=${eventId}&ansicht=${view}`,
    label: "Zurück zur Organisation",
  };
}
