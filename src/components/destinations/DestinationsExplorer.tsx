"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BatteryCharging, Check, RotateCcw, Search, ShieldCheck, Truck, X } from "lucide-react";
import { ACTIONS, ACTION_ORDER, CATEGORIES } from "@/data/devices";
import { DESTINATIONS, DESTINATION_TYPES, type Destination, type DestinationType } from "@/data/destinations";
import type { ActionKind, DeviceCategory } from "@/lib/analysis/types";
import { cn } from "@/lib/utils";
import { DestinationDrawer } from "./DestinationDrawer";
import { DestinationMap } from "./DestinationMap";
import { LocationPanel } from "./LocationPanel";
import {
  activeFilterCount,
  applyFilters,
  distanceLabel,
  EMPTY_FILTERS,
  filtersFromParams,
  filtersToQuery,
  TYPE_ORDER,
  whyMatches,
  type Filters,
  type SortKey,
} from "./match";

const selectClass =
  "h-11 w-full appearance-none rounded-xl border border-ivory-100/15 bg-forest-950 bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pl-4 pr-10 text-sm text-ivory-100 transition-colors hover:border-ivory-100/35";
const chevron =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%23F4F0E5' stroke-opacity='0.6' stroke-width='1.5'><path d='M2 4l4 4 4-4'/></svg>\")";

const TOGGLES: { key: "batteries" | "wipe" | "pickup"; label: string; icon: typeof Truck }[] = [
  { key: "batteries", label: "Takes batteries", icon: BatteryCharging },
  { key: "wipe", label: "Data wipe", icon: ShieldCheck },
  { key: "pickup", label: "Pickup", icon: Truck },
];

