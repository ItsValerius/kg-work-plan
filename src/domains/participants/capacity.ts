/** Whether a group of `requested` people still fits a task that needs `required` and has `taken`. */
export function fitsCapacity(required: number, taken: number, requested: number): boolean {
  return requested >= 1 && taken + requested <= required;
}
