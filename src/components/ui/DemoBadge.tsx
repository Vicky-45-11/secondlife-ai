import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Marks anything that is sample data or simulated output. */
export function DemoBadge({ children = "Demo data", className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-cyan-300",
        className,
      )}
    >
      <FlaskConical className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}
