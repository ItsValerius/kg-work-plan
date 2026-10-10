# tooltip

2026-10-08 · transformation engine (legacy `default` style) · migrated to `@base-ui/react/tooltip` (Portal › Positioner › Popup); currently unused in the app.

## Changed

- `src/components/ui/tooltip.tsx`: `TooltipContent` now renders `Portal > Positioner > Popup`. `side`, `sideOffset` (default 4), `align`, `alignOffset` (default 0) are declared, destructured and forwarded to the Positioner (forward rule). Positioner `isolate z-50`, Popup keeps `z-50`. Animations restated as transitions: `data-starting-style:` / `data-ending-style:` opacity + scale with `origin-(--transform-origin)` instead of `animate-in/out` keyframes.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/tooltip.tsx` → clean.

## Left alone

- No consumers; no `TooltipProvider` is mounted.

## Behavior changes

- Delays: if a Provider is added later, use `delay` (Radix `delayDuration`); Base UI's trigger default is 600ms (Radix 700ms).

## Verify by hand

- Only relevant once used: hover a trigger → tooltip appears after ~0.6s with a short fade/scale, positioned 4px from the trigger; Esc closes it.
