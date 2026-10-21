import { cn } from "@/lib/utils";
import { SplitHeadline, Reveal } from "@/components/motion/Reveal";
import { ScrambleText } from "@/components/fx/ScrambleText";

export function SectionHeading({
  index,
  eyebrow,
  lines,
  intro,
  tone = "dark",
  className,
  id,
  as,
}: {
  id?: string;
  /** Use "h1" when the heading opens a page. */
  as?: "h1" | "h2";
  index?: string;
  eyebrow: string;
  lines: React.ReactNode[];
  intro?: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const muted = tone === "dark" ? "text-ivory-100/60" : "text-forest-900/60";
  return (
    <div className={cn("max-w-4xl", className)}>
      <Reveal className={cn("eyebrow flex items-center gap-3", tone === "dark" ? "text-lime-500" : "text-forest-600")}>
        {index && <span className={muted}>{index}</span>}
        <span className={cn("h-px w-8", tone === "dark" ? "bg-ivory-100/25" : "bg-forest-900/25")} aria-hidden="true" />
        <ScrambleText text={eyebrow} />
      </Reveal>
      <SplitHeadline as={as} id={id} lines={lines} className="display mt-5 text-[clamp(2.5rem,6vw,5.5rem)]" />
      {intro && (
        <Reveal delay={0.15} className={cn("mt-6 max-w-2xl text-lg leading-relaxed", muted)}>
          {intro}
        </Reveal>
      )}
    </div>
  );
}
