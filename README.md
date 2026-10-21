# SecondLife AI

**Don't discard it. Discover its next life.**

SecondLife AI helps people work out what to do with electronics they no longer use: repair, reuse, refurbish, donate or recycle. This repository is a working prototype built with Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis and Three.js.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Story-led home page: problem, possibility, AI solution, workflow, impact, use cases |
| `/analyze` | Upload a photo, choose category and condition, and get a ranked set of next-life routes |
| `/process` | The six stages from upload to impact tracking |
| `/impact` | Impact dashboard: synthetic sample data, or your own analyses saved in this browser |
| `/destinations` | Searchable, filterable directory of destination types |
| `/privacy` | What happens to your photo and history |

## What is real and what is demo

- **Analysis is a demo.** No AI model, image-recognition service or valuation engine is connected. `src/lib/analysis/demo-provider.ts` produces deterministic results from the category, condition and notes you enter, and every result is labelled as a demo. To connect a real model, implement the `AnalysisProvider` interface in `src/lib/analysis/types.ts` (ideally behind a server-side API route that keeps credentials secret) and return it from `getAnalysisProvider()`.
- **Destinations are illustrative.** The entries in `src/data/destinations.ts` are fictional. "Use my location" does not search near you; distances are from a demo city centre.
- **Dashboard sample data is synthetic** (`src/data/sample-dashboard.ts`). Your own history is stored only in your browser's localStorage.
- **E-waste figures on the home page** come from the Global E-waste Monitor 2024 (ITU & UNITAR), linked on the page.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # type-check
```

Deploy by importing the repository into Vercel; no environment variables are required. `NEXT_PUBLIC_SITE_URL` can optionally be set for absolute metadata URLs.

## Motion and accessibility

Animations respect `prefers-reduced-motion`. Lenis smooth scrolling is skipped for reduced motion and touch devices. The Three.js scene loads lazily, pauses off-screen, and falls back to SVG when WebGL is unavailable.
