import { describe, expect, it } from "vitest";
import { sumSpots, taskSpots } from "@/domains/tasks/spots";

const overbooked = { requiredParticipants: 2, participants: [{ groupSize: 3 }] };
const half = { requiredParticipants: 4, participants: [{ groupSize: 1 }, { groupSize: 1 }] };

describe("open spots", () => {
  it("never go below zero", () => {
    expect(taskSpots(overbooked)).toEqual({ filled: 3, required: 2, open: 0 });
  });

  it("add up per task", () => {
    expect(sumSpots([overbooked, half])).toEqual({ filled: 5, required: 6, open: 2 });
    expect(sumSpots([])).toEqual({ filled: 0, required: 0, open: 0 });
  });
});
