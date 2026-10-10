type Cell = string | number;

/** Quotes a cell; text starting like a formula gets a leading apostrophe so Excel shows it as text. */
function escapeCell(value: Cell) {
  const text = String(value);
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

/** CSV for German Excel: semicolons and a BOM so columns and umlauts open correctly. */
export function toCsv(header: string[], rows: Cell[][]) {
  return "﻿" + [header, ...rows].map((row) => row.map(escapeCell).join(";")).join("\r\n");
}

/** Hands the CSV to the browser as a download. */
export function downloadCsv(fileName: string, header: string[], rows: Cell[][]) {
  const url = URL.createObjectURL(
    new Blob([toCsv(header, rows)], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
