import { GematriaCalculator } from "@/components/calculator/GematriaCalculator";
import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { constructMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import type { ReactNode } from "react";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    title: "Gematria Calculator",
    description:
      "Free gematria calculator for Hebrew, English ordinal, reverse ordinal, English x6 and reduction systems.",
    locale: locale as Locale,
    path: "/calculator/gematria",
    canonicalUrl: "/calculator/gematria",
    availableLocales: ["en"],
  });
}

export default function GematriaCalculatorPage() {
  return (
    <CalculatorLayout
      eyebrow="Gematria calculator"
      title="The flagship cipher surface."
      description="Type an English or Hebrew word and compare Hebrew, ordinal, reverse, x6 and reduction systems instantly."
    >
      <GematriaCalculator />
    </CalculatorLayout>
  );
}

function CalculatorLayout({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#08080d] text-white">
      <MysticBackdrop />
      <div className="container relative mx-auto w-full max-w-7xl space-y-8 overflow-hidden px-4 py-12">
        <MysticSectionTitle eyebrow={eyebrow} title={title} description={description} />
        <MysticSurface className="min-w-0 p-4 md:p-7">{children}</MysticSurface>
      </div>
    </main>
  );
}
