import { NumberSearch } from "@/components/angel-number/NumberSearch";
import { PopularNumberGrid } from "@/components/angel-number/PopularNumberGrid";
import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getFeaturedAngelNumbers } from "@/lib/angel-numbers";
import { ArrowRight, BookOpenText, Hash, MessageSquareText, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export default async function HomeComponent() {
  const featuredNumbers = getFeaturedAngelNumbers();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#08080d] text-white">
      <MysticBackdrop />
      <section className="relative">
        <div className="container mx-auto grid min-h-[calc(100vh-5rem)] gap-12 px-4 py-16 md:grid-cols-[1.08fr_0.92fr] md:items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.32em] text-teal-200">
                Angel Number Decoder
              </p>
              <h1 className="max-w-4xl font-serif text-5xl font-semibold tracking-normal md:text-7xl">
                Decode Any Number's Hidden Meaning
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                Enter any number and move from a strange coincidence to a structured
                reading across angel number symbolism, numerology roots and gematria.
              </p>
            </div>
            <NumberSearch
              popularNumbers={["111", "222", "333", "444", "555"]}
            />
          </div>

          <MysticSurface className="relative min-h-[430px] overflow-hidden p-6">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.2),transparent_32%),linear-gradient(315deg,rgba(245,158,11,0.2),transparent_36%)]" />
            <div className="relative grid h-full grid-cols-3 content-center gap-3">
              {featuredNumbers.map((angelNumber, index) => (
                <Link
                  key={angelNumber.slug}
                  href={`/angel-number/${angelNumber.slug}`}
                  className="group flex aspect-square flex-col justify-between rounded-lg border border-white/10 bg-zinc-950/55 p-4 transition hover:-translate-y-1 hover:border-amber-300/70 hover:bg-zinc-950/75"
                >
                  <span className="font-mono text-3xl font-semibold text-amber-300 md:text-4xl">
                    {angelNumber.number}
                  </span>
                  <span className="text-xs leading-5 text-zinc-300">
                    {index % 3 === 0
                      ? "Awaken"
                      : index % 3 === 1
                        ? "Balance"
                        : "Shift"}
                  </span>
                </Link>
              ))}
            </div>
          </MysticSurface>
        </div>
      </section>

      <section className="relative container mx-auto space-y-8 px-4 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <MysticSectionTitle
            eyebrow="High-frequency portals"
            title="The core angel number readings"
            description="These curated pages stay in the SEO index. Every other number still has an instant reading, but remains noindex by default."
          />
          <Button asChild variant="outline" className="w-fit rounded-md">
            <Link href="/angel-number">
              <BookOpenText className="size-4" />
              View all readings
            </Link>
          </Button>
        </div>
        <PopularNumberGrid numbers={featuredNumbers} />
      </section>

      <section className="relative border-y border-white/10 bg-white/[0.025]">
        <div className="container mx-auto grid gap-5 px-4 py-14 lg:grid-cols-[1.45fr_0.55fr]">
          <MysticSurface className="p-7">
            <div className="grid gap-8 md:grid-cols-[0.72fr_0.28fr] md:items-center">
              <div className="space-y-4">
                <div className="flex size-11 items-center justify-center rounded-lg border border-amber-200/20 bg-amber-300/10 text-amber-200">
                  <Hash className="size-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-teal-200/80">
                    Primary tool
                  </p>
                  <h2 className="mt-3 font-serif text-4xl font-semibold tracking-normal">
                    Gematria Calculator
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-7 text-zinc-300">
                  Calculate Hebrew, English ordinal, reverse ordinal, x6 and reduction
                  values. This is the main calculator behind the decoder experience.
                </p>
                <Button asChild className="rounded-md bg-amber-300 text-zinc-950 hover:bg-amber-200">
                  <Link href="/calculator/gematria">
                    Open Gematria
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-5">
                <div className="font-mono text-5xl font-semibold text-amber-300">39</div>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-zinc-500">
                  ANGEL / Ordinal
                </p>
              </div>
            </div>
          </MysticSurface>
          <div className="grid gap-4">
            <ToolCard
              href="/calculator/numerology"
              icon={<Sparkles className="size-5" />}
              title="Numerology"
              description="Name and birthday profile."
            />
            <ToolCard
              href="/calculator/life-path"
              icon={<MessageSquareText className="size-5" />}
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
      <MysticSurface className="h-full p-5 transition hover:-translate-y-0.5 hover:border-teal-300/40">
        <div className="space-y-4">
          <div className="flex size-10 items-center justify-center rounded-lg border border-teal-200/15 bg-teal-200/10 text-teal-100">
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-normal text-white">{title}</h3>
            <p className="text-sm leading-6 text-zinc-300">
              {description}
            </p>
          </div>
        </div>
      </MysticSurface>
    </Link>
  );
}
