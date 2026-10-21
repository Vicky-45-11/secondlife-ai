import type { Metadata } from "next";
import { Info } from "lucide-react";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Reveal, SplitHeadline } from "@/components/motion/Reveal";
import { AnalyzeExperience } from "@/components/analyze/AnalyzeExperience";

export const metadata: Metadata = {
  title: "Analyze a device",
  description:
    "Add a photo of a discarded device, tell us what it is and how it works, and get a ranked recommendation to repair, reuse, refurbish, donate or recycle it.",
};

export default function AnalyzePage() {
  return (
    <>
      <section className="page-x pb-12 pt-28 sm:pt-36 lg:pb-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-8">
            <Reveal className="eyebrow flex items-center gap-3 text-lime-500">
              <span className="h-px w-8 bg-ivory-100/25" aria-hidden="true" />
              Device analysis
            </Reveal>
            <SplitHeadline
              as="h1"
              lines={[
                "Show us the device.",
                <em key="2" className="text-ivory-100/70">
                  We&apos;ll find its next life.
                </em>,
              ]}
              className="display mt-6 text-[clamp(2.75rem,8vw,7rem)] text-ivory-50"
            />
            <Reveal delay={0.15} className="mt-6 max-w-xl text-lg leading-relaxed text-ivory-100/60">
              One photo, a couple of taps, and a ranked plan: what it&apos;s worth fixing, what&apos;s still useful
              inside, and where it can go next.
            </Reveal>
          </div>

          <Reveal delay={0.25} className="lg:col-span-4">
            <aside aria-label="About this demo" className="border-l border-cyan-500/40 pl-5">
              <DemoBadge>Demo analysis</DemoBadge>
              <p className="mt-4 text-sm leading-relaxed text-ivory-100/70">
                Results come from a demo engine that does <strong className="font-medium text-ivory-50">not</strong>{" "}
                inspect your photo&apos;s pixels. It uses the category and condition you select, plus sample rules.
                A real vision model can be connected later.
              </p>
              <p className="mt-3 flex items-start gap-2 text-xs text-ivory-100/45">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Your photo stays in this browser. Results are saved only to local history.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      <section aria-label="Analysis" className="page-x pb-24 lg:pb-32">
        <div className="border-t border-ivory-100/10 pt-10 lg:pt-14">
          <AnalyzeExperience />
        </div>
      </section>
    </>
  );
}
