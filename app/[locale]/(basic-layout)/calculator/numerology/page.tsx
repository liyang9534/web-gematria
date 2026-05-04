import { NumerologyCalculator } from "@/components/calculator/NumerologyCalculator";
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
    title: "Numerology Calculator",
    description:
      "Calculate life path, expression, soul urge and personality numbers from your name and birthday.",
    locale: locale as Locale,
    path: "/calculator/numerology",
    canonicalUrl: "/calculator/numerology",
    availableLocales: ["en"],
  });
}

export default function NumerologyCalculatorPage() {
  return (
    <CalculatorLayout
      eyebrow="Numerology calculator"
      title="Decode your name and birthday numbers."
      description="Enter a full name and birthday to calculate the four core numerology signals."
    >
      <NumerologyCalculator />
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
      <MysticBackdrop variant="quiet" />
      <div className="container relative mx-auto space-y-8 px-4 py-12">
        <MysticSectionTitle eyebrow={eyebrow} title={title} description={description} />
        <MysticSurface className="p-5 md:p-7">{children}</MysticSurface>
      </div>
    </main>
  );
}
