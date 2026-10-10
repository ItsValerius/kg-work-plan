import { describe, expect, it } from "vitest";
import { userUpdateSchema } from "@/domains/users/types";

describe("userUpdateSchema", () => {
  const id = "user-1";

  it("allows an empty name for helpers who don't want theirs shown", () => {
    expect(userUpdateSchema.parse({ id, name: "   " }).name).toBe("");
  });

  it("trims names and caps them at 100 characters", () => {
    expect(userUpdateSchema.parse({ id, name: "  Anna  " }).name).toBe("Anna");
    expect(userUpdateSchema.safeParse({ id, name: "x".repeat(101) }).success).toBe(false);
  });
});
