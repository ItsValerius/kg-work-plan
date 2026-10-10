import { describe, expect, it } from "vitest";
import { toCsv } from "@/lib/csv";

describe("toCsv", () => {
  const csv = toCsv(
    ["Name", "Gruppe"],
    [
      ['Die "Jecken"', '=HYPERLINK("x")'],
      ["Jörg", 3],
    ],
  );
  const [header, first, second] = csv.slice(1).split("\r\n");

  it("starts with a BOM and uses semicolons for German Excel", () => {
    expect(csv.startsWith("﻿")).toBe(true);
    expect(header).toBe('"Name";"Gruppe"');
    expect(second).toBe('"Jörg";"3"');
  });

  it("doubles quotes and defuses formulas", () => {
    expect(first).toBe('"Die ""Jecken""";"\'=HYPERLINK(""x"")"');
    expect(toCsv(["A"], [["-5"]]).split("\r\n")[1]).toBe('"\'-5"');
  });
});
