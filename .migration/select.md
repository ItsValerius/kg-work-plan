# select

2026-10-08 · transformation engine (legacy `default` style) · migrated to `@base-ui/react/select`; triggers keep showing labels via `items`.

## Changed

- `src/components/ui/select.tsx`: Root re-exported bare (it is generic). Content → `Portal > Positioner > Popup > List` with scroll arrows; `side`, `sideOffset` (4), `align` (start, Radix's default), `alignOffset`, `alignItemWithTrigger` (default `false` = Radix "popper", which every caller used) declared, destructured, forwarded. Popup `min-w-(--anchor-width)`, `max-h-(--available-height)`; `--radix-select-trigger-*` vars removed. Item: `ItemText` first, indicator via `render`; highlight `focus:` → `data-highlighted:`; trigger `disabled:` → `data-disabled:`. `SelectValue` styles the placeholder via `data-placeholder:`.
- `src/components/features/dashboard/participants/DataTable.tsx`: "nothing selected" is `null` (was `""`); `position="popper"` removed; fixed-width classes removed so long labels fit; `items` passed on the shift, task and group-size selects so the trigger shows "Aufbau (Hoppeditzerwachen)" / "4+ Personen" rather than the raw value (Base UI's Value renders the value otherwise).
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/select.tsx` → clean.

## Left alone

- `SelectGroup`/`SelectLabel`/`SelectSeparator`: migrated, unused.

## Behavior changes

- `onValueChange` now passes `(value, eventDetails)`; the existing handlers only use `value`.

## Verify by hand

- Organisation → Alle Helfer: pick "3 Personen" → the trigger shows "3 Personen" and rows filter; pick a shift → the trigger shows "Aufbau (Hoppeditzerwachen)"; "Filter zurücksetzen" restores the placeholders.
- Page size "Zeilen": choose 20 → more rows; keyboard: open with Enter, arrows + Enter select, typing jumps to matching options.
