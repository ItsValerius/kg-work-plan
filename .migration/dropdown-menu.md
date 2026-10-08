# dropdown-menu

2026-10-08 · transformation engine (legacy `default` style) · migrated to Base UI `Menu` (Portal › Positioner › Popup); link entries use the new `DropdownMenuLinkItem`.

## Changed

- `src/components/ui/dropdown-menu.tsx`: Radix DropdownMenu → `@base-ui/react/menu`. Content → `Portal > Positioner > Popup`; `side`/`sideOffset` (4)/`align`/`alignOffset` declared, destructured and forwarded to the Positioner. Positioner `isolate z-50 outline-none`, Popup keeps `z-50 outline-none`. `Label` → `GroupLabel`, `ItemIndicator` → `CheckboxItemIndicator`/`RadioItemIndicator`, `Sub` → `SubmenuRoot`, `SubTrigger` → `SubmenuTrigger` (+ `data-popup-open:` styling), SubContent composes the public Content with `side="right" sideOffset={0} align="start" alignOffset={-3}`. Highlight styling moved from `focus:` to `data-highlighted:`; animations restated as `data-starting-style`/`data-ending-style` transitions. New export `DropdownMenuLinkItem` (Base `Menu.LinkItem`) for entries that navigate. Public names unchanged otherwise.
- `src/components/features/admin/ShiftAdminActions.tsx`, `TaskAdminActions.tsx`: `DropdownMenuTrigger asChild` → `render={<Button …/>}`; `<DropdownMenuItem asChild><Link/></DropdownMenuItem>` → `<DropdownMenuLinkItem render={<Link href=…/>}>`; `onSelect={(e) => { e.preventDefault(); open() }}` → `onClick={() => open()}` (the menu now closes before the dialog opens).
- `src/components/features/dashboard/participants/data-table-column-header.tsx`: trigger `asChild` → `render`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/dropdown-menu.tsx` → clean.

## Left alone

- `DropdownMenuCheckboxItem`/`RadioItem`/`Sub*`: migrated in the wrapper but unused in the app.

## Behavior changes

- Items that open a dialog now close the menu first (Radix kept it open via `preventDefault`). This also removed a Radix side effect: its open menu left `pointer-events: none` on the page, which blocked dialogs opened from it.
- FLAG (unused here): Base UI `CheckboxItem`/`RadioItem` do not close the menu on click by default (Radix did). Add `closeOnClick` if such items are introduced.
- Base UI menus loop keyboard focus by default.

## Verify by hand

- Organisation → Planen → task ⋮: Details / Bearbeiten / Löschen; Esc closes; focus returns to the ⋮ button.
- Keyboard: focus ⋮, Enter opens with "Details" highlighted, ↓ to "Bearbeiten", Enter navigates.
- Alle Helfer: column header menu → "Absteigend" sorts.
