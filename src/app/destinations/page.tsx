import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal, SplitHeadline } from "@/components/motion/Reveal";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { DestinationsExplorer } from "@/components/destinations/DestinationsExplorer";

export const metadata: Metadata = {
  title: "Find a destination",
  description:
    "Search repair shops, refurbishers, donation programmes and recyclers by device, route and requirements. Entries are an illustrative sample directory.",
};

function ExplorerFallback() {
  return (
    <div className="grid gap-10 lg:grid-cols-12" aria-busy="true" aria-label="Loading destinations">
      <div className="space-y-4 lg:col-span-8">
        <div className="h-12 animate-pulse rounded-xl bg-ivory-100/5" />
        <div className="h-9 w-2/3 animate-pulse rounded-full bg-ivory-100/5" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-ivory-100/[0.04]" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-ivory-100/[0.04] lg:col-span-4" />
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <>
      <section className="page-x pb-12 pt-32 sm:pt-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal className="eyebrow flex items-center gap-3 text-lime-500">
              <span className="h-px w-8 bg-ivory-100/25" aria-hidden="true" />
              Destinations
            </Reveal>
            <SplitHeadline
              as="h1"
              lines={["The right next stop", <em key="e" className="text-ivory-100/70">for every device.</em>]}
              className="display mt-6 text-[clamp(3rem,7.5vw,7rem)] text-ivory-50"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-ivory-100/60">
              Filter by what you have and what should happen to it. Each match explains why it fits, so you can choose with confidence.
            </p>
            <div className="mt-6 rounded-xl border border-cyan-500/25 bg-cyan-500/[0.06] p-4 text-sm leading-relaxed text-ivory-100/75">
              <DemoBadge>Illustrative directory</DemoBadge>
              <p className="mt-3">
                These are sample entries, not real organisations; a verified partner directory can be connected later.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-x pb-28" aria-label="Destination search">
        <Suspense fallback={<ExplorerFallback />}>
          <DestinationsExplorer />
        </Suspense>
      </section>
    </>
  );
}
