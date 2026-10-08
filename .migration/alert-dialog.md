# alert-dialog

2026-10-08 · transformation engine (legacy `default` style) · migrated to `@base-ui/react/alert-dialog`; `Action` became a plain button, `Cancel` became `Close`.

## Changed

- `src/components/ui/alert-dialog.tsx`: Overlay → `Backdrop`, Content → `Popup` (centered, no Positioner), Cancel → `AlertDialogPrimitive.Close` with the outline button classes, Action → the app's `Button` (Base UI has no Action part; it does not close the dialog by itself). Animations restated as transitions.
- Trigger call sites `asChild` → `render`: `DeleteEventButton.tsx`, `LogoutButton.tsx`, `DataTable.tsx` (bulk Austragen), `RemoveUserFromTaskButton.tsx`, `RemoveHelperButton.tsx`, `ShiftAdminActions.tsx`, `TaskAdminActions.tsx`. Verified every consumer closes its dialog itself after the action succeeds (`set…Open(false)`), so the missing auto-close changes nothing.
- Deleted `src/components/shared/buttons/DeleteButton.tsx`: unused (no importers) and the only `AlertDialogAction asChild` site.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/alert-dialog.tsx` → clean.

## Left alone

- Nothing.

## Behavior changes

- Initial focus: Radix focused Cancel explicitly; Base UI focuses the first tabbable element, which is the cancel button because the footer lists it first (verified: "Behalten" / "Abbrechen" receive focus).
- While an action runs, the dialog now stays open until the action succeeds (Radix's Action closed it immediately unless prevented).

## Verify by hand

- Meine Aufgaben → Austragen: dialog opens with "Behalten" focused; Esc closes; "Ja, austragen" removes the entry and closes.
- Organisation → Löschen (event) / Planen ⋮ → Löschen (shift/task): confirm deletes, "Behalten"/"Abbrechen" closes without changes.
- Header → Abmelden: "Abbrechen" focused; confirm signs out.
