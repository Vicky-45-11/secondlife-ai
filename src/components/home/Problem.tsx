import { ArrowUpRight } from "lucide-react";
import { Reveal, SplitHeadline } from "@/components/motion/Reveal";
import { EWASTE_FACTS, EWASTE_SOURCE } from "@/data/facts";

/** Chapter one: the problem, told with published figures and their source. */
export function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="relative overflow-hidden bg-ivory-100 text-forest-950">
      <div className="page-x py-28 sm:py-36">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Reveal className="eyebrow flex items-center gap-3 text-forest-600">
              <span className="text-forest-900/50">01</span>
              <span className="h-px w-8 bg-forest-900/25" aria-hidden="true" />
              The problem
            </Reveal>
            <SplitHeadline
              id="problem-title"
              lines={["Drawers full of", <em key="e">working futures.</em>]}
              className="display mt-5 text-[clamp(2.6rem,6vw,5.6rem)]"
            />
          </div>
          <Reveal delay={0.1} className="self-end text-lg leading-relaxed text-forest-900/70 sm:text-xl">
            <p>
              Old phones sit in drawers. Laptops wait in cupboards. Chargers, earbuds and consoles end up in household bins.
              Most of them still hold parts that work, metals that can be recovered, and value someone else could use.
            </p>
            <p className="mt-5">
              The hard part is rarely the will to do better. It is knowing what a device is worth, whether it can be fixed,
              and where it should go next.
            </p>
          </Reveal>
        </div>

        <dl className="mt-20 grid border-t border-forest-950/15 sm:grid-cols-3">
          {EWASTE_FACTS.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 0.08}
              className="border-b border-forest-950/15 py-10 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0"
            >
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <p className="display text-[clamp(3.5rem,7vw,6.5rem)] text-forest-950">
                  {f.value}
                  <span className="ml-2 align-top font-body text-base font-medium tracking-normal text-forest-600 sm:text-lg">
                    {f.unit}
                  </span>
                </p>
                <p className="mt-3 max-w-[16rem] text-forest-900/70">{f.label}</p>
              </dd>
            </Reveal>
          ))}
        </dl>

        <p className="mt-8 flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-forest-900/55">
          Source:
          <a
            href={EWASTE_SOURCE.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-forest-700 underline decoration-forest-700/30 underline-offset-4 hover:decoration-forest-700"
          >
            {EWASTE_SOURCE.name}
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>
  );
}
