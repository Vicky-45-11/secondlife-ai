"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { ACTIONS } from "@/data/devices";
import type { DashboardRecord } from "@/data/sample-dashboard";
import { clearHistory, removeFromHistory } from "@/lib/history";
import { cn } from "@/lib/utils";
import { ACTION_COLORS } from "./chart-utils";

const noop = () => () => {};
/** False during SSR and hydration, true afterwards: dates are only formatted on the client. */
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function sampleDate(date: string) {
  const [y, m, d] = date.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

export function RecentAnalyses({
  mode,
  records,
  totalCount,
}: {
  mode: "sample" | "history";
  records: DashboardRecord[];
  /** Records in history before filters, for the clear-all label. */
  totalCount: number;
}) {
  const mounted = useMounted();
  const reduce = useReducedMotion();
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const formatDate = (r: DashboardRecord) => {
    if (mode === "sample") return sampleDate(r.date);
    if (!mounted) return "";
    return new Date(r.date).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-ivory-100/45">{mode === "sample" ? "Latest sample entries" : "Saved in this browser"}</p>
          <h3 className="mt-2 font-display text-2xl text-ivory-50 sm:text-[1.7rem]">Recent analyses</h3>
        </div>
        {mode === "history" && totalCount > 0 && (
          <div className="flex items-center gap-2" role="group" aria-label="Clear history">
            {confirmClear ? (
              <>
                <span className="text-sm text-ivory-100/70" id="clear-confirm-label">
                  Delete all {totalCount} saved {totalCount === 1 ? "analysis" : "analyses"}?
                </span>
                <button
                  type="button"
                  autoFocus
                  aria-describedby="clear-confirm-label"
                  onClick={() => {
                    clearHistory();
                    setConfirmClear(false);
                  }}
                  className="rounded-full bg-clay px-3 py-1.5 text-xs font-medium text-forest-950 hover:bg-ivory-200"
                >
                  Yes, clear all
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="rounded-full border border-ivory-100/20 px-3 py-1.5 text-xs text-ivory-100/80 hover:border-ivory-100/50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-ivory-100/15 px-3 py-1.5 text-xs text-ivory-100/70 hover:border-clay/60 hover:text-clay"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {records.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-ivory-100/15 p-6 text-sm text-ivory-100/60">
          No analyses match these filters.
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto" data-lenis-prevent>
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              {mode === "sample" ? "Latest entries in the sample dataset" : "Analyses saved in this browser"}
            </caption>
            <thead>
              <tr className="border-b border-ivory-100/15 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ivory-100/45">
                <th scope="col" className="py-2.5 pr-4 font-normal">Date</th>
                <th scope="col" className="py-2.5 pr-4 font-normal">Device</th>
                <th scope="col" className="py-2.5 pr-4 font-normal">Top action</th>
                <th scope="col" className="py-2.5 pr-4 text-right font-normal">CO2e*</th>
                {mode === "history" && (
                  <th scope="col" className="py-2.5 text-right font-normal">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {records.map((r) => (
                  <motion.tr
                    key={r.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: 12 }}
                    className="border-b border-ivory-100/[0.07] align-middle"
                  >
                    <td className="whitespace-nowrap py-3 pr-4 font-mono text-xs text-ivory-100/55">
                      <time dateTime={r.date}>{formatDate(r)}</time>
                    </td>
                    <td className="max-w-[16rem] truncate py-3 pr-4 text-ivory-100/85">{r.label}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-2 text-ivory-100/80">
                        <span className="h-2 w-2 rounded-full" style={{ background: ACTION_COLORS[r.action] }} aria-hidden="true" />
                        {ACTIONS[r.action].label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-xs tabular-nums text-ivory-100/60">{r.co2eKg} kg</td>
                    {mode === "history" && (
                      <td className="py-3 text-right">
                        {confirmId === r.id ? (
                          <span className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              autoFocus
                              onClick={() => {
                                removeFromHistory(r.id);
                                setConfirmId(null);
                              }}
                              className="rounded-full bg-clay px-2.5 py-1 text-xs font-medium text-forest-950 hover:bg-ivory-200"
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmId(null)}
                              aria-label="Keep this analysis"
                              className="rounded-full border border-ivory-100/20 p-1 text-ivory-100/70 hover:text-ivory-100"
                            >
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmId(r.id)}
                            aria-label={`Remove ${r.label} from history`}
                            className={cn("rounded-full p-1.5 text-ivory-100/45 transition-colors hover:bg-ivory-100/5 hover:text-clay")}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-ivory-100/40">
        *Illustrative CO2e per device from typical category values, not a lifecycle assessment.
        {mode === "history" && (
          <>
            {" "}
            Stored only in this browser.{" "}
            <Link href="/analyze" className="text-ivory-100/70 underline underline-offset-4 hover:text-lime-500">
              Analyze another device
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
