# checkbox

2026-10-08 · transformation engine (legacy `default` style) · migrated to `@base-ui/react/checkbox`; the one consumer now uses the separate `indeterminate` prop.

## Changed

- `src/components/ui/checkbox.tsx`: Radix Root/Indicator → `CheckboxPrimitive.Root`/`Indicator`; props typed as `CheckboxPrimitive.Root.Props`. Class rewrites: `data-[state=checked]:` → `data-checked:`; `disabled:` → `data-disabled:` (Base UI's Root renders a `<span>` + hidden input, so `:disabled` variants would be dead code); added `data-indeterminate:` styling and a `Minus` icon for the mixed state (Radix rendered nothing distinct for it before).
- `src/components/features/dashboard/participants/columns.tsx` (select-all header): `checked={all || (some && "indeterminate")}` → `checked={all}` + `indeterminate={some && !all}` (Base UI split the two). Row checkboxes unchanged (`onCheckedChange={(v) => …(!!v)}` stays valid).
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/checkbox.tsx` → clean.

## Left alone

- Nothing.

## Behavior changes

- The select-all checkbox now shows a dash when some (not all) rows on the page are selected. Radix showed the check icon for "indeterminate" because its Indicator rendered the same child for both states.

## Verify by hand

- Organisation → Alle Helfer: tick one row → header checkbox shows a dash; tick all on the page → header shows a check; click header → all toggle.
- Space toggles a focused checkbox; the focus outline is the global green ring.
