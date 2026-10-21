"use client";

import { useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Database, MonitorSmartphone } from "lucide-react";
import { ACTIONS, ACTION_ORDER, CATEGORIES, categoryInfo } from "@/data/devices";
import { monthBucket, SAMPLE_ANALYSES, SAMPLE_MONTHS, SAMPLE_YEAR, type DashboardRecord, type MonthBucket } from "@/data/sample-dashboard";
import type { AnalysisResult, DeviceCategory } from "@/lib/analysis/types";
import { useHistory } from "@/lib/history";
import { cn, formatNumber } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { ActionDonut, type ActionCounts } from "./ActionDonut";
import { CategoryBars, type CategoryDatum } from "./CategoryBars";
import { ChartFrame, DataTable } from "./ChartFrame";
import { co2eText, formatCo2e, pct } from "./chart-utils";
import { CountUp } from "./CountUp";
import { MonthlyChart, type MonthDatum } from "./MonthlyChart";
import { RecentAnalyses } from "./RecentAnalyses";

type Mode = "sample" | "history";
type Range = 3 | 6 | 12;
const RANGES: Range[] = [3, 6, 12];

function toRecord(r: AnalysisResult): DashboardRecord {
  const d = new Date(r.createdAt);
  const action = r.actions[0]?.kind ?? "recycle";
  return {
    id: r.id,
    date: r.createdAt,
    monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    category: r.device.category,
    label: r.device.label,
    action,
    weightKg: r.impact.weightKg,
    co2eKg: r.impact.co2eKgAvoided,
    reusableComponents: r.components.filter((c) => c.reusability !== "low").length,
  };
}

/** Twelve calendar months ending with the current one (client only: history is empty on the server). */
function lastTwelveMonths(): MonthBucket[] {
  const now = new Date();
  const out: MonthBucket[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(monthBucket(d.getFullYear(), d.getMonth()));
  }
  return out;
}

const selectClass =
  "h-10 w-full appearance-none rounded-full border border-ivory-100/15 bg-forest-950 bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pl-4 pr-10 text-sm text-ivory-100 transition-colors hover:border-ivory-100/35 sm:w-56";
const chevron =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%23F4F0E5' stroke-opacity='0.6' stroke-width='1.5'><path d='M2 4l4 4 4-4'/></svg>\")";

