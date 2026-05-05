import { CalculatorHub } from "@/components/calculator/CalculatorHub";
import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { constructMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    title: "Numerology Calculators",
    description:
      "Free gematria, numerology and life path calculators for angel number readings.",
    locale: locale as Locale,
    path: "/calculator",
    canonicalUrl: "/calculator",
    availableLocales: ["en"],
  });
}

export default function CalculatorPage() {
  return (
    <main className="observatory-theme relative min-h-screen w-full overflow-hidden">
      <MysticBackdrop />
      <section className="relative">
        <div className="container mx-auto space-y-8 px-5 py-20 md:px-16 md:py-28">
          <div className="max-w-3xl space-y-4">
            <p className="observatory-eyebrow">
              Calculator center
            </p>
            <h1 className="observatory-display text-5xl leading-[1.05] text-[var(--ink-pure)] md:text-7xl">
              Gematria first. Numerology close behind.
            </h1>
            <p className="text-lg leading-8 text-[var(--ink-secondary)]">
              The flagship calculator is Gematria: type a word, phrase, name or
              Hebrew term and watch the numeric systems align in real time.
            </p>
          </div>
        </div>
      </section>
      <section className="relative container mx-auto px-5 py-6 pb-24 md:px-16">
        <CalculatorHub />
      </section>
    </main>
  );
}
