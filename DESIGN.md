---
name: "KG Knallköpp Golkrath Arbeitsplan"
description: "The club's paper sign-up sheet in Vereinskalender green: numbered lines, big condensed dates, one green line to claim."
colors:
  green: "#176717"
  green-dark: "#124d22"
  ink: "#17251c"
  muted: "#5b685e"
  pale: "#e2f9c5"
  wash: "#f5f7f2"
  line: "#dce3d9"
  white: "#ffffff"
  field-border: "#7f8e7c"
  open-panel: "#fafcf7"
  focus: "#439537"
  error-bg: "#fff0eb"
  error-ink: "#9a3524"
  danger: "#a33928"
  scrim: "rgb(23 37 28 / 0.32)"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(56px, 5.7vw, 80px)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.02em"
  display-compact:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.02em"
  panel-title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.02em"
  date-large:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "72px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  date:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  shift-time:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1
  line-number:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1
  wordmark:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "27px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "17px"
    lineHeight: 1.5
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
  meta:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "15px"
    lineHeight: 1.5
  button:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.25
rounded:
  tag: "3px"
  field: "5px"
  control: "6px"
  panel: "12px"
spacing:
  4: "4px"
  8: "8px"
  12: "12px"
  16: "16px"
  20: "20px"
  24: "24px"
  32: "32px"
  40: "40px"
  48: "48px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "8px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.green-dark}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "8px 20px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.wash}"
  button-ghost:
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "8px 20px"
    height: "44px"
  button-danger-hover:
    backgroundColor: "{colors.error-ink}"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
    height: "44px"
  claim-line:
    backgroundColor: "{colors.white}"
    textColor: "{colors.green}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "48px"
  claim-line-hover:
    backgroundColor: "{colors.pale}"
  claim-panel:
    backgroundColor: "{colors.open-panel}"
    rounded: "{rounded.control}"
    padding: "20px"
  own-line:
    backgroundColor: "{colors.pale}"
    textColor: "{colors.green-dark}"
    rounded: "{rounded.field}"
    padding: "12px 8px"
  own-tag:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "2px 6px"
  shift-rail:
    backgroundColor: "{colors.wash}"
    rounded: "{rounded.control}"
    padding: "24px 20px"
    width: "264px"
  form-panel:
    backgroundColor: "{colors.wash}"
    rounded: "{rounded.panel}"
    padding: "36px"
  header:
    backgroundColor: "{colors.white}"
    height: "64px"
  toast:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.field}"
  dialog:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "32px"
    width: "calc(100% - 2rem)"
  dialog-title:
    textColor: "{colors.ink}"
    typography: "{typography.panel-title}"
  menu-item:
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.tag}"
    padding: "10px 12px"
  menu-item-highlight:
    backgroundColor: "{colors.pale}"
    textColor: "{colors.green-dark}"
  alert-error:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error-ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.control}"
    padding: "16px"
  event-rail:
    backgroundColor: "{colors.wash}"
    rounded: "{rounded.control}"
    padding: "8px"
    width: "280px"
  event-rail-item-selected:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "12px 12px 12px 8px"
  pane-tab:
    textColor: "{colors.muted}"
    padding: "0 16px"
    height: "48px"
  pane-tab-active:
    textColor: "{colors.green}"
  quick-add:
    backgroundColor: "{colors.wash}"
    rounded: "{rounded.control}"
    padding: "16px"
  quick-add-shift:
    backgroundColor: "{colors.open-panel}"
    rounded: "{rounded.control}"
    padding: "16px"
  email-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "32px 28px"
  email-button:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "15px 30px"
---

# Design System: KG Knallköpp Golkrath Arbeitsplan

## Overview

**Creative North Star: "Aushang"**

The Arbeitsplan is a member of the kg-eventplan "Vereinskalender" family (`~/projects/kg-eventplan/DESIGN.md`). It uses the same club green on white, the same green-tinted neutrals, Barlow Condensed Bold for dates and headings, Arial for reading text, and the same flat surfaces. Its own expression is the club's paper sign-up sheet pinned to the noticeboard. Each task is a ruled sheet with one numbered line per helper needed. Filled lines show who is coming. The first empty line is a green-outlined row, and it is the main action on the page.

