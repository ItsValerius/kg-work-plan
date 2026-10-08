import { test } from "node:test";
import assert from "node:assert/strict";
import { sumSpots, taskSpots } from "./spots";

test("open spots never go below zero, and sums add up per task", () => {
  const overbooked = { requiredParticipants: 2, participants: [{ groupSize: 3 }] };
  const half = { requiredParticipants: 4, participants: [{ groupSize: 1 }, { groupSize: 1 }] };
  assert.deepEqual(taskSpots(overbooked), { filled: 3, required: 2, open: 0 });
  assert.deepEqual(sumSpots([overbooked, half]), { filled: 5, required: 6, open: 2 });
  assert.deepEqual(sumSpots([]), { filled: 0, required: 0, open: 0 });
});
