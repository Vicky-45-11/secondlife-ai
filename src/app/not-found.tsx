import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="page-x flex min-h-[80vh] flex-col items-start justify-center pt-24">
      <p className="eyebrow text-lime-500">404 · Lost component</p>
      <h1 className="display mt-5 text-[clamp(3rem,9vw,8rem)] text-ivory-50">This page has no second life.</h1>
      <p className="mt-6 max-w-lg text-lg text-ivory-100/60">The link may be broken or the page may have moved.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/analyze" variant="secondary">
          Analyze a device
        </ButtonLink>
      </div>
    </section>
  );
}
