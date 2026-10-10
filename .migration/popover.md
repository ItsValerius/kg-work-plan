# popover

2026-10-08 · transformation engine (legacy `default` style) · migrated to `@base-ui/react/popover` (Portal › Positioner › Popup).

## Changed

- `src/components/ui/popover.tsx`: Content → `Portal > Positioner > Popup`; `side`, `align` (center), `alignOffset` (0), `sideOffset` (4) declared, destructured, forwarded to the Positioner. Positioner `isolate z-50`; Popup keeps the classes with `origin-(--transform-origin)` and transition-based enter/exit.
- `src/components/features/events/EventForm.tsx` (2 date fields), `src/components/ui/date-time-picker.tsx`: `<PopoverTrigger asChild><FormControl><Button>…</Button></FormControl></PopoverTrigger>` → `<PopoverTrigger render={<FormControl><Button>…</Button></FormControl>} />`. The content stays inside the Button: Trigger children would replace FormControl's render element.
- (`DuplicateEventDialog.tsx`'s two date triggers were converted the same way; that file is committed with dialog.)
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/popover.tsx` → clean.

## Left alone

- `src/components/ui/calendar.tsx`: react-day-picker, not Radix.

## Behavior changes

- None found. As before, picking a date does not close the popover (no code closes it in either version).

## Verify by hand

- Neue Veranstaltung: click "Startdatum" → calendar opens below; pick a day → the button label updates; Esc or outside click closes; focus returns to the button.
