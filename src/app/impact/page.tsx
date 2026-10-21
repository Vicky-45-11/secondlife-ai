import type { Metadata } from "next";
import { SplitHeadline, Reveal } from "@/components/motion/Reveal";
import { ImpactDashboard } from "@/components/impact/ImpactDashboard";

export const metadata: Metadata = {
  title: "Impact dashboard",
  description:
    "Explore what analyzing discarded electronics adds up to: devices diverted from disposal, reusable components and illustrative CO2e, from a sample dataset or your own analyses.",
};

export default function ImpactPage() {
  return (
    <>
      <section className="page-x pb-12 pt-32 sm:pt-36 lg:pb-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal className="eyebrow flex items-center gap-3 text-lime-500">
              <span className="h-px w-8 bg-ivory-100/25" aria-hidden="true" />
              Sustainability impact
            </Reveal>
            <SplitHeadline
              as="h1"
              lines={["What a second look", <em key="e" className="text-ivory-100/70">adds up to.</em>]}
              className="display mt-6 text-[clamp(3rem,8vw,7.5rem)] text-ivory-50"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4">
            <p className="text-lg leading-relaxed text-ivory-100/60">
              Every analysis ends in a recommendation. Here they are added up: how many devices could avoid the bin, which parts are worth
              saving, and an illustrative sense of the emissions involved.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="page-x pb-28" aria-label="Impact dashboard">
        <ImpactDashboard />
      </section>
    </>
  );
}
