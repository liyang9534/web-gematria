import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { RitualDivider } from "@/components/mystic/RitualDivider";
import { SourceBadge } from "@/components/mystic/SourceBadge";
import { Button } from "@/components/ui/button";
import { Link, type Locale } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, BrainCircuit, FileText, Sparkles } from "lucide-react";

type Params = Promise<{ locale: string }>;

const plannedTools = [
  {
    title: "Personal number reading",
    description:
      "A guided interpretation that combines angel number patterns, numerology roots and the context you bring.",
    icon: Sparkles,
  },
  {
    title: "Pattern finder",
    description:
      "A future workspace for repeated dates, receipts, names and number clusters that need a calmer second look.",
    icon: BrainCircuit,
  },
  {
    title: "PDF report",
    description:
      "A polished reading format for users who want to save, revisit or share a deeper symbolic analysis.",
    icon: FileText,
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    title: "AI Number Interpreter",
    description:
      "AI-powered angel number and numerology interpretation, built on curated number meanings, calculators and symbolic pattern analysis.",
    locale: locale as Locale,
    path: "/ai",
    canonicalUrl: "/ai",
    availableLocales: ["en"],
  });
}

export default function AILandingPage() {
  return (
    <main className="observatory-theme relative min-h-screen overflow-hidden">
      <MysticBackdrop />
      <section className="relative min-h-[88vh] px-5 py-16 md:px-16 md:py-24">
        <div className="container relative mx-auto grid min-h-[72vh] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-4xl space-y-8">
            <SourceBadge tone="ai">AI interpretation · Preview</SourceBadge>
            <div className="space-y-5">
              <h1 className="observatory-display max-w-5xl text-5xl leading-[1.04] text-[var(--ink-pure)] md:text-7xl">
                AI Number Interpreter
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--ink-secondary)] md:text-xl">
                A future reading layer for people who want angel numbers,
                numerology and symbolic patterns interpreted with more personal
                context.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="observatory-button">
                <Link href="/angel-number">
                  Start with the free decoder
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="observatory-button">
                <Link href="/calculator">
                  Open calculators
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[460px] overflow-hidden border border-[var(--stroke-default)] bg-[var(--void-elevated)] p-5">
            <div className="absolute inset-0 bg-[linear-gradient(var(--constellation-grid)_1px,transparent_1px),linear-gradient(90deg,var(--constellation-grid-cross)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
            <div className="absolute left-8 top-12 observatory-mono text-7xl font-light text-[var(--vellum-300)] [text-shadow:var(--glow-vellum)]">
              1212
            </div>
            <div className="absolute right-8 top-28 observatory-mono text-4xl text-[var(--ink-secondary)]">
              44
            </div>
            <div className="absolute bottom-24 left-10 observatory-mono text-5xl text-[var(--cloister-300)]">
              777
            </div>
            <div className="absolute bottom-12 right-12 observatory-mono text-8xl font-light text-[var(--ink-whisper)]">
              0
            </div>
            <div className="absolute left-[18%] top-[38%] h-px w-[58%] rotate-[18deg] bg-[var(--stroke-default)]" />
            <div className="absolute left-[24%] top-[62%] h-px w-[46%] -rotate-[10deg] bg-[var(--stroke-hairline)]" />
            <div className="relative ml-auto mt-48 max-w-sm border border-[var(--ai-border)] bg-[var(--void-membrane)] p-5 backdrop-blur">
              <SourceBadge tone="ai">Reading stack</SourceBadge>
              <RitualDivider className="my-5" />
              <p className="text-sm leading-7 text-[var(--ink-secondary)]">
                Curated number meanings first. Personal AI context later. The
                index stays clean while the product path gets deeper.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative container mx-auto space-y-10 px-5 pb-24 md:px-16">
        <MysticSectionTitle
          eyebrow="Future AI layer"
          title="Built from the current number system"
          description="The AI surface will sit on top of the curated guides, arbitrary-number interpreter and calculator tools already available today."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {plannedTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <MysticSurface key={tool.title} as="article" className="p-5 md:p-6">
                <Icon className="size-5 text-[var(--vellum-500)]" aria-hidden="true" />
                <h2 className="observatory-display mt-5 text-2xl text-[var(--ink-pure)]">
                  {tool.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--ink-secondary)]">
                  {tool.description}
                </p>
              </MysticSurface>
            );
          })}
        </div>
        <MysticSurface className="p-5 md:p-6">
          <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
            <BadgeCheck className="size-6 text-[var(--cloister-300)]" aria-hidden="true" />
            <p className="text-sm leading-7 text-[var(--ink-secondary)]">
              Search-indexed pages stay curated and finite. Instant generated
              readings remain available for users while staying out of the
              sitemap by default.
            </p>
            <Button asChild variant="outline" className="observatory-button w-fit">
              <Link href="/angel-number/444">Read 444</Link>
            </Button>
          </div>
        </MysticSurface>
      </section>
    </main>
  );
}
