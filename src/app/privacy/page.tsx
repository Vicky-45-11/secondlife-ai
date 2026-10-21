import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What SecondLife AI does with your photos and analysis history in this prototype.",
};

const POINTS = [
  {
    title: "Your photo stays in your browser",
    text: "The demo analyser runs entirely in your browser. The photo you choose is previewed locally and is not uploaded to any server.",
  },
  {
    title: "History is stored on this device",
    text: "Each analysis is saved to your browser's local storage so the impact dashboard can show your own history. It is not sent anywhere. You can remove entries or clear it all from the impact dashboard, or by clearing site data.",
  },
  {
    title: "No accounts, no tracking",
    text: "There are no sign-ups, analytics scripts or advertising trackers in this prototype.",
  },
  {
    title: "Results are simulated",
    text: "No real AI model, valuation engine or partner directory is connected yet. Results and destinations are clearly labelled as demo content.",
  },
  {
    title: "When a real model is connected",
    text: "If photos ever need to leave your device for analysis, this page will be updated to say where they go and how long they are kept before that change goes live.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="bg-forest-950 pb-32 pt-[calc(var(--header-h)+5rem)]">
      <div className="page-x max-w-4xl">
        <p className="eyebrow text-lime-500">Privacy</p>
        <h1 className="display mt-5 text-[clamp(2.8rem,6vw,5.5rem)] text-ivory-50">Plainly put.</h1>
        <dl className="mt-14 divide-y divide-ivory-100/10 border-y border-ivory-100/10">
          {POINTS.map((p) => (
            <div key={p.title} className="grid gap-3 py-8 md:grid-cols-[18rem_1fr] md:gap-10">
              <dt className="font-medium text-ivory-50">{p.title}</dt>
              <dd className="leading-relaxed text-ivory-100/70">{p.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
