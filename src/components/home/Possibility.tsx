"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Chapter two: the possibility. A laptop opened up, with hotspots on parts that
 * commonly get a second life. Descriptions are general guidance, not claims
 * about any specific device.
 */

const PARTS = [
  {
    id: "ram",
    name: "Memory",
    route: "Reuse",
    x: 31,
    y: 38,
    text: "Socketed RAM can be tested and moved straight into another machine.",
  },
  {
    id: "ssd",
    name: "Storage",
    route: "Reuse after wipe",
    x: 63,
    y: 36,
    text: "An SSD can serve again once its data has been securely erased.",
  },
  {
    id: "board",
    name: "Motherboard",
    route: "Repair or recover",
    x: 47,
    y: 56,
    text: "Board-level repair can revive it. If not, it holds copper, gold and tin worth recovering.",
  },
  {
    id: "battery",
    name: "Battery",
    route: "Certified recycling",
    x: 50,
    y: 80,
    text: "Lithium-ion cells need a battery-certified recycler. Never put them in a household bin.",
  },
  {
    id: "screen",
    name: "Display",
    route: "Repair part",
    x: 50,
    y: 12,
    text: "Intact panels are one of the most requested replacement parts in repair shops.",
  },
] as const;

function OpenLaptop({ active }: { active: string }) {
  const on = (id: string) => (active === id ? 1 : 0.35);
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {/* Screen lid */}
      <rect x="18" y="2" width="64" height="22" rx="2" fill="#10261C" stroke="#F4F0E5" strokeOpacity={on("screen")} strokeWidth="0.5" />
      <rect x="21" y="5" width="58" height="16" rx="1" fill="#173527" />
      {/* Base chassis */}
      <rect x="8" y="27" width="84" height="66" rx="3" fill="#0B1A13" stroke="#F4F0E5" strokeOpacity="0.2" strokeWidth="0.5" />
      {/* RAM */}
      <g opacity={on("ram") + 0.3}>
        <rect x="20" y="33" width="22" height="4" rx="0.6" fill="#214A37" stroke="#CCFF00" strokeWidth="0.35" />
        <rect x="20" y="39" width="22" height="4" rx="0.6" fill="#214A37" stroke="#CCFF00" strokeWidth="0.35" />
      </g>
      {/* SSD */}
      <rect x="55" y="32" width="18" height="8" rx="0.8" fill="#1A1D1A" stroke="#00E5FF" strokeWidth="0.35" opacity={on("ssd") + 0.3} />
      {/* Board */}
      <g opacity={on("board") + 0.3}>
        <rect x="16" y="47" width="62" height="20" rx="1.2" fill="#10261C" stroke="#CCFF00" strokeWidth="0.35" />
        <path d="M20 52 h14 l3 -2 h10 M22 60 h20 l3 3 h12 M50 55 h20" stroke="#CCFF00" strokeWidth="0.3" fill="none" opacity="0.7" />
        <rect x="44" y="53" width="8" height="8" rx="0.6" fill="#07120D" stroke="#F4F0E5" strokeOpacity="0.5" strokeWidth="0.3" />
      </g>
      {/* Battery */}
      <g opacity={on("battery") + 0.3}>
        <rect x="18" y="71" width="64" height="17" rx="1.5" fill="#262A26" stroke="#B48A5E" strokeWidth="0.4" />
        <path d="M30 71 v17 M42 71 v17 M54 71 v17 M66 71 v17" stroke="#B48A5E" strokeOpacity="0.5" strokeWidth="0.3" />
      </g>
    </svg>
  );
}

export function Possibility() {
  const [active, setActive] = useState<string>(PARTS[2].id);
  const part = PARTS.find((p) => p.id === active) ?? PARTS[2];

  return (
    <section aria-labelledby="possibility-title" className="relative bg-forest-950 py-28 sm:py-36">
      <div className="page-x">
        <SectionHeading
          id="possibility-title"
          index="02"
          eyebrow="The possibility"
          lines={["Open it up.", <span key="l">Most of it can <em className="text-lime-500">live again.</em></span>]}
          intro="A device that no longer suits you is a bundle of parts with different futures. Tap a part to see where it usually goes."
        />

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="relative mx-auto aspect-square w-full max-w-[32rem]">
            <OpenLaptop active={active} />
            {PARTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                onMouseEnter={() => setActive(p.id)}
                aria-pressed={active === p.id}
                aria-label={`${p.name}: ${p.route}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <span
                  className={cn(
                    "relative flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                    active === p.id ? "border-lime-500 bg-lime-500" : "border-ivory-100/70 bg-forest-950/70 group-hover:border-lime-500",
                  )}
                >
                  {active === p.id && <span className="absolute inset-0 animate-ping rounded-full bg-lime-500/50 motion-reduce:hidden" />}
                  <span className={cn("h-1.5 w-1.5 rounded-full", active === p.id ? "bg-forest-950" : "bg-ivory-100")} />
                </span>
              </button>
            ))}
          </Reveal>

          <div className="lg:pl-6">
            <ul className="flex flex-wrap gap-2" aria-label="Parts">
              {PARTS.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setActive(p.id)}
                    aria-pressed={active === p.id}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      active === p.id
                        ? "border-lime-500 bg-lime-500 text-forest-950"
                        : "border-ivory-100/20 text-ivory-100/70 hover:border-ivory-100/50 hover:text-ivory-100",
                    )}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="relative mt-8 min-h-[13rem]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">Typical route · {part.route}</p>
                  <p className="display mt-4 text-5xl text-ivory-50">{part.name}</p>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-ivory-100/70">{part.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
