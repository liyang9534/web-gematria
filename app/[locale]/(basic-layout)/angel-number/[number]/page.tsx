import { AffirmationCard } from "@/components/angel-number/AffirmationCard";
import { FAQSection } from "@/components/angel-number/FAQSection";
import { GematriaValues } from "@/components/angel-number/GematriaValues";
import { MeaningTabs } from "@/components/angel-number/MeaningTabs";
import { NumberHero } from "@/components/angel-number/NumberHero";
import { NumerologySummary } from "@/components/angel-number/NumerologySummary";
import { RelatedNumbers } from "@/components/angel-number/RelatedNumbers";
import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { AICtaBanner } from "@/components/number-ai/AICtaBanner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/routing";
import {
  getAllAngelNumbers,
  getReadingForNumber,
} from "@/lib/angel-numbers";
import {
  getAngelNumberCanonicalUrl,
  getAngelNumberKeywords,
  getAngelNumberPath,
  getAngelNumberRobotsPolicy,
} from "@/lib/angel-numbers/seo";
import { constructMetadata } from "@/lib/metadata";
import {
  createBreadcrumbJsonLd,
  createFAQJsonLd,
  JsonLd,
} from "@/lib/seo/json-ld";
import type { Locale } from "@/i18n/routing";
import { BookOpen, Cross, Link2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type Params = Promise<{ locale: string; number: string }>;

export function generateStaticParams() {
  return getAllAngelNumbers().map((angelNumber) => ({
    number: angelNumber.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, number } = await params;

  let reading;
  try {
    reading = getReadingForNumber(number);
  } catch {
    return {};
  }

  const metadata = await constructMetadata({
    title: reading.meta.title,
    description: reading.meta.description,
    locale: locale as Locale,
    path: getAngelNumberPath(reading.slug),
    canonicalUrl: getAngelNumberPath(reading.slug),
    availableLocales: ["en"],
    noIndex: !reading.seo.shouldIndex,
    useDefaultOgImage: false,
  });

  return {
    ...metadata,
    keywords: getAngelNumberKeywords(reading),
    robots: getAngelNumberRobotsPolicy(reading) ?? metadata.robots,
  };
}

export default async function AngelNumberPage({
  params,
}: {
  params: Params;
}) {
  const { number } = await params;

  let reading;
  try {
    reading = getReadingForNumber(number);
  } catch {
    notFound();
  }

  const canonicalUrl = getAngelNumberCanonicalUrl(reading);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Angel Numbers", url: `${siteConfig.url}/angel-number` },
    { name: reading.number, url: canonicalUrl },
  ]);
  const faqJsonLd = createFAQJsonLd(reading.faqs);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#08080d] text-white">
      <MysticBackdrop variant="quiet" />
      {reading.source === "curated" && (
        <JsonLd id={`angel-number-${reading.slug}-faq`} data={faqJsonLd} />
      )}
      <JsonLd
        id={`angel-number-${reading.slug}-breadcrumb`}
        data={breadcrumbJsonLd}
      />

      <div className="container relative mx-auto space-y-10 px-4 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/angel-number">Angel Numbers</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{reading.number}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <NumberHero reading={reading} />

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Section eyebrow="Interpretation" title="Meaning by life area">
            <MeaningTabs meanings={reading.meanings} />
          </Section>

          <Section eyebrow="Numeric cipher" title="Gematria values">
            <GematriaValues values={reading.gematriaValues} />
          </Section>

          <Section eyebrow="Root signal" title="Numerology root">
            <NumerologySummary numerology={reading.numerology} />
          </Section>

          <AICtaBanner number={reading.number} />

          <Section eyebrow="References" title="Biblical and symbolic notes" icon={<Cross className="size-5" />}>
            <div className="space-y-4">
              {reading.biblicalReferences.map((reference) => (
                <article
                  key={reference.verse}
                  className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-sm"
                >
                  <div className="font-medium">{reference.verse}</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {reference.text}
                  </p>
                  <p className="mt-3 text-sm leading-6">{reference.relevance}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section eyebrow="Questions" title="FAQ">
            <FAQSection faqs={reading.faqs} />
          </Section>

          <AffirmationCard text={reading.affirmation} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <MysticSurface className="p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link2 className="size-4 text-amber-500" />
              Related numbers
            </div>
            <div className="mt-4">
              <RelatedNumbers numbers={reading.relatedNumbers} />
            </div>
          </MysticSurface>
          <MysticSurface className="p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="size-4 text-teal-600" />
              {reading.seo.shouldIndex ? "Canonical guide" : "Instant reading"}
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {reading.seo.reason}
            </p>
          </MysticSurface>
        </aside>
      </section>
      </div>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <MysticSectionTitle eyebrow={eyebrow} title={title} />
      {children}
    </section>
  );
}
