---
version: 1
slug: "src-app-dashboard-page-tsx"
primary_target: "src/app/organisation/page.tsx"
related_targets: ["src/components/features/dashboard/DashboardTabs.tsx"]
---

# Organizer dashboard: Veranstaltungs-Cockpit

Scope: `/organisation` for admins. Mode: Operate. Jobs (confirmed): check gaps before an event and recruit, print/export lists for the day, fix registrations, set up events. Most tedious today: finding where help is missing, and building events task by task (addressed with an inline quick-add on the event page).

Constraints: inherits DESIGN.md (Arbeitsplan / Vereinskalender family); German UI; desktop-first but must work on phones; the cross-event participants table (filters, bulk delete, CSV) stays reachable as "Alle Helfer".

## Direction contract

THESIS: The dashboard is one event at a time, like the Vorstand's event folder: pick an event in a date-led rail, and the pane shows its gaps first, then its full helper list ready to print. Refuses the category default of KPI stat-card grids and nested statistics tables.

OWN-WORLD: DESIGN.md family: white ground, wash #f5f7f2 rail, Barlow Condensed date numerals and counts, Arial body, club green for "needed" and the selected rail item, pale green only for the viewer's own state, flat ruled rows, no cards or shadows.

STORY: An organizer opens the dashboard and lands on the next event; they see at once which tasks still need people, plan shifts and tasks inline under "Planen", and before the day print the helper list or export it; wrong registrations are removed in place. All creation (events, shifts, tasks, duplicates) happens here, never on the helpers' pages.

FIRST VIEWPORT: Page title "Organisation" with a quiet "Alle Helfer" link; left 280px wash rail of upcoming events (date numeral, name, "noch 13 frei" in green / "voll"), selected item green-edged; right pane: date block, event title, open-spot summary, actions (Arbeitsplan öffnen, Bearbeiten); tabs "Lücken (n)" and "Helferliste"; Lücken lists open tasks per shift with counts and add tasks and shifts inline under "Planen". On phones the rail becomes an event picker above the pane.

FORM: Veranstaltungs-Cockpit (master-detail event folder), position 2 on the ranked list (dealt alternate, chosen by the user), seed key eca17474. Signature interaction: inline planning rows — a shift or task is added in one line under its shift and the plan updates in place (the WhatsApp "Aufruf kopieren" panel was removed at the user's request).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
