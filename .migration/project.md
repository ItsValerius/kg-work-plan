# project

2026-10-08, whole-project mode, transformation engine (legacy style `default`, classification only). All 13 Radix wrappers are on Base UI and the build is green.

## Changed

- **Dependency swap:** added `@base-ui/react` 1.8.0 and removed all 11 `@radix-ui/*` packages with `pnpm remove`. `pnpm-lock.yaml` was updated by pnpm.
- **Wrappers** (one commit each, with a report in this folder): button, label, form, checkbox, progress, tabs, tooltip, dropdown-menu, popover, dialog, sheet, alert-dialog, select.
- **App-code sweep** (see `consumer-props.md` patterns):
  - `XTrigger asChild` → `render={…}` on every trigger. The `trigger` props in TaskDetailsDialog, EditGroupDialog and DuplicateEventDialog are narrowed to `React.ReactElement`.
  - The 18 `<Button asChild><Link>` sites now use `<Link className={buttonVariants(…)}>`.
  - Menu `onSelect` + `preventDefault` → `onClick`. Navigating items use the new `DropdownMenuLinkItem render={<Link/>}`.
  - Select: `undefined` → `null` for empty values, and `items` maps so the trigger shows labels instead of raw values. Dropped `position="popper"`.
  - Checkbox: the `indeterminate` prop is used instead of `checked="indeterminate"`.
  - Deleted the unused `src/components/shared/buttons/DeleteButton.tsx`.
- `src/app/globals.css`: removed the dead `body[data-scroll-locked]` rules (a Radix scroll-lock artifact).
- Docs: CLAUDE.md, PRODUCT.md, DESIGN.md and `.impeccable/design.json` now say "shadcn on Base UI". The "differs from parent" note in DESIGN.md went from four differences to three.
- Leftover scan: `grep -rn "radix" src package.json` finds nothing.

**Final check vs. baseline:** tsc 0 errors (baseline 0). Lint shows 0 errors and 1 warning; the warning is pre-existing (react-hooks incompatible-library in DuplicateEventDialog). `format:check` is clean and `pnpm build` passes.

## Left alone

- `calendar.tsx` (react-day-picker) and `sonner.tsx` are not Radix, so they are intentionally untouched apart from the earlier German locale fix.
- **FLAG:** `components.json` still has `"style": "default"`. This is a legacy style with no base counterpart, so a future `shadcn add <x>` will deliver the **Radix** variant. You decide: switch to a `base-*` style (which restyles new components), or port new components by hand like these 13.

## Behavior changes

- `AlertDialogAction` no longer closes the dialog by itself; callers close it after the async work. The current callers already do.
- Menu items close on click; link items navigate through Next `Link`.
- Select opens below the trigger (`alignItemWithTrigger=false`) to match the old popper mode.
- Details for each component are in its own report.

## Verify by hand

- Dashboard: open and close each dialog (Esc, backdrop, X); focus should return to the trigger.
- Task/shift ⋮ menus: arrow keys, Enter on "Bearbeiten" navigates, "Löschen" opens the confirm dialog.
- Participants table: page-size and filter selects show labels; select-all is indeterminate on a partial selection.
- Mobile navigation sheet opens and closes, and the page doesn't stay scroll-locked.
