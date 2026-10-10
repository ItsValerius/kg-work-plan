---
version: 1
slug: "src-app-events-eventid-page-tsx"
primary_target: "src/app/veranstaltungen/[eventId]/page.tsx"
related_targets: ["src/app/veranstaltungen/page.tsx","src/app/meine-aufgaben/page.tsx","src/app/(auth)/anmelden/page.tsx"]
---

# Helper journey: Arbeitsplan

Scope: the helper journey — events list (`/veranstaltungen`), event work plan (`/veranstaltungen/[eventId]`), inline sign-up, Meine Aufgaben, sign-in. Mode: Operate. Admin dashboard is a later round; admin controls on these pages stay available but quiet.

Audience/job: members of all ages plus friends & family, on phones from a shared link and on desktop; find where help is missing and claim a spot with minimal effort. Some use Meine Aufgaben on the event day to check when/where they're needed.

Constraints: visual system inherited from the sibling kg-eventplan "Vereinskalender" (club green #176717, Barlow Condensed display, Arial body, flat surfaces, no shadows); keep the club crest. Participant names are visible only to signed-in users; signed-out visitors see filled lines as "belegt".

## Direction contract

THESIS: Each task is the club's paper sign-up sheet ("Aushang"): numbered lines equal to the headcount, filled lines show who's coming, the first empty line is the action. Refuses the category default of grids of same-size task cards with progress bars and a separate sign-up page.

OWN-WORLD: Vereinskalender family — white ground, Barlow Condensed bold for event titles, dates and line numbers, Arial body; club green for the claim action and own entry, pale green #e2f9c5 for your own claimed line, wash #f5f7f2 for the left time rail, 1px line #dce3d9 rules between sheet lines; no cards, no shadows.

STORY: A helper opens the event, sees per shift which tasks still have empty lines, taps "Hier eintragen" on the first empty line, chooses alone or as a group inline, and sees their name written onto the sheet; Meine Aufgaben then reads like a personal date-led duty list.

FIRST VIEWPORT: Crest + "Arbeitsplan" wordmark header with nav; event title in display type with a large date numeral block and a one-line need summary ("Noch 7 Plätze frei"); then the first shift: time + shift name in a sticky left rail (stacked above on phones), tasks as ruled sheets with numbered lines; the first empty line is a full-width green-outlined claim row — the primary action.

FORM: Aushang (paper sign-up sheet), position 3 on the ranked list (dealt lead), seed key e441cb0e. Signature interaction: claiming a line expands it inline into "Allein eintragen" / "Als Gruppe" and, on success, the line fills with your name in pale green.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
