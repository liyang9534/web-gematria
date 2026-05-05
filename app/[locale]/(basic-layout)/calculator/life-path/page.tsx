import { LifePathCalculator } from "@/components/calculator/LifePathCalculator";
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
    title: "Life Path Number Calculator",
    description:
      "Free life path number calculator. Enter a birthday to find the numerology meaning behind your path number.",
    locale: locale as Locale,
    path: "/calculator/life-path",
    canonicalUrl: "/calculator/life-path",
    availableLocales: ["en"],
  });
}

export default function LifePathCalculatorPage() {
  return (
    <CalculatorLayout
      eyebrow="Life path calculator"
      title="Find the number behind your birthday."
      description="The life path number condenses a date of birth into one symbolic pattern."
    >
      <LifePathCalculator />
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
      <MysticBackdrop variant="quiet" />
      <div className="container relative mx-auto space-y-10 px-5 py-16 md:px-16 md:py-24">
        <MysticSectionTitle eyebrow={eyebrow} title={title} description={description} />
        <MysticSurface className="p-5 md:p-7">{children}</MysticSurface>
      </div>
    </main>
  );
}
