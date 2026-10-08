# form

2026-10-08 · transformation engine (legacy `default` style) · the react-hook-form wrapper keeps its API; its Radix Slot became Base UI `useRender`.

## Changed

- `src/components/ui/form.tsx`: this is the shadcn react-hook-form wrapper, not Radix Form, so it is NOT mapped to Base UI `Form`/`Field` (that would change every consumer and the validation model). Only its Radix pieces moved:
  - `FormControl` (`form.tsx:113`): `Slot` replaced by `useRender` + `mergeProps` from Base UI. The single child element is passed as `render`, so call sites keep `<FormControl><Input/></FormControl>` unchanged. `ref` is forwarded explicitly (it sits inside `PopoverTrigger asChild` in EventForm/DuplicateEventDialog). The data-* literal is cast for `mergeProps`, per the worked example.
  - `FormLabel`: typed against the native-label `Label` (see label.md).
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/form.tsx` → clean.

## Left alone

- The react-hook-form integration (`Form = FormProvider`, `FormField`/`Controller`, `useFormField`): not Radix.
- 7 consumer files (EventForm, ShiftForm, TaskForm, UserForm, UserDataFrom, EditGroupDialog, DuplicateEventDialog): no call-site changes needed.

## Behavior changes

- None expected: `id`, `aria-describedby` and `aria-invalid` still land on the control.

## Verify by hand

- Neue Veranstaltung: submit with an empty name → the field is marked invalid (red border) and the message is announced next to it.
- Event form date fields: the calendar popover still opens from the date button (FormControl inside PopoverTrigger).
- Profile: changing the name still saves.
