import { GematriaCalculator } from "@/components/calculator/GematriaCalculator";
import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import type { ReactNode } from "react";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ input?: string; q?: string; value?: string }>;

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

export default async function GematriaCalculatorPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { input, q, value } = await searchParams;
  const initialInput = input ?? q ?? "Angel";

  return (
    <CalculatorLayout
      eyebrow="Gematria calculator"
      title="The flagship cipher surface."
      description="Type an English or Hebrew word and compare the calculation before opening optional interpretive layers."
    >
      <GematriaCalculator
        initialInput={initialInput}
        targetValue={value}
        baseUrl={`${siteConfig.url}/calculator/gematria`}
      />
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
    <main className="observatory-theme relative min-h-screen w-full overflow-hidden">
      <MysticBackdrop />
      <div className="container relative mx-auto w-full max-w-7xl space-y-10 overflow-hidden px-5 py-16 md:px-16 md:py-24">
        <MysticSectionTitle eyebrow={eyebrow} title={title} description={description} />
        <MysticSurface className="min-w-0 p-4 md:p-7">{children}</MysticSurface>
      </div>
    </main>
  );
}
