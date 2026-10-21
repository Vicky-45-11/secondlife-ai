"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { STAGES, STATUS_LABEL } from "@/data/process";
import { cn } from "@/lib/utils";

/**
 * Chapter four: the workflow. On wide screens with motion allowed, the
 * stages scroll sideways while the section is pinned. Everywhere else they
 * stack, so nothing depends on the animation.
 */
export function Workflow() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const rail = track.current;
    if (!el || !rail) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia(el);
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth + 64);
      const tween = gsap.to(rail, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      gsap.fromTo(
        "[data-progress]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, scrub: true } },
      );
      return () => tween.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} aria-labelledby="workflow-title" className="relative overflow-hidden bg-forest-900 py-28 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0">
      <div className="page-x flex flex-wrap items-end justify-between gap-8 lg:pt-[var(--header-h)]">
        <SectionHeading
          id="workflow-title"
          index="04"
          eyebrow="How it works"
          lines={["Six steps from", <span key="l">drawer to <em className="text-lime-500">next life.</em></span>]}
          className="lg:[&_h2]:text-[clamp(2.5rem,4.6vw,4.6rem)]"
        />
        <ButtonLink href="/process" variant="secondary">
          Explore the full process
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
      </div>

      <div className="page-x mt-6 hidden lg:block">
        <div className="h-px w-full bg-ivory-100/10">
          <div data-progress className="h-px origin-left bg-lime-500" />
        </div>
      </div>

      <div className="mt-14 lg:mt-10">
        <div ref={track} className="page-x grid gap-5 sm:grid-cols-2 lg:flex lg:w-max lg:max-w-none lg:gap-6">
          {STAGES.map((s, i) => (
            <article
              key={s.id}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-ivory-100/10 p-7 sm:p-8 lg:h-[24rem] lg:w-[26rem] lg:shrink-0",
                i % 2 === 0 ? "bg-forest-950" : "bg-forest-800/60",
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="display text-6xl text-ivory-100/15">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em]",
                      s.status === "live" ? "border-lime-500/40 text-lime-500" : "border-cyan-500/40 text-cyan-300",
                    )}
                  >
                    {STATUS_LABEL[s.status]}
                  </span>
                </div>
                <h3 className="display mt-6 text-4xl text-ivory-50">{s.title}</h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-ivory-100/45">{s.short}</p>
              </div>
              <p className="mt-6 leading-relaxed text-ivory-100/70">{s.body}</p>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-lime-500 transition-transform duration-500 group-hover:scale-x-100"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