Organizers get the same sheet seen from the Vorstand's side: an event folder. A wash rail lists the events by date, and the pane shows one event's gaps first, its full helper list ready to print, and a "Planen" view where shifts and tasks are added one line at a time. Counts stay in the display face, and every list keeps the sheet's ruled lines. All creation lives in this folder; the helpers' pages only link into it.

The density is generous on purpose. The users include older members on phones, so body text is 16px, lead text 17px, buttons 15px semibold and every control is at least 44px tall. The display face adds the celebration. Controls stay plain, clearly labelled and familiar.

This app deliberately differs from its parent in two places. Body text is 16px instead of 15px, and buttons are 15px semibold instead of 13px, for legibility. A sticky header with the crest, wordmark and navigation is kept, while kg-eventplan removed its nav. The footer and the dark theme match kg-eventplan: dark mode follows the system until someone uses the footer toggle (remembered per browser), and it applies on screen only, so printouts stay light.

**Key Characteristics:**

- Ruled, numbered sheet lines instead of task cards or progress bars.
- Date-led rows anchored by a large condensed green day numeral.
- One green-outlined claim line per sheet. Your own line fills pale green.
- A wash time rail for each shift, sticky on desktop and stacked above the tasks on phones.
- Flat white ground with 1px green-grey rules and no shadows, overlays included.
- For organizers, a date-led event rail beside one event's pane: gaps first, a printable helper list, and inline planning rows.

## Colors

Club green carries action and "still needed". Pale green marks what is yours. Green-tinted greys keep dense schedules calm. The frontmatter values are normative and mirror `:root` in `src/app/globals.css`.

### Primary

- **Club Green** (`green`): primary buttons, the claim line's outline and text, open-spot sentences ("Noch 7 Plätze frei"), upcoming date numerals, shift start times, active nav underline and the "du" tag.
- **Deep Club Green** (`green-dark`): primary hover, and text on pale green (your name, line number and "Ändern" on your own line, the "Dein nächster Einsatz" heading).
- **Pale Celebration Green** (`pale`): your own claimed line, claim-line hover, the active mobile nav item and text selection. The "Dein nächster Einsatz" panel uses it at 40%.

### Secondary

- **Error Ink / Error Wash** (`error-ink`, `error-bg`): the error pair. Inline error messages and the destructive alert sit on error wash with error-ink text and a 30% error-ink border. Error wash is also the hover fill for the "Austragen" ghost action.
- **Danger** (`danger`): fill for confirmed destructive actions only ("Ja, austragen"). Hover moves it to error ink.

### Neutral

- **White** (`white`): page, fields, header, toasts and the claim line at rest.
- **Ink** (`ink`): primary text. A 2px ink rule at 80% opacity opens each task sheet.
- **Muted** (`muted`): metadata, past dates, filled-line placeholders ("belegt"), the totals in tallies.
- **Wash** (`wash`): shift rail, organizer event rail, quick-add task row, form-page panels, sign-in, empty-state and error panels, row hover, the event page's organizer bar and the sign-in email's canvas.
- **Line** (`line`): every 1px divider (`* { border-color }`) and the sheet-line rules.
- **Field Border** (`field-border`): input and outline-button strokes, the numerals of quiet empty lines, and the scrollbar thumb.
- **Open Panel** (`open-panel`): the expanded claim panel and the quick-add shift row.
- **Focus Green** (`focus`): the global focus outline.
- **Scrim** (`scrim`): the ink-tinted veil behind every dialog, alert dialog and sheet (`--scrim`). It replaces a black overlay so the page stays readable and green-grey underneath.

**The Green Means Needed Rule.** Club green marks two things: an action you can take and a place that is still free. Full tasks, past events and filled counts drop to muted.

**The Pale Is Yours Rule.** Pale green fill is reserved for things that belong to the viewer, such as your claimed line, your next duty or the "Alles besetzt" all-clear for your event. Other rows are never tinted with it at rest. Short-lived highlights are the only exception: claim-line hover, the highlighted menu or select item, the active mobile nav item and text selection.

## Typography

**Display Font:** Barlow Condensed Bold, self-hosted woff2 through `next/font/local` as `--font-barlow` (fallback "Arial Narrow", sans-serif)
**Body Font:** Arial, Helvetica, sans-serif
**Email:** Arial only. Mail clients can't load the self-hosted display face, so the sign-in email deliberately sets its wordmark, heading and button in Arial bold in place of Barlow.

**Character:** The heavy condensed face does the celebrating and the counting: dates, times, line numbers and tallies. Arial keeps names and instructions plain. Every numeral uses tabular figures (the `.tabular` utility).

