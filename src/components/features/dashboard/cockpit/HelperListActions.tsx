"use client";

import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

export interface CsvRow {
  shift: string;
  task: string;
  start: string;
  name: string;
  group: string;
  people: number;
  email: string;
}

function toCsv(rows: CsvRow[]) {
  const header = ["Schicht", "Aufgabe", "Beginn", "Name", "Gruppe", "Personen", "E-Mail"];
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const lines = rows.map((row) =>
    [row.shift, row.task, row.start, row.name, row.group, row.people, row.email]
      .map(escape)
      .join(";"),
  );
  // Semicolons and a BOM so German Excel opens umlauts and columns correctly.
  return "﻿" + [header.map(escape).join(";"), ...lines].join("\r\n");
}

export function HelperListActions({ rows, fileName }: { rows: CsvRow[]; fileName: string }) {
  function exportCsv() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-2.5 print:hidden">
      <Button variant="outline" onClick={() => window.print()}>
        <Printer aria-hidden="true" />
        Drucken
      </Button>
      <Button variant="outline" onClick={exportCsv} disabled={rows.length === 0}>
        <Download aria-hidden="true" />
        Als Excel-Liste (CSV)
      </Button>
    </div>
  );
}
