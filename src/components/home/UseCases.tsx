"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Recycle, User, Wrench, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/** Chapter six: who it is for. These describe intended uses, not existing customers. */

const CASES: { id: string; label: string; icon: LucideIcon; title: string; text: string; points: string[] }[] = [
  {
    id: "individuals",
    label: "Individuals",
    icon: User,
    title: "Clear the drawer with a clear conscience.",
    text: "Find out whether that old phone is worth fixing, selling, giving away or recycling, without needing to know what is inside it.",
    points: ["Know what it's worth before you let it go", "Get a reason, not just a bin", "Keep a private history of what you've saved"],
  },
  {
    id: "repair",
    label: "Repair shops",
    icon: Wrench,
    title: "Triage faster at the counter.",
    text: "A first read on a device's condition and likely repairs helps shops quote quickly and spot donor parts worth keeping.",
    points: ["Consistent intake notes", "Donor-part opportunities flagged", "Customers arrive knowing what to expect"],
  },
  {
    id: "recyclers",
    label: "Recyclers",
    icon: Recycle,
    title: "Better-sorted streams in.",
    text: "When devices arrive already sorted into reuse and recovery, recyclers spend less effort separating what still works from what doesn't.",
    points: ["Batteries flagged before collection", "Reusable devices diverted earlier", "Cleaner material streams"],
  },
  {
    id: "organizations",
    label: "Organizations",
    icon: Building2,
    title: "Retire IT equipment responsibly.",
    text: "Schools, offices and councils can plan device refreshes with every machine routed to donation, refurbishment or certified recycling.",
    points: ["One flow for a whole fleet", "Data-wipe needs called out", "Reporting built on recorded decisions"],
  },
];

export function UseCases() {
  const [active, setActive] = useState(CASES[0].id);
  const base = useId();
  const c = CASES.find((x) => x.id === active) ?? CASES[0];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = CASES[(i + dir + CASES.length) % CASES.length];
    setActive(next.id);
    document.getElementById(`${base}-tab-${next.id}`)?.focus();
  };

  return (
    <section aria-labelledby="usecases-title" className="bg-ivory-100 py-28 text-forest-950 sm:py-36">
      <div className="page-x">
        <SectionHeading id="usecases-title" index="06" eyebrow="Who it's for" tone="light" lines={["Built for everyone", "who holds a device."]} />

        <div role="tablist" aria-label="Use cases" className="mt-14 flex flex-wrap gap-2">
          {CASES.map((x, i) => (
            <button
              key={x.id}
              id={`${base}-tab-${x.id}`}
              role="tab"
              type="button"
              aria-selected={active === x.id}
              aria-controls={`${base}-panel`}
              tabIndex={active === x.id ? 0 : -1}
              onClick={() => setActive(x.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors",
                active === x.id ? "text-ivory-50" : "text-forest-900/70 hover:text-forest-950",
              )}
            >
              {active === x.id && (
                <motion.span layoutId="usecase-pill" className="absolute inset-0 rounded-full bg-forest-900" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <x.icon className="relative h-4 w-4" aria-hidden="true" />
              <span className="relative">{x.label}</span>
            </button>
          ))}
        </div>

        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${active}`}
          className="mt-10 min-h-[20rem] border-t border-forest-950/15 pt-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div>
                <h3 className="display text-[clamp(2.2rem,4.5vw,4rem)]">{c.title}</h3>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-forest-900/70">{c.text}</p>
              </div>
              <ul className="space-y-4 self-end">
                {c.points.map((p, i) => (
                  <li key={p} className="flex items-baseline gap-4 border-b border-forest-950/10 pb-4 text-lg">
                    <span className="font-mono text-xs text-forest-600">{String(i + 1).padStart(2, "0")}</span>
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
