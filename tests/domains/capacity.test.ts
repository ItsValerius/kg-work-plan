import { describe, expect, it } from "vitest";
import { fitsCapacity } from "@/domains/participants/capacity";

describe("fitsCapacity", () => {
  it("accepts a group that fits exactly", () => {
    expect(fitsCapacity(4, 3, 1)).toBe(true);
  });

  it("rejects one person too many, a group larger than the task, a full task and an empty group", () => {
    expect(fitsCapacity(4, 3, 2)).toBe(false);
    expect(fitsCapacity(4, 0, 5)).toBe(false);
    expect(fitsCapacity(4, 4, 1)).toBe(false);
    expect(fitsCapacity(4, 0, 0)).toBe(false);
  });
});
