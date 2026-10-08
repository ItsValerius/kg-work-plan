import { test } from "node:test";
import assert from "node:assert/strict";
import { fitsCapacity } from "./capacity";

test("fitsCapacity", () => {
  assert.equal(fitsCapacity(4, 3, 1), true, "exact fit");
  assert.equal(fitsCapacity(4, 3, 2), false, "one too many");
  assert.equal(fitsCapacity(4, 0, 5), false, "group larger than the task");
  assert.equal(fitsCapacity(4, 4, 1), false, "already full");
  assert.equal(fitsCapacity(4, 0, 0), false, "empty group");
});
