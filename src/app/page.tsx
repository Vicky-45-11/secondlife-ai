import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { Possibility } from "@/components/home/Possibility";
import { AiSolution } from "@/components/home/AiSolution";
import { Workflow } from "@/components/home/Workflow";
import { ImpactPreview } from "@/components/home/ImpactPreview";
import { UseCases } from "@/components/home/UseCases";
import { FinalCta } from "@/components/home/FinalCta";
import { Marquee } from "@/components/fx/Marquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Marquee tone="lime" words={["Repair", "Reuse", "Refurbish", "Donate", "Recycle"]} />
      <Possibility />
      <AiSolution />
      <Workflow />
      <ImpactPreview />
      <UseCases />
      <Marquee baseVelocity={2} words={["Don't discard it", "Discover its next life"]} />
      <FinalCta />
    </>
  );
}
