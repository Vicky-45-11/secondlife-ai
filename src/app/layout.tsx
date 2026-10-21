import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono, Kanit } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const kanit = Kanit({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-kanit", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

const description =
  "SecondLife AI helps you identify discarded electronics, see what is still valuable inside, and find the right repair, reuse or recycling route.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "SecondLife AI · Discover the next life of your electronics", template: "%s · SecondLife AI" },
  description,
  applicationName: "SecondLife AI",
  keywords: ["e-waste", "electronics recycling", "repair", "reuse", "circular economy", "sustainability", "AI"],
  openGraph: {
    type: "website",
    siteName: "SecondLife AI",
    title: "SecondLife AI · Every discarded device has another story",
    description,
  },
  twitter: { card: "summary_large_image", title: "SecondLife AI", description },
};

export const viewport: Viewport = {
  themeColor: "#07120D",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${kanit.variable} ${mono.variable}`}
      // The inline script below adds a "js" class before paint; React should not warn about it.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="bg-forest-950 font-body text-ivory-100">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-lime-500 px-4 py-2 text-forest-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
