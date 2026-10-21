import { Camera, Cpu, Route } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Chapter three: what the analysis gives back. The sample result is drawn by
 * hand and labelled as an example; it is not output from a model.
 */

const PILLARS = [
  { icon: Camera, title: "See", text: "Identify the device and read its visible condition from a single photo." },
  { icon: Cpu, title: "Understand", text: "Break it into parts and judge which can be reused, repaired or recovered." },
  { icon: Route, title: "Decide", text: "Rank repair, reuse, refurbish, donate and recycle, with a reason for each." },
];

const SAMPLE_ROUTES = [
  { label: "Repair", score: 86 },
  { label: "Refurbish", score: 72 },
  { label: "Reuse", score: 58 },
  { label: "Donate", score: 41 },
  { label: "Recycle", score: 18 },
];

export function AiSolution() {
  return (
    <section aria-labelledby="solution-title" className="relative overflow-hidden bg-forest-950 py-28 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-cyan-500/[0.05] blur-[120px]" />
      <div className="page-x">
        <SectionHeading
          id="solution-title"
          index="03"
          eyebrow="The AI solution"
          lines={["One photo in.", <span key="l">A clear <em className="text-lime-500">next step</em> out.</span>]}
          intro="SecondLife AI is designed to do what most people can't do alone: look at a device and know what it is worth, what is still good inside it, and who can use it."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <ol className="space-y-px overflow-hidden rounded-[1.75rem] border border-ivory-100/10">
            {PILLARS.map((p, i) => (
              <li key={p.title} className="bg-forest-900/60">
                <Reveal delay={i * 0.08} className="flex gap-5 p-7">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-lime-500/40 text-lime-500">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="display text-3xl text-ivory-50">{p.title}</h3>
                    <p className="mt-2 leading-relaxed text-ivory-100/65">{p.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={0.15}>
            <figure className="border-sweep relative rounded-[1.75rem] bg-forest-900 p-7 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-ivory-100/50">Example result</p>
                <DemoBadge>Illustration</DemoBadge>
              </div>
              <p className="display mt-5 text-4xl text-ivory-50 sm:text-5xl">Laptop · won&apos;t charge</p>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  ["Grade", "B"],
                  ["Repairability", "7/10"],
                  ["Value", "Medium"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-ivory-100/10 p-3">
                    <p className="text-xs text-ivory-100/50">{k}</p>
                    <p className="mt-1 font-medium text-ivory-50">{v}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-7 space-y-3" aria-label="Suggested routes">
                {SAMPLE_ROUTES.map((r, i) => (
                  <li key={r.label} className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-3 text-sm">
                    <span className={i === 0 ? "text-lime-500" : "text-ivory-100/70"}>{r.label}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-ivory-100/10">
                      <span
                        className={`block h-full rounded-full ${i === 0 ? "bg-lime-500" : "bg-ivory-100/40"}`}
                        style={{ width: `${r.score}%` }}
                      />
                    </span>
                    <span className="text-right font-mono text-ivory-100/50">{r.score}</span>
                  </li>
                ))}
              </ul>
              <figcaption className="mt-7 border-t border-ivory-100/10 pt-5 text-sm leading-relaxed text-ivory-100/55">
                A hand-made example of the result layout. In this prototype, analysis runs on a demo engine that uses the
                details you enter, not the pixels of your photo.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
