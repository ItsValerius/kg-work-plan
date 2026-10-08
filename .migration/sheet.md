# sheet

2026-10-08 · transformation engine (legacy `default` style) · migrated to `@base-ui/react/dialog` (sheet = side-anchored dialog popup).

## Changed

- `src/components/ui/sheet.tsx`: `@radix-ui/react-dialog` → Base UI `Dialog`. Overlay → `Backdrop` (opacity transition), Content → `Popup`. Slide animations restated as transitions: each `side` variant translates fully off-screen in `data-starting-style:`/`data-ending-style:` (300 ms in, 200 ms out). Close label "Close" → "Schließen". Title/Description typed as `SheetPrimitive.<Part>.Props`.
- `src/components/shared/navigation/MobileNavigation.tsx`: `SheetTrigger asChild` → `render={<Button …/>}`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/sheet.tsx` → clean.

## Left alone

- Nothing.

## Behavior changes

- None found: the menu opens from the right, a nav link navigates and closes it, focus returns to "Menü".

## Verify by hand

- Phone width: tap "Menü" → panel slides in from the right over a tinted backdrop; tap "Meine Aufgaben" → navigates and the panel closes; Esc / backdrop tap closes it.