export function ImpactDashboard() {
  const reduce = useReducedMotion();
  const history = useHistory();
  const [mode, setMode] = useState<Mode>("sample");
  const [category, setCategory] = useState<DeviceCategory | "all">("all");
  const [range, setRange] = useState<Range>(12);
  const categoryId = useId();

  const historyRecords = useMemo(() => history.map(toRecord), [history]);
  const records = mode === "sample" ? SAMPLE_ANALYSES : historyRecords;
  const allMonths = useMemo(() => (mode === "sample" ? SAMPLE_MONTHS : lastTwelveMonths()), [mode]);
  const months = useMemo(() => allMonths.slice(-range), [allMonths, range]);
  const monthKeys = useMemo(() => new Set(months.map((m) => m.key)), [months]);

  const inRange = useMemo(() => records.filter((r) => monthKeys.has(r.monthKey)), [records, monthKeys]);
  const filtered = useMemo(() => (category === "all" ? inRange : inRange.filter((r) => r.category === category)), [inRange, category]);

  const kpis = useMemo(() => {
    const diverted = filtered.filter((r) => r.action !== "recycle").length;
    return {
      analyzed: filtered.length,
      diverted,
      components: filtered.reduce((s, r) => s + r.reusableComponents, 0),
      co2eKg: filtered.reduce((s, r) => s + r.co2eKg, 0),
      weightKg: filtered.reduce((s, r) => s + r.weightKg, 0),
    };
  }, [filtered]);

  const monthData: MonthDatum[] = useMemo(
    () =>
      months.map((m) => {
        const rows = filtered.filter((r) => r.monthKey === m.key);
        return { ...m, total: rows.length, diverted: rows.filter((r) => r.action !== "recycle").length };
      }),
    [months, filtered],
  );

  const actionCounts: ActionCounts = useMemo(() => {
    const c: ActionCounts = { repair: 0, reuse: 0, refurbish: 0, donate: 0, recycle: 0 };
    for (const r of filtered) c[r.action] += 1;
    return c;
  }, [filtered]);

  const categoryData: CategoryDatum[] = useMemo(
    () => CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: inRange.filter((r) => r.category === c.id).length })),
    [inRange],
  );

  const recent = mode === "sample" ? filtered.slice(0, 8) : filtered;
  const historyEmpty = mode === "history" && history.length === 0;
  const co2 = formatCo2e(kpis.co2eKg);
  const rangeLabel = mode === "sample" ? `${months[0].longLabel} – ${months[months.length - 1].longLabel}` : `the last ${range} months`;
  const scopeLabel = category === "all" ? "all device categories" : categoryInfo(category).label.toLowerCase();

  return (
    <div>
      {/* Source toggle */}
      <div className="flex flex-col gap-6 border-y border-ivory-100/10 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Data source" className="inline-flex w-full rounded-full border border-ivory-100/15 bg-forest-950 p-1 sm:w-auto">
          {(
            [
              { id: "sample", label: "Sample dataset", icon: Database },
              { id: "history", label: "My analyses (this browser)", icon: MonitorSmartphone },
            ] as const
          ).map((opt) => {
            const on = mode === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={on}
                onClick={() => setMode(opt.id)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors sm:flex-none",
                  on ? "text-forest-950" : "text-ivory-100/70 hover:text-ivory-100",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="impact-source-pill"
                    className="absolute inset-0 rounded-full bg-lime-500"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }}
                    aria-hidden="true"
                  />
                )}
                <Icon className="relative h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="relative">{opt.label}</span>
                {opt.id === "history" && history.length > 0 && (
                  <span className={cn("relative font-mono text-xs", on ? "text-forest-950/70" : "text-ivory-100/45")}>{history.length}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="max-w-xl text-sm leading-relaxed text-ivory-100/60" aria-live="polite">
          {mode === "sample" ? (
            <p>
              <DemoBadge className="mr-2 align-middle">Sample data</DemoBadge>
              {SAMPLE_ANALYSES.length} synthetic analyses across {SAMPLE_YEAR}, generated from a fixed seed. The numbers are illustrative, not real
              users or real devices.
            </p>
          ) : (
            <p>
              <DemoBadge className="mr-2 align-middle">Demo analyses</DemoBadge>
              Results you generated on /analyze with the demo analyser, kept only in this browser. Nothing is sent to a server.
            </p>
          )}
        </div>
      </div>

      {historyEmpty ? (
        <div className="panel mt-10 grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow text-lime-500">Nothing here yet</p>
            <h2 className="display mt-4 text-[clamp(2rem,4vw,3.5rem)] text-ivory-50">Your dashboard starts with one device.</h2>
            <p className="mt-5 max-w-lg text-ivory-100/60">
              Analyze a phone, laptop or charger and the result is saved in this browser. Come back here to see your own counts, recommendations and
              illustrative CO2e add up.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/analyze">
                Analyze a device <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <button
                type="button"
                onClick={() => setMode("sample")}
                className="inline-flex h-11 items-center rounded-full border border-ivory-100/25 px-5 text-[0.95rem] text-ivory-100 hover:border-ivory-100/60"
              >
                View the sample dataset
              </button>
            </div>
          </div>
          <svg viewBox="0 0 240 160" className="mx-auto w-full max-w-xs text-ivory-100/20" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={20 + i * 36} y={150 - (i + 1) * 18} width={22} height={(i + 1) * 18} rx={2} fill="none" stroke="currentColor" strokeDasharray="3 4" />
            ))}
            <line x1="10" x2="230" y1="150.5" y2="150.5" stroke="currentColor" />
            <circle cx="218" cy="24" r="5" fill="#CCFF00" />
          </svg>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div>
                <label htmlFor={categoryId} className="eyebrow mb-2 block text-ivory-100/45">
                  Device category
                </label>
                <select
                  id={categoryId}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DeviceCategory | "all")}
                  className={selectClass}
                  style={{ backgroundImage: chevron }}
                >
                  <option value="all">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <fieldset>
                <legend className="eyebrow mb-2 text-ivory-100/45">Time range</legend>
                <div className="inline-flex rounded-full border border-ivory-100/15 p-1">
                  {RANGES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={range === r}
                      onClick={() => setRange(r)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-sm transition-colors",
                        range === r ? "bg-ivory-100 text-forest-950" : "text-ivory-100/65 hover:text-ivory-100",
                      )}
                    >
                      {r === 12 ? "12 months" : `Last ${r}`}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <p className="text-sm text-ivory-100/50" aria-live="polite">
              {formatNumber(filtered.length)} analyses · {scopeLabel} · {rangeLabel}
            </p>
          </div>

          {/* KPIs */}
          <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ivory-100/10 bg-ivory-100/10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
            <div className="bg-forest-900 p-6 sm:p-8">
              <dt className="eyebrow text-ivory-100/50">Devices analyzed</dt>
              <dd className="display mt-4 text-[clamp(3.5rem,7vw,6rem)] text-lime-500">
                <CountUp value={kpis.analyzed} />
              </dd>
              <dd className="mt-2 text-sm text-ivory-100/50">≈ {formatNumber(kpis.weightKg, 0)} kg of electronics assessed</dd>
            </div>
            <div className="bg-forest-900 p-6 sm:p-8">
              <dt className="eyebrow text-ivory-100/50">Est. diverted from disposal</dt>
              <dd className="display mt-4 text-[clamp(2.75rem,4.5vw,4rem)] text-ivory-50">
                <CountUp value={kpis.diverted} />
              </dd>
              <dd className="mt-2 text-sm text-ivory-100/50">
                {pct(kpis.diverted, kpis.analyzed)}% routed to repair, reuse, refurbish or donate. Estimated, not tracked.
              </dd>
            </div>
            <div className="bg-forest-900 p-6 sm:p-8">
              <dt className="eyebrow text-ivory-100/50">Potentially reusable parts</dt>
              <dd className="display mt-4 text-[clamp(2.75rem,4.5vw,4rem)] text-cyan-300">
                <CountUp value={kpis.components} />
              </dd>
              <dd className="mt-2 text-sm text-ivory-100/50">Components rated high or medium reusability.</dd>
            </div>
            <div className="bg-forest-900 p-6 sm:p-8">
              <dt className="eyebrow text-ivory-100/50">Illustrative CO2e avoided</dt>
              <dd className="display mt-4 text-[clamp(2.75rem,4.5vw,4rem)] text-ivory-50">
                <CountUp value={co2.value} digits={co2.digits} />
                <span className="ml-1.5 font-body text-lg text-ivory-100/50">{co2.unit}</span>
              </dd>
              <dd className="mt-2 text-sm text-ivory-100/50">From typical category figures; recycling counts 10%. Not a lifecycle assessment.</dd>
            </div>
          </dl>

          {/* Charts */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <ChartFrame
              className="lg:col-span-8"
              eyebrow="Over time"
              title="Analyses per month"
              note="Each bar splits estimated diverted devices from those recommended for recycling."
              table={
                <DataTable
                  caption="Analyses per month"
                  headers={["Month", "Analyses", "Est. diverted", "To recycling"]}
                  rows={monthData.map((m) => [m.longLabel, m.total, m.diverted, m.total - m.diverted])}
                />
              }
            >
              <MonthlyChart data={monthData} />
            </ChartFrame>

            <ChartFrame
              className="lg:col-span-4"
              eyebrow="Recommendations"
              title="Top action mix"
              table={
                <DataTable
                  caption="Top recommendation breakdown"
                  headers={["Action", "Analyses", "Share"]}
                  rows={ACTION_ORDER.map((k) => [ACTIONS[k].label, actionCounts[k], `${pct(actionCounts[k], filtered.length)}%`])}
                />
              }
            >
              <ActionDonut counts={actionCounts} />
            </ChartFrame>

            <ChartFrame
              className="lg:col-span-5"
              eyebrow="What people bring"
              title="By device category"
              note={category === "all" ? "Across the selected time range." : "All categories in range; your selection is highlighted."}
              table={
                <DataTable
                  caption="Analyses by device category"
                  headers={["Category", "Analyses"]}
                  rows={[...categoryData].sort((a, b) => b.count - a.count).map((c) => [c.label, c.count])}
                />
              }
            >
              <CategoryBars data={categoryData} highlight={category} />
            </ChartFrame>

            <section className="panel p-5 sm:p-7 lg:col-span-7" aria-label="Recent analyses">
              <RecentAnalyses mode={mode} records={recent} totalCount={history.length} />
            </section>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ivory-100/45">
            How these numbers work: a device counts as diverted when its top recommendation is anything other than recycling. CO2e uses one
            illustrative figure per category ({co2eText(categoryInfo("laptop").illustrativeCo2eKg)} for a laptop,{" "}
            {co2eText(categoryInfo("smartphone").illustrativeCo2eKg)} for a smartphone), so totals show scale, not measured savings.
          </p>
        </>
      )}
    </div>
  );
}
