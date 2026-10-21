import { cn } from "@/lib/utils";

/**
 * Splits a word into letters that ripple upward one after another when the
 * word is hovered. Pure CSS (see `.hover-letters` in globals.css), so it works
 * as a server component and is skipped under reduced motion.
 */
export function HoverLetters({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("hover-letters", className)}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ "--i": i } as React.CSSProperties}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