### Hierarchy

- **Display** (700, 48px on mobile, then `clamp(56px, 5.7vw, 80px)`, 1.03, -0.02em): the page h1 on Veranstaltungen, Meine Aufgaben and the event title (44px on mobile). Sign-in and not-found use 62px on desktop.
- **Headline** (700, 44px, 1.03): section h2 ("Vergangene Veranstaltungen", "Danach"), 32–34px on mobile.
- **Panel title** (700, 32px): empty states, the next-duty panel and every dialog and alert-dialog title. Shift names are 30px on mobile and 34px on desktop.
- **Date** (700, 40/44px for rows, 56/72px large in event headers and the next duty, line-height 1): the day numeral. Beside it, weekday and month are 12px semibold uppercase (13/15px in the large size). The weekday is green, the month is ink, and both are muted when past.
- **Shift time** (700, 34/36px): start time in green, end time muted.
- **Line number** (700, 22px): the sheet's line column. Muted when filled, green on the claim line, deep green on your line, field-border on quiet empty lines.
- **Tally** (700, 30px filled count with a 20px muted "/required"), with a 12px semibold uppercase "N frei" / "voll" under it. In the organizer cockpit, gap counts are 32px green numerals over an uppercase "frei". Helper-list tallies are a 22px "filled/required" followed by 15px semibold "N frei" / "voll", and shift times on those lists are 22px green. In Planen, shift time ranges are 22px green and each task carries a 22px "filled/required" tally, green while spots are open and muted when full.
- **Title** (600, 20px, -0.015em): task titles. Event row titles are 18px on mobile and 20px on desktop.
- **Lead** (17px): page intros, descriptions (max 65ch), sheet-line names and empty-state copy.
- **Body** (16px, 1.5): global default and field text.
- **Meta** (15px): times, task descriptions, open-spot sentences (19px in the event header), toasts, menu and select items, alerts, and form validation messages.
- **Button** (600, 15px): all buttons and the desktop nav. Mobile nav items are 17px.
- **Label** (600, 12px): date parts, tally status, the "du" tag and the wordmark's club line. 12px is the floor.

**The Numbers Are Display Rule.** Every number a helper scans, whether day, time, line number, tally or group size, is set in Barlow Condensed with tabular figures. Words stay in Arial.

**The Legibility Floor Rule.** Reading text never drops below 15px, and 12px is used only for short semibold labels. This is the family's deliberate departure for older members.

## Layout

There is one centered container, 1152px wide (`max-w-6xl`), with 16/24/32px gutters at mobile, sm and lg, and 32px vertical padding (48px from md). The sticky header is 64px tall, with a 1px line border, the same container width and an 88px scroll-padding to match.

Lists are date-led rows. A fixed date column (88px on mobile, 120px from md) leads a flexible text column and a trailing chevron, with 16/32px column gaps and 20/24px vertical padding. Rows have only a bottom rule and are filled with wash on hover.

The event work plan is a two-column grid from md. Each shift has a 264px wash rail (sticky at 96px from the top) beside a column of task sheets, with a 40px gap and 40px section padding. On phones the rail stacks above its tasks. Within a sheet, lines use a 44px number column (52px from md) and 12px vertical padding. After the claim line, two quiet dashed "frei" lines are shown, and any further empty spots fold into one sentence.

The organizer cockpit (`/organisation`) opens with the display h1 "Organisation" and, on its right, an outline "Alle Helfer" and a primary "Neue Veranstaltung" (wrapping below on phones). Below sits a master-detail grid from md. A 280px event rail (sticky at 96px) sits beside the event pane, with a 40px gap. On phones the rail is replaced by a native select labelled "Veranstaltung" (48px tall, 17px) above the pane. The pane opens with a header: a large date block and the event title (44/48px), then the open-spot sentence and three small outline actions (Arbeitsplan öffnen, Bearbeiten, Duplizieren), closed by a 1px rule. Below that come the underline link tabs (Lücken, Helferliste, Planen) and the active view. In the Helferliste, rows stack name over group and e-mail on phones. From sm they become four columns (name, group, e-mail, action) at roughly 3 : 2.4 : 3 : auto. "Alle Helfer" swaps the grid for a full-width, horizontally scrolling table with a 640px minimum width.

