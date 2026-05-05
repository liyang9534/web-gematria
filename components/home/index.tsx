import { PopularNumberGrid } from "@/components/angel-number/PopularNumberGrid";
import { SmartSearchBar } from "@/components/decoder/SmartSearchBar";
import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getFeaturedAngelNumbers } from "@/lib/angel-numbers";
import type { ReactNode } from "react";

export default async function HomeComponent() {
  const featuredNumbers = getFeaturedAngelNumbers();

  return (
    <main className="observatory-theme relative min-h-screen w-full overflow-hidden">
      <MysticBackdrop />
      <section className="relative">
        <div className="container mx-auto grid min-h-[calc(100vh-5rem)] gap-14 px-5 py-20 md:grid-cols-[1.04fr_0.96fr] md:items-center md:px-16 lg:py-28">
          <div className="space-y-9">
            <div className="space-y-6">
              <p className="observatory-eyebrow">Angel Number Decoder</p>
              <h1 className="observatory-display max-w-4xl text-5xl leading-[1.05] text-[var(--ink-pure)] md:text-7xl">
                Decode the number or word in front of you.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--ink-secondary)]">
                Enter a number for an angel number reading, or a word for a
                precise gematria calculation. The systems stay distinct; the
                exploration stays open.
              </p>
            </div>
            <SmartSearchBar popularNumbers={["111", "222", "333", "444", "555"]} />
          </div>

          <MysticSurface className="relative min-h-[460px] overflow-hidden p-6 md:p-8">
            <div className="relative grid h-full grid-cols-3 content-center gap-3">
              {featuredNumbers.map((angelNumber, index) => (
                <Link
                  key={angelNumber.slug}
                  href={`/angel-number/${angelNumber.slug}`}
                  className="group flex aspect-square flex-col justify-between rounded-[4px] border border-[var(--stroke-hairline)] bg-[rgba(12,12,20,0.64)] p-4 transition duration-200 hover:border-[var(--stroke-active)] hover:bg-[var(--void-membrane)]"
                >
                  <span className="observatory-mono text-3xl font-light tracking-[-0.04em] text-[var(--vellum-300)] md:text-4xl">
                    {angelNumber.number}
                  </span>
                  <span className="text-xs leading-5 text-[var(--ink-secondary)]">
                    {index % 3 === 0
                      ? "Foundation"
                      : index % 3 === 1
                        ? "Pattern"
                        : "Signal"}
                  </span>
                </Link>
              ))}
            </div>
          </MysticSurface>
        </div>
      </section>

      <section className="relative container mx-auto space-y-8 px-5 py-24 md:px-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <MysticSectionTitle
            eyebrow="High-frequency readings"
            title="The core angel number readings"
            description="These curated pages stay in the SEO index. Any other valid number can still be read as an instant, shareable noindex page."
          />
          <Button asChild variant="outline" className="observatory-button w-fit">
            <Link href="/angel-number">
              View all readings
            </Link>
          </Button>
        </div>
        <PopularNumberGrid numbers={featuredNumbers} />
      </section>

      <section className="relative border-y border-[var(--stroke-hairline)] bg-[rgba(18,18,28,0.36)]">
        <div className="container mx-auto grid gap-5 px-5 py-24 md:px-16 lg:grid-cols-[1.45fr_0.55fr]">
          <MysticSurface className="p-7">
            <div className="grid gap-8 md:grid-cols-[0.72fr_0.28fr] md:items-center">
              <div className="space-y-4">
                <div className="flex size-11 items-center justify-center rounded-[4px] border border-[var(--stroke-default)] text-[var(--vellum-500)]">
                  <span aria-hidden="true">◈</span>
                </div>
                <div>
                  <p className="observatory-eyebrow">
                    Primary tool
                  </p>
                  <h2 className="observatory-display mt-3 text-5xl text-[var(--ink-pure)]">
                    Gematria Calculator
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-7 text-[var(--ink-secondary)]">
                  Calculate Hebrew, English ordinal, reverse, x6 and reduction
                  values before opening any interpretive layer.
                </p>
                <Button asChild variant="outline" className="observatory-button">
                  <Link href="/calculator/gematria">
                    Open Gematria
                    <span aria-hidden="true">→</span>
                  </Link>
                </Button>
              </div>
              <div className="rounded-[4px] border border-[var(--stroke-hairline)] bg-[var(--void-deep)] p-5">
                <div className="observatory-mono text-6xl font-light text-[var(--vellum-300)]">39</div>
                <p className="observatory-eyebrow mt-3 text-[var(--ink-muted)]">
                  ANGEL / Ordinal
                </p>
              </div>
            </div>
          </MysticSurface>
          <div className="grid gap-4">
            <ToolCard
              href="/calculator/numerology"
              icon={<span aria-hidden="true">✧</span>}
              title="Numerology"
              description="Name and birthday profile."
            />
            <ToolCard
              href="/calculator/life-path"
              icon={<span aria-hidden="true">◇</span>}
              title="Life Path"
              description="Birthday root number."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function ToolCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group block">
      <MysticSurface className="h-full p-5 transition duration-200 hover:border-[var(--stroke-active)] hover:bg-[var(--void-membrane)]">
        <div className="space-y-4">
          <div className="flex size-10 items-center justify-center rounded-[4px] border border-[var(--stroke-default)] text-[var(--cloister-300)]">
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="observatory-display text-2xl text-[var(--ink-pure)]">{title}</h3>
            <p className="text-sm leading-6 text-[var(--ink-secondary)]">
              {description}
            </p>
          </div>
        </div>
      </MysticSurface>
    </Link>
  );
}
