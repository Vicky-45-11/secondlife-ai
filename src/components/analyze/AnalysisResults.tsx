"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, Globe, Leaf, MapPin, RotateCcw, Scale } from "lucide-react";
import { ACTIONS, categoryInfo } from "@/data/devices";
import { DESTINATION_TYPES, destinationById, type Destination } from "@/data/destinations";
import type { AnalysisResult, Level } from "@/lib/analysis";
import { cn, formatNumber } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { PreviewImage } from "./PreviewImage";
import { ACTION_ICONS, CATEGORY_ICONS, CornerBrackets, EASE, LEVEL_LABEL } from "./shared";

const IDENTIFIED: Record<AnalysisResult["device"]["identifiedBy"], { label: string; detail: string }> = {
  visitor: { label: "From your selection", detail: "You chose the category, so we used it as given." },
  "file-name": {
    label: "Guessed from the file name",
    detail: "The demo matched words in the file name or your notes. Choose a category to be certain.",
  },
  fallback: {
    label: "Could not identify",
    detail: "Nothing in the file name or notes matched. Choose a category for better results.",
  },
  model: { label: "Identified by the vision model", detail: "Identified from the photo by the connected model." },
};

const GRADE_TONE: Record<AnalysisResult["condition"]["grade"], string> = {
  A: "text-lime-500",
  B: "text-ivory-50",
  C: "text-clay",
  D: "text-red-300",
};

const LEVEL_CHIP: Record<Level, string> = {
  high: "border-lime-500/50 bg-lime-500/10 text-lime-300",
  medium: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  low: "border-ivory-100/20 bg-ivory-100/5 text-ivory-100/60",
};

const VALUE_STEPS: Level[] = ["low", "medium", "high"];

export const AnalysisResults = forwardRef<
  HTMLHeadingElement,
  { result: AnalysisResult; previewUrl: string | null; onReset: () => void }