Planen stacks its shifts 40px apart. Each shift ends with a quick-add task row, a 1fr / 136px / 110px / auto grid from sm (name, start, count, actions); after the last shift, above a 1px rule and 24px of space, comes the quick-add shift row at 1fr / 136px / 136px / auto (name, start, end, actions). Both use 12px gaps, stack on phones, and set each label 10px above its field.

Creation forms (new event, shift, task) share one frame: a centered 672px column (`max-w-2xl`) inside the page container, with a back link, the display title, an optional context line, then the form panel 32px below.

Print is part of the layout. The header, footer, rail, picker, tabs and every action are hidden on paper. The pane prints the event name with the date in text, keeps each shift and task together across page breaks, and turns green text to ink.

Sign-in uses a two-column grid on desktop: the crest and heading on the left, and a form panel up to 440px wide on the right. Focused pages (verify-request, not-found) use a single 576px column.

## Elevation & Depth

The system is flat. Depth comes from white, wash and pale fills plus 1px line rules. The one heavier rule is the 2px ink line at 80% opacity, like the top edge of a printed form. It opens each task sheet, each shift on the organizer's gaps, helper and Planen lists, and the "Alle Helfer" table. Toasts force `shadow-none`.

Overlays follow the same rule. Dialogs, alert dialogs, sheets, popovers, menus and select lists are white with a 1px line border and no shadow. Separation from the page comes from the scrim alone. Overlays fade (and dialogs zoom from 95%) in about 200ms. Sheets slide in from their edge.

