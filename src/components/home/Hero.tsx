"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ExplodedPhone } from "@/components/illustrations/ExplodedPhone";

const HEADLINE = [["Every", "discarded"], ["device", "has"], ["another", "story."]];

const CALLOUTS = [
  { label: "Cover glass", note: "Reusable if uncracked", className: "left-[2%] top-[14%]" },
  { label: "Display", note: "Common repair part", className: "right-[0%] top-[30%]" },
  { label: "Logic board", note: "Gold · copper · tin", className: "left-[0%] top-[52%]" },
  { label: "Battery", note: "Certified recycling", className: "right-[4%] bottom-[16%]" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // The device separates as the visitor scrolls past the hero, and settles back on return.
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const idle = useMotionValue(0.35);
  const scrollSpread = useTransform(scrollYProgress, [0, 0.7], [0.35, 1]);
  const spread = useSpring(reduce ? idle : scrollSpread, { stiffness: 90, damping: 20 });
  const artY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  // Subtle tilt toward the pointer on desktop.
  const tiltX = useSpring(0, { stiffness: 80, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 80, damping: 18 });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-hero]");
    if (reduce) {
      gsap.set(items, { autoAlpha: 1, yPercent: 0, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo("[data-hero='eyebrow']", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.1)
        .fromTo("[data-hero='word']", { yPercent: 110, autoAlpha: 1 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.2)
        .fromTo("[data-hero='copy']", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.75)
        .fromTo("[data-hero='cta']", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.9)
        .fromTo("[data-hero='art']", { autoAlpha: 0, scale: 0.94, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.6 }, 0.3)
        .fromTo("[data-hero='callout']", { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.12 }, 1.2)
        .fromTo("[data-hero='cue']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.5);
    }, el);
    return () => ctx.revert();
  }, [reduce]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
  };

  return (
    <section
      ref={root}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        tiltX.set(0);
        tiltY.set(0);
      }}
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-forest-950 pt-[var(--header-h)]"
      aria-labelledby="hero-title"
    >
      {/* Ambient light and a faint grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-forest-600/30 blur-[140px]" />
        <div className="absolute right-[-10%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-lime-500/[0.07] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,240,229,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(244,240,229,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="page-x relative z-[2] grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <motion.div style={{ y: copyY }}>
          <p data-hero="eyebrow" className="hero-init eyebrow flex items-center gap-3 text-lime-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-500 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-500" />
            </span>
            AI for the afterlife of electronics
          </p>

          <h1 id="hero-title" className="display mt-7 text-[clamp(3.1rem,8.6vw,8.4rem)] text-ivory-50">
            {HEADLINE.map((line, i) => (
              <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.16em]">
                {line.map((word, j) => (
                  <span key={word} className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-top">
                    <span data-hero="word" className={`hero-init inline-block ${i === 2 && j === 1 ? "italic text-lime-500" : ""}`}>
                      {word}
                    </span>
                    {j < line.length - 1 && <span>&nbsp;</span>}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p data-hero="copy" className="hero-init mt-8 max-w-xl text-lg leading-relaxed text-ivory-100/70 sm:text-xl">
            Photograph an old phone, laptop or charger. SecondLife AI maps what is still valuable inside and points you to
            the repair, reuse or recycling route that gives it the longest next life.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span data-hero="cta" className="hero-init">
              <ButtonLink href="/analyze" size="lg" magnetic>
                Analyze a Device
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </ButtonLink>
            </span>
            <span data-hero="cta" className="hero-init">
              <ButtonLink href="/process" size="lg" variant="secondary">
                Explore the Process
              </ButtonLink>
            </span>
          </div>
        </motion.div>

        <motion.div
          data-hero="art"
          className="hero-init relative mx-auto aspect-[600/680] w-full max-w-[34rem] [perspective:1200px]"
          style={{ y: artY }}
        >
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY }} className="h-full w-full">
            <ExplodedPhone spread={spread} className="h-full w-full" />
          </motion.div>
          {CALLOUTS.map((c) => (
            <div
              key={c.label}
              data-hero="callout"
              className={`hero-init absolute hidden rounded-xl border border-ivory-100/15 bg-forest-900/80 px-3 py-2 backdrop-blur-md sm:block ${c.className}`}
            >
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cyan-300">{c.label}</p>
              <p className="mt-0.5 text-sm text-ivory-100/80">{c.note}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <a
        href="#problem"
        data-hero="cue"
        className="hero-init absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-ivory-100/50 transition-colors hover:text-lime-500"
      >
        <span className="eyebrow">Scroll the story</span>
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-current p-1">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce motion-reduce:animate-none" aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
