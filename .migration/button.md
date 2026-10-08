# button

2026-10-08 · transformation engine (legacy `default` style: classification only, no golden replay) · migrated to the `@base-ui/react/button` primitive; links styled as buttons now render as real links.

## Changed

- `src/components/ui/button.tsx`: `Slot`/`asChild` + `forwardRef` replaced by `ButtonPrimitive` from `@base-ui/react/button` (React 19 ref-as-prop). `buttonVariants` and every class kept verbatim. `ButtonProps` is now `ButtonPrimitive.Props & VariantProps<typeof buttonVariants>` (`SubmitButton` still imports it). Added `data-slot="button"`.
- 18 call sites of `<Button asChild><Link …/></Button>` became `<Link className={buttonVariants({ variant, size })}>` (or `cn(buttonVariants(…), "extra")` where the Button had a `className`): `SessionNav.tsx`, `QuickAddTask.tsx`, `QuickAddShift.tsx`, `meine-aufgaben/page.tsx` (2), `GapsView.tsx`, `LinkButton.tsx`, `UserForm.tsx`, `events/[eventId]/shifts/[shiftId]/tasks/[taskId]/page.tsx`, `EventsSection.tsx`, `ErrorBoundary.tsx`, `not-found.tsx`, `dashboard/page.tsx` (5), `error.tsx`. Unused `Button` imports removed afterwards.
  Why not `render={<Link/>}`: Base UI's docs say links must not be rendered through Button (it would add `role="button"`); styling the `<a>` keeps link semantics, exactly as Radix's Slot did.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/button.tsx` → clean.

## Left alone

- `<XTrigger asChild><Button/></XTrigger>` sites (dialog, alert-dialog, sheet, popover, dropdown triggers): they belong to those components' migrations; a Base UI Button works as a Radix Slot child in the meantime.
- `alert-dialog.tsx` uses `buttonVariants` for its Action/Cancel classes: unchanged here, handled with alert-dialog.

## Behavior changes

- Base UI's Button keeps keyboard focus semantics identical for native buttons. No visible change expected.

## Verify by hand

- Tab through the header: "Anmelden" (signed out) is announced as a link, not a button.
- On Organisation, "Neue Veranstaltung" / "Alle Helfer" / "Arbeitsplan öffnen" / "Bearbeiten" look unchanged and open their pages; middle-click opens a new tab (links).
- Submit buttons (sign-in, quick-add "Anlegen") still submit with Enter and show their pending state.
