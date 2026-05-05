import { NumberSearch } from "@/components/angel-number/NumberSearch";
import { PopularNumberGrid } from "@/components/angel-number/PopularNumberGrid";
import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { Button } from "@/components/ui/button";
import { getFeaturedAngelNumbers } from "@/lib/angel-numbers";
import { constructMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
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
    <main className="observatory-theme relative min-h-screen w-full overflow-hidden">
      <MysticBackdrop />
      <section className="relative">
        <div className="container mx-auto grid gap-12 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-16 md:py-28">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="observatory-eyebrow">
                Angel number database
              </p>
              <h1 className="observatory-display max-w-4xl text-5xl leading-[1.05] text-[var(--ink-pure)] md:text-7xl">
                Decode the number that keeps finding you.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--ink-secondary)]">
                Start with the core repeating numbers, then move into love,
                career, money, spiritual perspective, numerology and gematria
                as separate layers.
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
                className="group observatory-card p-5 transition duration-200 hover:border-[var(--stroke-active)] hover:bg-[var(--void-membrane)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="observatory-mono text-5xl font-light tracking-[-0.04em] text-[var(--vellum-300)]">
                      {angelNumber.number}
                    </div>
                    <p className="mt-2 text-sm text-[var(--ink-secondary)]">
                      {angelNumber.shortMeaning}
                    </p>
                  </div>
                  <span className="text-[var(--vellum-500)]" aria-hidden="true">
                    ✦
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative container mx-auto space-y-8 px-5 py-24 md:px-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <MysticSectionTitle
            eyebrow="Indexed guides"
            title="High-frequency angel number entrances"
            description="These are curated SEO pages. Any other valid number remains available as an instant reading, but does not enter the search index by default."
          />
          <Button asChild variant="outline" className="observatory-button w-fit">
            <Link href="/calculator">
              Open calculators
            </Link>
          </Button>
        </div>
        <PopularNumberGrid numbers={featuredNumbers} />
        <MysticSurface className="p-6">
          <p className="text-sm leading-7 text-[var(--ink-secondary)]">
            The database is no longer limited to repeating numbers. Use the search box for
            dates, clock times, receipts, addresses or any number sequence up to 12 digits.
            Curated high-frequency pages remain indexed; generated readings stay noindex.
          </p>
        </MysticSurface>
      </section>
    </main>
  );
}
