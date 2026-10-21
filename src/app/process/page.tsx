import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ProcessTimeline } from "@/components/process/ProcessTimeline";
import { STAGES } from "@/data/process";

export const metadata: Metadata = {
  title: "The Process",
  description: "How SecondLife AI turns a photo of an old device into a repair, reuse, donation or recycling route, step by step.",
};

export default function ProcessPage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-forest-950 pb-16 pt-[calc(var(--header-h)+5rem)]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-forest-600/30 blur-[130px]" />
        <div className="page-x relative">
          <SectionHeading
            as="h1"
            eyebrow="The process"
            lines={["From a photo", <span key="l">to a <em className="text-lime-500">second life.</em></span>]}
            intro="Six stages, each marked honestly: what works in your browser today, and what is simulated by the demo analyser until a real model is connected."
          />
          <nav aria-label="Stages" className="mt-12 flex flex-wrap gap-2">
            {STAGES.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-ivory-100/15 px-4 py-2 text-sm text-ivory-100/70 transition-colors hover:border-lime-500 hover:text-lime-500"
              >
                <span className="mr-2 font-mono text-xs text-ivory-100/40">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section aria-label="Stages in detail" className="bg-forest-950 pb-32">
        <div className="page-x">
          <ProcessTimeline />
        </div>
      </section>

      <section className="bg-ivory-100 py-24 text-forest-950">
        <div className="page-x flex flex-wrap items-end justify-between gap-8">
          <h2 className="display max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)]">See it run on a device of yours.</h2>
          <ButtonLink href="/analyze" size="lg" variant="dark">
            Analyze a Device
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
