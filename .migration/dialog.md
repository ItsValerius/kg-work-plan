# dialog

2026-10-08 · transformation engine (legacy `default` style) · migrated to `@base-ui/react/dialog` (Backdrop + Popup, no Positioner).

## Changed

- `src/components/ui/dialog.tsx`: Overlay → `Backdrop` (flat `--scrim`, opacity transition), Content → `Popup` (centered, scale/opacity via `data-starting-style`/`data-ending-style`), Close kept. Close button label "Close" → "Schließen". Types → `DialogPrimitive.<Part>.Props`.
- `src/components/shared/dialogs/EditGroupDialog.tsx`, `DuplicateEventDialog.tsx`, `src/components/features/tasks/TaskDetailsDialog.tsx`: `DialogTrigger asChild` → `render={…}`; their `trigger` props narrowed from `ReactNode` to `ReactElement` (render needs one element; every caller passes a button). DuplicateEventDialog's two date `PopoverTrigger`s converted too (see popover.md).
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/dialog.tsx` → clean.

## Left alone

- `sheet.tsx` (also Dialog-based) is migrated separately.

## Behavior changes

- Base UI returns focus to the trigger on close (verified on "Duplizieren"); if the trigger unmounted (menu item), focus falls back to the body.
- Nested popover inside a dialog: Esc closes the popover first, then the dialog (same as Radix).

## Verify by hand

- Organisation → Duplizieren: dialog opens; Tab stays inside; Esc closes; focus returns to "Duplizieren".
- Meine Aufgaben → "Gruppe angeben": dialog opens; outside click closes.
- Planen → task ⋮ → Details: dialog opens and its X closes it.