export function DestinationsExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [filters, setFilters] = useState<Filters>(() => filtersFromParams(searchParams));
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Destination | null>(null);
  const ids = { search: useId(), category: useId(), action: useId(), sort: useId() };

  // Keep the URL in sync (debounced so typing doesn't spam history).
  const lastQuery = useRef(searchParams.toString());
  useEffect(() => {
    const next = filtersToQuery(filters);
    if (next === lastQuery.current) return;
    const t = window.setTimeout(() => {
      lastQuery.current = next;
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }, 250);
    return () => window.clearTimeout(t);
  }, [filters, pathname, router]);

  // Follow back/forward or external links that change the query.
  useEffect(() => {
    const current = searchParams.toString();
    if (current === lastQuery.current) return;
    lastQuery.current = current;
    setFilters(filtersFromParams(searchParams));
  }, [searchParams]);

  const results = useMemo(() => applyFilters(DESTINATIONS, filters), [filters]);
  const activeCount = activeFilterCount(filters);
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }));
  const toggleType = (t: DestinationType) =>
    setFilters((f) => ({ ...f, types: f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t] }));
  const reset = () => setFilters((f) => ({ ...EMPTY_FILTERS, sort: f.sort }));
  const close = useCallback(() => setSelected(null), []);
  const highlightId = hoverId ?? selected?.id ?? null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Filters + results */}
      <div className="lg:col-span-7 xl:col-span-8">
        <div role="search">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6" aria-label="Filter destinations">
            <div>
              <label htmlFor={ids.search} className="eyebrow mb-2 block text-ivory-100/45">
                Search
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-100/40" aria-hidden="true" />
                <input
                  id={ids.search}
                  type="search"
                  value={filters.q}
                  onChange={(e) => update("q", e.target.value.slice(0, 80))}
                  placeholder="Name, service or area, e.g. battery, screen, Lakeside"
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-ivory-100/15 bg-forest-950 pl-11 pr-11 text-[0.95rem] text-ivory-100 placeholder:text-ivory-100/35 hover:border-ivory-100/35"
                />
                {filters.q && (
                  <button
                    type="button"
                    onClick={() => update("q", "")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ivory-100/50 hover:text-ivory-100"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <fieldset>
              <legend className="eyebrow mb-2 text-ivory-100/45">Destination type</legend>
              <div className="flex flex-wrap gap-2">
                {TYPE_ORDER.map((t) => {
                  const on = filters.types.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleType(t)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                        on ? "border-lime-500 bg-lime-500 text-forest-950" : "border-ivory-100/15 text-ivory-100/75 hover:border-ivory-100/45 hover:text-ivory-100",
                      )}
                    >
                      {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                      {DESTINATION_TYPES[t].plural}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor={ids.category} className="eyebrow mb-2 block text-ivory-100/45">
                  Device
                </label>
                <select
                  id={ids.category}
                  value={filters.category}
                  onChange={(e) => update("category", e.target.value as DeviceCategory | "")}
                  className={selectClass}
                  style={{ backgroundImage: chevron }}
                >
                  <option value="">Any device</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={ids.action} className="eyebrow mb-2 block text-ivory-100/45">
                  I want to
                </label>
                <select
                  id={ids.action}
                  value={filters.action}
                  onChange={(e) => update("action", e.target.value as ActionKind | "")}
                  className={selectClass}
                  style={{ backgroundImage: chevron }}
                >
                  <option value="">Any route</option>
                  {ACTION_ORDER.map((a) => (
                    <option key={a} value={a}>
                      {ACTIONS[a].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={ids.sort} className="eyebrow mb-2 block text-ivory-100/45">
                  Sort by
                </label>
                <select
                  id={ids.sort}
                  value={filters.sort}
                  onChange={(e) => update("sort", e.target.value as SortKey)}
                  className={selectClass}
                  style={{ backgroundImage: chevron }}
                >
                  <option value="distance">Distance from demo centre</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>
            </div>

            <fieldset>
              <legend className="sr-only">Requirements</legend>
              <div className="flex flex-wrap gap-2">
                {TOGGLES.map(({ key, label, icon: Icon }) => {
                  const on = filters[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      role="switch"
                      aria-checked={on}
                      onClick={() => update(key, !on)}
                      className={cn(
                        "inline-flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm transition-colors",
                        on ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-300" : "border-ivory-100/15 text-ivory-100/70 hover:border-ivory-100/40",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn("relative h-5 w-9 rounded-full transition-colors", on ? "bg-cyan-500" : "bg-ivory-100/15")}
                      >
                        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-forest-950 transition-[left]", on ? "left-[1.125rem]" : "left-0.5")} />
                      </span>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </form>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-b border-ivory-100/10 pb-4">
          <p className="text-sm text-ivory-100/60" role="status" aria-live="polite">
            <span className="font-display text-2xl text-ivory-50">{results.length}</span> of {DESTINATIONS.length} sample entries
            {activeCount > 0 && ` · ${activeCount} filter${activeCount === 1 ? "" : "s"} active`}
          </p>
          {activeCount > 0 && (
            <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-ivory-100/70 underline-offset-4 hover:text-lime-500 hover:underline">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset filters
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-ivory-100/20 p-8 text-center sm:p-12">
            <p className="display text-3xl text-ivory-50">No sample entries match.</p>
            <p className="mx-auto mt-3 max-w-md text-ivory-100/60">
              Try fewer requirements or a broader route. A real directory would have many more options in most areas.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-lime-500 px-5 text-[0.95rem] font-medium text-forest-950 hover:bg-lime-300"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset filters
            </button>
          </div>
        ) : (
          <ol className="divide-y divide-ivory-100/10">
            <AnimatePresence initial={false}>
              {results.map((d, i) => {
                const reasons = whyMatches(d, filters);
                const lit = highlightId === d.id;
                return (
                  <motion.li
                    key={d.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onPointerEnter={() => setHoverId(d.id)}
                    onPointerLeave={() => setHoverId(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(d)}
                      onFocus={() => setHoverId(d.id)}
                      onBlur={() => setHoverId(null)}
                      aria-haspopup="dialog"
                      className={cn(
                        "group grid w-full gap-4 px-1 py-6 text-left transition-colors sm:grid-cols-[3rem_1fr_auto] sm:px-3",
                        lit && "bg-ivory-100/[0.03]",
                      )}
                    >
                      <span className={cn("hidden font-mono text-xs sm:block", lit ? "text-lime-500" : "text-ivory-100/35")} aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="eyebrow block text-ivory-100/45">
                          {DESTINATION_TYPES[d.type].label} · {d.area}
                        </span>
                        <span className={cn("mt-2 block font-display text-[1.75rem] leading-tight transition-colors", lit ? "text-lime-500" : "text-ivory-50")}>
                          {d.name}
                        </span>
                        <span className="mt-1 block text-sm text-ivory-100/55">{d.hours}</span>
                        <span className="mt-3 flex flex-wrap gap-1.5">
                          {d.services.map((s) => (
                            <span key={s} className="rounded-full border border-ivory-100/15 px-2.5 py-0.5 text-xs text-ivory-100/70">
                              {s}
                            </span>
                          ))}
                          {d.takesBatteries && <Badge icon={BatteryCharging}>Batteries</Badge>}
                          {d.dataWipe && <Badge icon={ShieldCheck}>Data wipe</Badge>}
                          {d.pickup && <Badge icon={Truck}>Pickup</Badge>}
                        </span>
                        <span className="mt-4 block text-sm text-ivory-100/75">
                          <span className="mr-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-lime-500/80">Why this matches</span>
                          {reasons.join(" · ")}
                        </span>
                      </span>
                      <span className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
                        <span className="font-mono text-sm text-cyan-300">{distanceLabel(d.distanceKm)}</span>
                        <span className="inline-flex items-center gap-1 text-sm text-ivory-100/50 transition-colors group-hover:text-ivory-100">
                          Details <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>
        )}
      </div>

      {/* Map + location */}
      <aside className="lg:col-span-5 xl:col-span-4" aria-label="Map and location">
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="panel overflow-hidden p-4">
            <div className="flex items-center justify-between px-1 pb-2">
              <p className="eyebrow text-ivory-100/45">Schematic map</p>
              <p className="font-mono text-[0.68rem] text-ivory-100/40">not to scale · not real places</p>
            </div>
            <DestinationMap all={DESTINATIONS} matched={results} activeId={highlightId} onHover={setHoverId} onSelect={setSelected} />
            <p className="px-1 pt-2 text-xs leading-relaxed text-ivory-100/45">
              Rings show distance from the demo city centre. Bright dots match your filters; hover a result to find it here.
            </p>
          </div>
          <LocationPanel />
        </div>
      </aside>

      <DestinationDrawer destination={selected} filters={filters} onClose={close} />
    </div>
  );
}

function Badge({ icon: Icon, children }: { icon: typeof Truck; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-300">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}
