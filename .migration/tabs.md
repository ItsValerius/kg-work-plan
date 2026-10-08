# tabs

2026-10-08 · transformation engine (legacy `default` style) · migrated to `@base-ui/react/tabs`; currently unused in the app.

## Changed

- `src/components/ui/tabs.tsx`: `Trigger` → `Tab`, `Content` → `Panel`; `data-[state=active]:` → `data-active:`; added `aria-disabled:` next to `disabled:` (Base UI marks disabled tabs with aria-disabled). Public names (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) unchanged.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/tabs.tsx` → clean.

## Left alone

- No consumers (the dashboard uses link-based tabs).

## Behavior changes

- FLAG: Base UI tabs activate manually by default (arrow keys move focus, Enter/Space activates); Radix activated on focus. Not patched, per the shadcn base registry; add `activateOnFocus` on `TabsList` if a future screen needs Radix's behavior.

## Verify by hand

- Only relevant once the wrapper is used again: arrow keys move between tabs, Enter activates.