Loading placeholders are the only moving fill: pale green-grey bars (#eef2ea) with a lighter sheen (#f7f9f4). The sheen is fixed to the viewport, so one band of light passes over every bar at once every 1.6s instead of each bar flickering on its own. On wash and pale panels the bars are one step darker (#e5ebe1 / #eef2ea) so they don't vanish. They sit flat on the page like everything else.

**The Flat Sheet Rule.** Separate content with whitespace, rules and tonal fills. No shipped surface carries a box shadow, gradient or blur, and that includes overlays. A raised layer is marked by its border and the scrim. The one gradient is the loading shimmer on placeholder bars, which never rests on real content.

## Shapes

Corners are small and practical. Tags use 3px, fields and toasts 5px, buttons, the claim line, the shift rail and admin toolbars 6px, and full panels (sign-in, empty states, next duty, error panel, dialogs) 12px. Overlays each use one radius. Dialogs are 12px all round, and menus, popovers and select lists are 5px with 3px items. Sheet lines and list rows stay square and open. Only your own line gains a 5px corner and bleeds 8px into the gutter, so it reads as a highlighted strip on the sheet. The claim line uses a 1.5px green stroke, heavier than the 1px rules, which marks it as the place to write. The same stroke frames the next-duty panel and the quick-add shift row.

## Components

### Buttons

Plain, sturdy and labelled.
- **Shape:** gently squared (6px). Minimum height is 44px (default and icon 44×44), 36px for small and 48px for large.
- **Primary:** club green with white 15px semibold text and a 10px icon gap. Hover deepens to deep green over 150ms.
- **Outline:** white with a field-border stroke and ink text. Hover fills wash.
- **Ghost:** no fill. Hover fills wash. The "Austragen" variant uses error-ink text with an error-wash hover.
- **Link:** green text with no padding and an underline on hover (4px offset).
- **Danger:** danger fill (`destructive` variant) for confirming a removal and for the "Austragen (n)" bulk action. Hover moves it to error ink.
- **Disabled / pending:** 55% opacity. The working button swaps its icon for a spinner and names the action ("Wird eingetragen …").

### Inputs / Fields

- **Style:** white, field-border stroke, 5px corner, 44px minimum height (48px in the claim and sign-in forms), 16px text and a muted placeholder.
- **Focus:** the global rule, a 3px focus-green outline offset by 3px. It turns error ink on `aria-invalid`.
- **Error / Disabled:** error-ink border with the message directly below at 15px medium in error ink. Disabled is 55% opacity.
- **Native select:** the phone event picker is a plain `select` with the field stroke, a 6px corner and 17px text, 48px tall.

### Navigation

- **Header:** sticky, white, 64px. On the left are the 40/44px crest and a two-line wordmark (12px muted club name over a 25/27px green "Arbeitsplan").
- **Desktop (from lg):** 15px semibold links with 16px icons. Hover turns them green. The active link is green with a 3px green underline bar along the header's bottom edge. Logout sits after a 1px divider.
- **Mobile:** an outline "Menü" button with an icon and a visible label opens a right-side sheet. Items are 48px tall at 17px, and the active one is pale with deep green text.
- **Signed out:** a single outline "Anmelden" button.
- **Session unknown:** when a session cookie exists but the session can't be read, the header shows only the crest and wordmark, with no nav and no "Anmelden".
- **Session loading:** the crest and wordmark render at once. While the session streams in, a placeholder holds a helper's navigation: three link-sized slots (167/165/88px, each with a 16px bar), the divider and an Abmelden-sized slot on desktop, and a 93×44px menu-button bar on phones.
- **Labels:** Veranstaltungen, Meine Aufgaben, Profil, and for admins "Organisation".

### Sign-up sheet (signature)

A task as a paper Aushang. A 2px ink top rule sits above a header with the task title, the start time and description in meta, and a display tally on the right. Below it comes an ordered list. Filled lines show the line number (a range for groups, e.g. "2–4"), the name (or "belegt" when signed out), and "Gruppe · N Personen" when relevant. Your own line is pale with deep green text, a green "du" tag and an "Ändern" link. Quiet empty lines have dashed rules and read "frei".

### Claim line (signature)

The first empty line on a sheet is a full-width, 48px-tall button with a 1.5px green outline and a pen icon labelled "Hier eintragen". Hover fills it pale. Signed-out visitors get a link to sign-in that adds "Anmeldung nötig". Tapping it reveals an open-panel box (0.25s reveal) offering "Allein eintragen" (primary, focused), "Als Gruppe eintragen" (outline) and "Abbrechen" (ghost). The group form has an optional name and a −/+ stepper around a 32px display count. On success the new line plays the claim glow (1.6s, from a brighter green to pale) and a toast offers "Meine Aufgaben".

### Shift rail

A wash, 6px-cornered block with the shift time in display type (start green, end muted), the shift name as an h2 and a 15px status line ("N Plätze frei" in green, or "Alles belegt" in muted).

### Dialogs and confirmations

- **Dialog:** centered, inset by 16px on each side (`calc(100% - 2rem)`, max 512px), white, 1px line border, 12px corner, 24px padding (32px from md), no shadow, over the scrim. The header is left-aligned: a 32px Barlow title over a 16px muted description. Footer buttons stack on phones (the main action on top) and sit right-aligned from sm.
- **Close:** a 44×44 button in the top-right corner (12px inset) with a 16px X and a wash hover.
- **Confirming a removal:** the title asks the question with the name ("Jürgen Hensen austragen?"). The description says what happens and what to do next. "Behalten" (outline) has focus, and the danger action names the act ("Ja, austragen"). While it runs, it reads "Wird ausgetragen …". Used by RemoveUserFromTaskButton and RemoveHelperButton.
- **Logout** uses the same dialog without danger: "Abbrechen" and a primary "Abmelden". Logging out loses nothing.

### Menus and selects

White lists with a 1px line border, 5px corner and 4px inner padding, no shadow. Items are 15px with 10px vertical padding. The highlighted item fills pale with deep green text, and a check sits in a 32px left gutter where needed. The select trigger matches the field: 44px, field stroke, 16px. Focus is the global outline only.

### Organizer cockpit (signature)

- **Event rail:** a 280px wash block with 8px padding. A 12px semibold muted heading ("Kommende Veranstaltungen") sits over the list. Each item is a 64px date column (32px numeral) beside the event name (16px semibold) and a status line: "noch N frei" in semibold green, "voll besetzt" or "noch keine Aufgaben" in muted. Hover fills white. The selected item is a white fill with a 1px line border and `aria-current`. Past events fold into a "Vergangene (n)" disclosure and show no status.
- **Pane tabs:** underline links, not pills. Each is 48px tall, 16px semibold, muted, with a 3px bottom bar. The active one is green with a green bar sitting on the 1px rule. Labels carry the count ("Lücken (14)").
- **Gaps view:** shifts head with a 22px green time and an 18px semibold name over the 2px ink rule. Each open task is a ruled row with name and "ab 08:00 Uhr · 4 von 6 eingetragen" on the left and the green gap count on the right. With no gaps, a pale panel says "Alles besetzt" in 32px display type.
- **Planen view:** each shift is a heading over the 2px ink rule: a 22px green Barlow time range ("08:00–11:00"), the 18px semibold name, the short date in muted on multi-day events, and the shift's vertical-dots (⋮) actions menu on the right. Its tasks are ruled rows: name (semibold) over "ab 08:00 Uhr · description" in 15px muted, a Barlow "filled/required" tally, and the task's ⋮ menu. With no shifts yet, a 17px muted line invites the first one.
- **Helferliste:** each task is a ruled block with name, start and a display tally. Helpers are 15px rows split by dashed rules, with a ghost "Austragen" action in error ink. Open spots stay as dashed "frei" lines: three on screen with a "+ N weitere freie Plätze" line, and all of them on paper for walk-ins. Above the list, outline "Drucken" and "Als Excel-Liste (CSV)" buttons. The CSV uses semicolons and a UTF-8 BOM so German Excel opens it correctly.

### Alle Helfer table

An open table with no frame. It hangs under a 2px ink rule, with 1px row rules, a half-strength wash on row hover and a full wash on selected rows. Filters are full-width selects in a 1/2/4-column grid. Columns are merged to keep rows short. "Gruppe" reads "name · size" (or "allein" in muted), and "Aufgabe" reads "name · time" with the time muted. The bulk action is a danger button that counts the selection ("Austragen (3)"), next to an outline "CSV exportieren"; it asks the same "Behalten" / "Ja, austragen" confirmation as a single removal.

### Quick-add rows (signature)

The cockpit's inline planning: a shift or task is added in one line, and the plan updates in place.
- **Task:** under each shift in Planen, a small outline "Aufgabe hinzufügen" with a muted link "mit Beschreibung …" to the full form. It reveals (0.25s) a 6px wash panel with name, start time and count fields on white, a primary "Anlegen" and a ghost "Fertig". After adding, the row clears and refocuses the name so a whole shift can be filled in a run.
- **Shift:** after the last shift, an outline "Schicht hinzufügen" with a muted link "an einem anderen Tag …" to the full form. It reveals a 6px open-panel row with a 1.5px green stroke holding name, start and end (end defaults to three hours after start; start defaults to where the last shift ended). It is already open when the event has no shifts.
- **Both:** labels sit 10px above their fields, the working button reads "Wird angelegt …", success names the item in a toast, and errors appear inside the panel as a full-width error-wash message at 15px.

### Form pages

The full create forms (`/organisation/veranstaltungen/neu`, `…/schichten/neu`, `…/aufgaben/neu`) share one frame. A 15px semibold green back link with an arrow icon (44px tall, underline on hover) sits above a 44/56px display title, an optional 17px muted context line (such as the event a shift belongs to), and the form inside the 12px wash panel with a 1px line border (24px padding, 36px from md). After creating, the form lands in the cockpit's Planen tab.

### Sign-in email

The magic-link email follows the palette but obeys mail-client limits rather than the web stack.
- **Construction:** nested presentation tables, inline styles and `bgcolor` attributes only; `color-scheme: light` so clients don't invert it; Arial throughout (bold where the web uses Barlow).
- **Frame:** a wash canvas with a centered 560px column. A header pairs the 52px crest with a two-line wordmark (12px bold muted club name over a 24px bold green "Arbeitsplan"). The body is a white card with a 1px line border and 12px corner: a 28px bold ink heading, a 17px lead, then the button.
- **Button:** "bulletproof": a table cell filled club green with a 6px corner around a 17px bold white link padded 15px by 30px.
- **Below the button:** a 15px muted validity line with the 15 minutes in bold ink, then, after a 1px line rule, a fallback with the raw link in green. A muted footer says to ignore the email if unrequested.
- **Also:** a hidden preheader ("Ein Klick genügt …") and a plain-text alternative with the same words.

### Error states

One wording everywhere: the 44/56px display headline "Da ist etwas schiefgelaufen", a 17px muted reassurance that it isn't the user's fault and nothing was lost, then a primary "Noch einmal versuchen" and an outline "Zu den Veranstaltungen". The route error page shows the crest above a single 576px column. Inside the layout, the error boundary uses a 12px wash panel. The global error falls back to the same words with one button. API and validation messages are in German.

### Loading states

Only what depends on the visitor or the data waits. Fixed text (headings, intros, labels, the sign-in page) renders at once, and just the request-dependent part streams in behind a placeholder that mirrors it, so nothing jumps when the content arrives. Pages that need data before anything can render keep a full-page placeholder.
- **Exact size:** each bar sits in a box as tall as the text line it stands for (the page's real line heights), so heights match the page to the pixel; wrapped lines get a second bar only at the widths where the real text wraps.
- **Bars:** blocks of the shimmer fill, 5px corner (6px for button and claim-line shapes, 12px for panels), sized to the text or control they replace. They fade in over 300ms after a 150ms delay, so fast loads never flash. Under reduced motion they stay static.
- **Real structure stays real:** the placeholders keep the page's actual rules (including the ink sheet and shift rules), wash rails and panel strokes, and the next-duty panel's green border and pale fill. Fixed titles the placeholder knows for certain (form titles, Organisation, the rail heading, the work plan's back link) are real text; text that appears only with data stays a bar, so a placeholder never promises content. The event list keeps its date-led rows (a numeral bar beside two short date-part bars, then two text bars). The work plan keeps the wash shift rail (sitting at its own height, not stretched) beside sheet lines with dashed rules and a full-width claim-line bar as the last line. Meine Aufgaben keeps the next-duty panel above the Danach heading and two task rows. The organizer cockpit keeps the event rail, pane header and tabs. Forms show their title, then a bordered 12px panel with the fields of that form (event, shift or task) as label, control and hint bars.
- **Accessibility:** each placeholder is a `role="status"` region with `aria-busy` and a German label ("Arbeitsplan wird geladen", "Veranstaltungen werden geladen"). The bars inside are `aria-hidden`.

### Cards / Containers

- **Panels:** wash fill, 1px line border, 12px corner, 24/36px padding (sign-in, verify-request and empty states).
- **Next duty:** a 12px panel with a 1.5px green border and 40% pale fill. It holds the large date block, the start time in display type and the task details. It is the only bordered highlight on Meine Aufgaben.
- **Admin toolbar:** a 6px wash strip with small buttons. Admin controls stay quiet on helper pages: the event page's organizer bar holds only a small primary "In der Organisation planen" link into the cockpit's Planen tab, plus the ⋮ actions menu (edit, delete) on the right. Helper pages never offer creation.

### Toasts

Sonner at bottom center. White, 1px line border, 5px corner, no shadow and 15px text. The success icon is green and the error icon is error ink. Actions are small primary buttons.

## Do's and Don'ts

### Do:
- **Do** keep the crest (`public/logo.png`) and the green-and-white identity shared with kg-eventplan.
- **Do** present staffing as numbered sheet lines, with the first empty line as the green-outlined claim action.
- **Do** set dates, times, line numbers and counts in Barlow Condensed with tabular figures.
- **Do** keep body text at 16px or more, reading text at 15px or more, and every control at least 44px tall.
- **Do** rely on the single global focus rule (3px focus-green outline, 3px offset) and respect reduced motion. All animations and transitions collapse to 0.01ms.
- **Do** name the action in progress on the working button ("Wird gespeichert …", with a space before the ellipsis), disable it while it works, and name the task in toasts.
- **Do** confirm a removal in an alert dialog with "Behalten" focused and a danger "Ja, …" action that names the act.
- **Do** keep overlays flat: white, 1px line border, one radius, the `scrim` behind them.
- **Do** render fixed text at once and give only the request-dependent part a placeholder that mirrors it: real rules and rails, shimmer bars sized to the real line boxes, a 150ms delay before it appears, and a German `role="status"` label.
- **Do** show one event at a time to organizers, with counts in the display face, and keep the helper list printable.
- **Do** keep creation (events, shifts, tasks, duplicates) in the organizer cockpit, with inline rows first and the full form one link away.
- **Do** build emails from tables, inline styles and Arial, with a table-cell button; never rely on web fonts or CSS a mail client may drop.

### Don't:
- **Don't** turn tasks or events into elevated cards with progress bars.
- **Don't** add box shadows, gradients or blur to any surface, overlays included. The loading shimmer is the only gradient.
- **Don't** use pale green as a resting fill for anything that isn't the viewer's own.
- **Don't** add decorative eyebrows or tracked uppercase kickers. Uppercase is only for date parts and tally status.
- **Don't** add per-component focus rings or `outline-none`.
- **Don't** mark a selected rail or list item with a colored side stripe. Selection is a white fill with a 1px line border.
- **Don't** put a black overlay behind dialogs or sheets. The veil is always the ink-tinted `scrim`.