>(function AnalysisResults({ result, previewUrl, onReset }, headingRef) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
      };

  const info = categoryInfo(result.device.category);
  const CategoryIcon = CATEGORY_ICONS[result.device.category];
  const identified = IDENTIFIED[result.device.identifiedBy];
  const [top, ...rest] = result.actions;
  const destinations = result.destinationIds
    .map((id) => destinationById(id))
    .filter((d): d is Destination => Boolean(d));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.header variants={item} className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow text-lime-500">Analysis complete</p>
            <DemoBadge>Demo result</DemoBadge>
          </div>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="display mt-5 break-words text-[clamp(2.5rem,6vw,5rem)] text-ivory-50 focus:outline-none"
          >
            {result.device.label}
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <CategoryIcon className="mt-1 h-5 w-5 shrink-0 text-ivory-100/60" aria-hidden="true" strokeWidth={1.6} />
              <div>
                <dt className="eyebrow text-ivory-100/45">Category</dt>
                <dd className="mt-1 text-ivory-50">{info.label}</dd>
              </div>
            </div>
            <div>
              <dt className="eyebrow text-ivory-100/45">How identified</dt>
              <dd className="mt-1">
                <span
                  className={cn(
                    "text-ivory-50",
                    result.device.identifiedBy === "fallback" && "text-clay",
                  )}
                >
                  {identified.label}
                </span>
                <span className="mt-1 block text-sm text-ivory-100/50">{identified.detail}</span>
              </dd>
            </div>
          </dl>
        </div>
        <div className="relative hidden aspect-square overflow-hidden rounded-2xl border border-ivory-100/10 lg:col-span-4 lg:block">
          <PreviewImage key={previewUrl ?? "none"} src={previewUrl} name={result.image.name} />
          <CornerBrackets className="border-ivory-50/70" />
        </div>
      </motion.header>

      {/* Metrics strip */}
      <motion.section
        variants={item}
        aria-label="Condition, repairability and value"
        className="panel grid divide-y divide-ivory-100/10 md:grid-cols-12 md:divide-x md:divide-y-0"
      >
        <div className="flex gap-5 p-6 md:col-span-5 lg:p-8">
          <p className={cn("display text-[5.5rem] leading-[0.8]", GRADE_TONE[result.condition.grade])}>
            <span className="sr-only">Condition grade </span>
            {result.condition.grade}
          </p>
          <div>
            <h3 className="eyebrow text-ivory-100/45">Condition grade</h3>
            <p className="mt-2 text-ivory-100/80">{result.condition.summary}</p>
          </div>
        </div>
        <div className="p-6 md:col-span-4 lg:p-8">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="eyebrow text-ivory-100/45">Repairability</h3>
            <p className="font-mono text-ivory-50">
              <span className="text-2xl">{result.repairability}</span>
              <span className="text-ivory-100/45">/10</span>
            </p>
          </div>
          <div
            className="mt-5 grid grid-cols-10 gap-1"
            role="img"
            aria-label={`Repairability ${result.repairability} out of 10`}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-7 rounded-sm",
                  i < result.repairability
                    ? result.repairability >= 7
                      ? "bg-lime-500"
                      : result.repairability >= 4
                        ? "bg-cyan-500"
                        : "bg-clay"
                    : "bg-ivory-100/10",
                )}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-ivory-100/45">How practical a repair is likely to be.</p>
        </div>
        <div className="p-6 md:col-span-3 lg:p-8">
          <h3 className="eyebrow text-ivory-100/45">Relative value (demo)</h3>
          <p className="mt-2 text-2xl text-ivory-50">{LEVEL_LABEL[result.valueBand]}</p>
          <ol className="mt-4 flex gap-1" aria-label={`Relative value ${result.valueBand}, on a scale of low, medium, high`}>
            {VALUE_STEPS.map((step, i) => (
              <li
                key={step}
                className={cn(
                  "h-2 flex-1 rounded-full",
                  i <= VALUE_STEPS.indexOf(result.valueBand) ? "bg-ivory-50" : "bg-ivory-100/10",
                )}
              >
                <span className="sr-only">{LEVEL_LABEL[step]}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-ivory-100/45">A rough band, not a price.</p>
        </div>
      </motion.section>

      {/* Actions + components */}
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <motion.section variants={item} aria-labelledby="actions-heading" className="lg:col-span-7">
          <h3 id="actions-heading" className="eyebrow mb-4 text-ivory-100/45">
            Recommended next actions
          </h3>
          {top && (
            <div className="rounded-2xl bg-lime-500 p-6 text-forest-950 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = ACTION_ICONS[top.kind];
                    return <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.8} />;
                  })()}
                  <span className="eyebrow">Best fit · #1</span>
                </div>
                <p className="font-mono text-sm">
                  <span className="text-3xl font-medium tabular-nums">{top.score}</span>
                  <span className="opacity-60">/100</span>
                </p>
              </div>
              <p className="display mt-6 text-[clamp(2.25rem,4vw,3.5rem)]">{ACTIONS[top.kind].verb}</p>
              <p className="mt-3 max-w-xl text-forest-900/80">{top.reason}</p>
              <div
                className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-forest-950/15"
                role="img"
                aria-label={`Fit score ${top.score} out of 100`}
              >
                <div className="h-full rounded-full bg-forest-950" style={{ width: `${top.score}%` }} />
              </div>
            </div>
          )}
          <ol className="mt-3 divide-y divide-ivory-100/10 rounded-2xl border border-ivory-100/10" start={2}>
            {rest.map((a, i) => {
              const Icon = ACTION_ICONS[a.kind];
              return (
                <li key={a.kind} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-4">
                  <span className="font-mono text-xs text-ivory-100/45">#{i + 2}</span>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0 text-ivory-100/60" aria-hidden="true" />
                    <span className="text-ivory-50">{ACTIONS[a.kind].label}</span>
                  </span>
                  <span className="font-mono text-sm tabular-nums text-ivory-100/80">
                    {a.score}
                    <span className="sr-only"> out of 100</span>
                  </span>
                  <div
                    className="col-span-3 h-1 overflow-hidden rounded-full bg-ivory-100/10 sm:col-span-2 sm:col-start-2"
                    aria-hidden="true"
                  >
                    <div className="h-full rounded-full bg-ivory-100/50" style={{ width: `${a.score}%` }} />
                  </div>
                  <p className="col-span-3 text-sm text-ivory-100/50 sm:col-span-2 sm:col-start-2">{a.reason}</p>
                </li>
              );
            })}
          </ol>
        </motion.section>

        <motion.section variants={item} aria-labelledby="components-heading" className="lg:col-span-5">
          <h3 id="components-heading" className="eyebrow mb-4 text-ivory-100/45">
            Reusable components
          </h3>
          <ul className="panel divide-y divide-ivory-100/10">
            {result.components.map((c) => (
              <li key={c.name} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-ivory-50">{c.name}</span>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.12em]",
                      LEVEL_CHIP[c.reusability],
                    )}
                  >
                    {LEVEL_LABEL[c.reusability]}
                    <span className="sr-only"> reusability</span>
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-ivory-100/50">{c.note}</p>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>

      {/* Destinations */}
      <motion.section variants={item} aria-labelledby="dest-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 id="dest-heading" className="eyebrow text-ivory-100/45">
              Recommended destinations
            </h3>
            <p className="mt-2 text-sm text-ivory-100/50">Illustrative demo directory, not real organisations.</p>
          </div>
          <Link
            href={`/destinations?category=${result.device.category}`}
            className="group inline-flex items-center gap-1.5 text-sm text-ivory-50 underline-offset-4 hover:underline"
          >
            See all destinations
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
        {destinations.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {destinations.map((d, i) => {
              const online = d.type === "marketplace" && d.distanceKm === 0;
              return (
                <li key={d.id} className={cn("panel flex flex-col p-5", i === 0 && "border-ivory-100/25")}>
                  <p className="eyebrow text-cyan-300">{DESTINATION_TYPES[d.type].label}</p>
                  <p className="mt-3 text-lg leading-snug text-ivory-50">{d.name}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-ivory-100/60">
                    {online ? (
                      <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    )}
                    <span className="min-w-0">
                      {d.area} · {online ? "Online" : `${formatNumber(d.distanceKm, 1)} km`}
                    </span>
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {d.services.map((s) => (
                      <li key={s} className="rounded-full bg-ivory-100/5 px-2.5 py-1 text-xs text-ivory-100/70">
                        {s}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="panel p-6 text-ivory-100/60">
            No demo destination matched this device. Browse the full directory instead.
          </p>
        )}
      </motion.section>

      {/* Impact */}
      <motion.section
        variants={item}
        aria-labelledby="impact-heading"
        className="panel-light grid gap-8 p-6 sm:p-8 md:grid-cols-12 lg:p-10"
      >
        <div className="md:col-span-5">
          <h3 id="impact-heading" className="eyebrow text-forest-600">
            Illustrative impact
          </h3>
          <p className="display mt-4 text-[clamp(2rem,3.5vw,3rem)] text-forest-900">
            What following the top recommendation could mean.
          </p>
          <p className="mt-4 text-sm text-forest-900/60">
            Illustrative estimate based on typical figures for this category, not a verified lifecycle assessment.
          </p>
        </div>
        <dl className="grid gap-6 sm:grid-cols-2 md:col-span-7 md:items-end">
          <div className="border-t border-forest-900/15 pt-4">
            <dt className="flex items-center gap-2 text-sm text-forest-900/60">
              <Scale className="h-4 w-4" aria-hidden="true" />
              Kept out of the waste stream
            </dt>
            <dd className="display mt-3 text-[clamp(3rem,6vw,4.75rem)] text-forest-900">
              {formatNumber(result.impact.weightKg, result.impact.weightKg < 1 ? 2 : 1)}
              <span className="ml-2 font-body text-lg text-forest-900/60">kg</span>
            </dd>
          </div>
          <div className="border-t border-forest-900/15 pt-4">
            <dt className="flex items-center gap-2 text-sm text-forest-900/60">
              <Leaf className="h-4 w-4" aria-hidden="true" />
              CO₂e potentially avoided
            </dt>
            <dd className="display mt-3 text-[clamp(3rem,6vw,4.75rem)] text-forest-900">
              ~{formatNumber(result.impact.co2eKgAvoided)}
              <span className="ml-2 font-body text-lg text-forest-900/60">kg CO₂e</span>
            </dd>
          </div>
        </dl>
      </motion.section>

      {/* Next */}
      <motion.div
        variants={item}
        className="flex flex-col gap-4 border-t border-ivory-100/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-sm text-ivory-100/50">Saved to this browser&apos;s history. Nothing was uploaded.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={onReset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Analyze another device
          </Button>
          <ButtonLink href="/impact">
            View impact dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </motion.div>
    </motion.div>
  );
});
