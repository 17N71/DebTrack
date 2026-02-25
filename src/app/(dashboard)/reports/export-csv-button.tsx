"use client";

function escapeCsvCell(value: unknown): string {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsvRows<T extends Record<string, unknown>>(rows: T[]): string {
  const first = rows[0];
  if (!first) return "";
  const headers = Object.keys(first);
  const headerRow = headers.map(escapeCsvCell).join(",");
  const dataRows = rows.map((row) =>
    headers.map((h) => escapeCsvCell(row[h])).join(","),
  );
  return [headerRow, ...dataRows].join("\n");
}

export function ExportCsvButton<T extends Record<string, unknown>>({
  data,
  filename,
  label,
}: {
  data: T[];
  filename: string;
  label: string;
}) {
  function download() {
    const csv = toCsvRows(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg font-medium text-sm flex items-center gap-2"
    >
      <span className="material-icons-outlined text-lg">download</span>
      {label}
    </button>
  );
}
