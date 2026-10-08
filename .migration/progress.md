# progress

2026-10-08 · transformation engine (legacy `default` style) · migrated to `@base-ui/react/progress` with the new Track part; the primitive now sizes the fill.

## Changed

- `src/components/ui/progress.tsx`: `Root > Indicator` → `Root > Track > Indicator`. The manual `translateX(-(100 - value)%)` style was deleted (Base UI sets the indicator width). The bar classes moved to the Track and `className` is applied to the Track, so the caller's `[&>div]:bg-…` color selector (TaskDetailsDialog via `progressBarColor`) still targets the indicator.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/progress.tsx` → clean.

## Left alone

- `src/components/features/tasks/TaskDetailsDialog.tsx`: no call-site change needed (`value`, `className`, `aria-label` pass through).

## Behavior changes

- The fill animates its width instead of a transform; same visual result.

## Verify by hand

- Organisation → Planen → task ⋮ → Details: the bar fills to the task's sign-up share and keeps its green/orange color.
