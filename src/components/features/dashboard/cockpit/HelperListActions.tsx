"use client";

import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { downloadCsv } from "@/lib/csv";

export interface CsvRow {
  shift: string;
  task: string;
  start: string;
  name: string;
  group: string;
  people: number;
  email: string;
}

export function HelperListActions({ rows, fileName }: { rows: CsvRow[]; fileName: string }) {
  function exportCsv() {
    downloadCsv(
      fileName,
      ["Schicht", "Aufgabe", "Beginn", "Name", "Gruppe", "Personen", "E-Mail"],
      rows.map((row) => [
        row.shift,
        row.task,
        row.start,
        row.name,
        row.group,
        row.people,
        row.email,
      ]),
    );
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
