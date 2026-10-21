"use client";

import { useId, useState, type ReactNode } from "react";
import { Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Wraps a hand-built chart: title, the chart itself, and a data table that is
 * always available to screen readers and can be shown for everyone.
 */
export function ChartFrame({
  eyebrow,
  title,
  note,
  children,
  table,
  className,
}: {
  eyebrow: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
  table: ReactNode;
  className?: string;
}) {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();
  return (
    <figure className={cn("panel flex min-w-0 flex-col p-5 sm:p-7", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <figcaption>
          <p className="eyebrow text-ivory-100/45">{eyebrow}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight text-ivory-50 sm:text-[1.7rem]">{title}</h3>
          {note && <p className="mt-1.5 max-w-md text-sm text-ivory-100/55">{note}</p>}
        </figcaption>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-expanded={showTable}
          aria-controls={tableId}
          className="inline-flex items-center gap-1.5 rounded-full border border-ivory-100/15 px-3 py-1.5 text-xs text-ivory-100/70 transition-colors hover:border-ivory-100/40 hover:text-ivory-100"
        >
          <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
          {showTable ? "Hide table" : "Show table"}
        </button>
      </div>
      <div className={cn("mt-6 flex-1", showTable && "hidden")} aria-hidden={showTable ? true : undefined}>
        {children}
      </div>
      <div id={tableId} className={cn(showTable ? "mt-6 overflow-x-auto" : "sr-only")}>
        {table}
      </div>
    </figure>
  );
}

export function DataTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="border-b border-ivory-100/15">
          {headers.map((h, i) => (
            <th key={h} scope="col" className={cn("py-2 pr-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory-100/50", i > 0 && "text-right")}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={String(row[0])} className="border-b border-ivory-100/[0.07]">
            {row.map((cell, i) =>
              i === 0 ? (
                <th key={i} scope="row" className="py-2 pr-4 font-normal text-ivory-100/85">
                  {cell}
                </th>
              ) : (
                <td key={i} className="py-2 pr-4 text-right tabular-nums text-ivory-100/70">
                  {cell}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
