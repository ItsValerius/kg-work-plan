# label

2026-10-08 · transformation engine (legacy `default` style) · Radix Label replaced by a native `<label>`, as Base UI has no Label primitive.

## Changed

- `src/components/ui/label.tsx`: `@radix-ui/react-label` removed; renders `<label data-slot="label">` with the same classes plus `select-none` (Radix's only behavioral extra was preventing text selection on double click). Props are now `React.ComponentProps<"label">`; the unused `labelVariants` cva wrapper was dropped (it took no variants).
- `src/components/ui/form.tsx:95`: `FormLabel` typed against the new `Label` instead of `LabelPrimitive.Root`.
- No consumer used `asChild` on `Label`; all 8 consumers pass `htmlFor`/`className`/children, which a native label accepts unchanged.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/label.tsx` → clean.

## Left alone

- Nothing.

## Behavior changes

- None expected. Clicking a label still focuses its control via `htmlFor`.

## Verify by hand

- Sign-in: click "Deine E-Mail-Adresse" → the email field gets focus.
- Quick-add rows in "Planen": clicking "Neue Aufgabe" / "Beginn" / "Helfer" focuses the matching field; double-clicking a label doesn't select its text.
