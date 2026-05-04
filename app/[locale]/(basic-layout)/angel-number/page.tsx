import { NumberSearch } from "@/components/angel-number/NumberSearch";
import { PopularNumberGrid } from "@/components/angel-number/PopularNumberGrid";
import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { Button } from "@/components/ui/button";
import { getFeaturedAngelNumbers } from "@/lib/angel-numbers";
import { constructMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Calculator, Sparkles } from "lucide-react";
import type { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    title: "Angel Number Decoder",
    description:
      "Decode angel numbers 111 through 999 with love, career, money, spiritual and numerology meanings.",
    locale: locale as Locale,
    path: "/angel-number",
    canonicalUrl: "/angel-number",
    availableLocales: ["en"],
  });
}

export default function AngelNumberHubPage() {
  const featuredNumbers = getFeaturedAngelNumbers();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#08080d] text-white">
      <MysticBackdrop />
      <section className="relative">
        <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.32em] text-teal-200">
                Angel number database
              </p>
              <h1 className="max-w-4xl font-serif text-5xl font-semibold tracking-normal md:text-7xl">
                Decode the number that keeps finding you.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                Start with the core repeating numbers and read their meaning across love,
                career, money, spiritual growth, numerology and gematria.
              </p>
            </div>
            <NumberSearch
              popularNumbers={["111", "222", "333", "444", "555"]}
            />
          </div>

          <div className="grid content-center gap-3">
            {featuredNumbers.slice(0, 3).map((angelNumber) => (
              <Link
                key={angelNumber.slug}
                href={`/angel-number/${angelNumber.slug}`}
                className="group rounded-lg border border-white/10 bg-white/[0.06] p-5 transition hover:border-amber-300/60 hover:bg-white/[0.09] hover:shadow-[0_0_40px_rgba(245,158,11,0.12)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-mono text-4xl font-semibold text-amber-300">
                      {angelNumber.number}
                    </div>
                    <p className="mt-1 text-sm text-zinc-300">
                      {angelNumber.shortMeaning}
                    </p>
                  </div>
                  <Sparkles className="size-5 text-teal-200 transition group-hover:text-amber-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative container mx-auto space-y-8 px-4 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <MysticSectionTitle
            eyebrow="Indexed guides"
            title="High-frequency angel number entrances"
            description="These are curated SEO pages. You can still enter any other number above for an instant noindex reading."
          />
          <Button asChild variant="outline" className="w-fit rounded-md">
            <Link href="/calculator">
              <Calculator className="size-4" />
              Open calculators
            </Link>
          </Button>
        </div>
        <PopularNumberGrid numbers={featuredNumbers} />
        <MysticSurface className="p-6">
          <p className="text-sm leading-7 text-zinc-300">
            The database is no longer limited to repeating numbers. Use the search box for
            dates, clock times, receipts, addresses or any number sequence up to 12 digits.
            Curated high-frequency pages remain indexed; generated readings stay noindex.
          </p>
        </MysticSurface>
      </section>
    </main>
  );
}
