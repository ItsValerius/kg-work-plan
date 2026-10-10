import { describe, expect, it } from "vitest";
import {
  addDays,
  berlinDaysBetween,
  berlinTimeFrom,
  formatDateTime,
  fromBerlin,
  moveByBerlinDays,
  toBerlinInputParts,
} from "@/lib/datetime";

describe("Berlin wall-clock times", () => {
  it("become the right UTC instants in summer and winter", () => {
    expect(fromBerlin("2026-09-20").toISOString()).toBe("2026-09-19T22:00:00.000Z");
    expect(fromBerlin("2026-02-16", "20:00").toISOString()).toBe("2026-02-16T19:00:00.000Z");
  });

  it("read back and format in Berlin time", () => {
    expect(toBerlinInputParts(fromBerlin("2026-11-11", "11:11"))).toEqual({
      day: "2026-11-11",
      time: "11:11",
    });
    expect(formatDateTime(fromBerlin("2026-11-11", "20:00"))).toBe("11.11.2026, 20:00");
  });
});

describe("moving by days", () => {
  // 24 Oct is summer time, 26 Oct winter time.
  const shift = fromBerlin("2026-10-24", "20:00");

  it("keeps the wall-clock time across a DST change", () => {
    expect(toBerlinInputParts(moveByBerlinDays(shift, 2))).toEqual({
      day: "2026-10-26",
      time: "20:00",
    });
    expect(berlinDaysBetween(shift, fromBerlin("2026-10-26", "01:00"))).toBe(2);
  });

  it("crosses month and year ends", () => {
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("berlinTimeFrom", () => {
  const shift = fromBerlin("2026-02-14", "20:00");

  it("rolls a time before the start over to the next day", () => {
    expect(berlinTimeFrom(shift, "02:00")).toEqual(fromBerlin("2026-02-15", "02:00"));
  });

  it("keeps later times and the start itself on the same day", () => {
    expect(berlinTimeFrom(shift, "21:30")).toEqual(fromBerlin("2026-02-14", "21:30"));
    expect(berlinTimeFrom(shift, "20:00")).toEqual(shift);
  });
});
