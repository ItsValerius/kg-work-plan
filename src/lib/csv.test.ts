import { test } from "node:test";
import assert from "node:assert/strict";
import { toCsv } from "./csv";

test("toCsv", () => {
  const csv = toCsv(
    ["Name", "Gruppe"],
    [
      ['Die "Jecken"', '=HYPERLINK("x")'],
      ["Jörg", 3],
    ],
  );
  assert.ok(csv.startsWith("﻿"), "BOM for Excel");
  const [header, first, second] = csv.slice(1).split("\r\n");
  assert.equal(header, '"Name";"Gruppe"');
  assert.equal(first, '"Die ""Jecken""";"\'=HYPERLINK(""x"")"', "quotes doubled, formula defused");
  assert.equal(second, '"Jörg";"3"');
  assert.equal(toCsv(["A"], [["-5"]]).split("\r\n")[1], '"\'-5"');
});
