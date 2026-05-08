import { AffirmationCard } from "@/components/angel-number/AffirmationCard";
import { FAQSection } from "@/components/angel-number/FAQSection";
import { GematriaValues } from "@/components/angel-number/GematriaValues";
import { MeaningTabs } from "@/components/angel-number/MeaningTabs";
import { NumberHero } from "@/components/angel-number/NumberHero";
import { NumerologySummary } from "@/components/angel-number/NumerologySummary";
import { RelatedNumbers } from "@/components/angel-number/RelatedNumbers";
import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { PullQuote } from "@/components/mystic/PullQuote";
import { SourceBadge } from "@/components/mystic/SourceBadge";
import { ShareCardActions } from "@/components/shared/ShareCardActions";
import { Button } from "@/components/ui/button";
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
  getReadingForNumber,
} from "@/lib/angel-numbers";
import {
  getAngelNumberCanonicalUrl,
  getAngelNumberKeywords,
  getAngelNumberPath,
  getAngelNumberRobotsPolicy,
} from "@/lib/angel-numbers/seo";
import { getAngelNumberStaticParams } from "@/lib/angel-numbers/static-params";
import { constructMetadata } from "@/lib/metadata";
import {
  createBreadcrumbJsonLd,
  createFAQJsonLd,
  JsonLd,
} from "@/lib/seo/json-ld";
import { buildAngelToGematriaUrl } from "@/lib/tool-bridges";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type Params = Promise<{ locale: string; number: string }>;

export function generateStaticParams() {
  return getAngelNumberStaticParams();
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
    <main className="observatory-theme relative min-h-screen w-full overflow-hidden">
      <MysticBackdrop variant="quiet" />
      {reading.source === "curated" && (
        <JsonLd id={`angel-number-${reading.slug}-faq`} data={faqJsonLd} />
      )}
      <JsonLd
        id={`angel-number-${reading.slug}-breadcrumb`}
        data={breadcrumbJsonLd}
      />

      <div className="container relative mx-auto space-y-24 px-5 py-10 md:px-16">
        <Breadcrumb className="text-[var(--ink-secondary)]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="inline-flex min-h-11 min-w-11 items-center hover:text-[var(--vellum-300)]"
                >
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/angel-number"
                  className="inline-flex min-h-11 min-w-11 items-center hover:text-[var(--vellum-300)]"
                >
                  Angel Numbers
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[var(--ink-pure)]">{reading.number}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <NumberHero
          reading={reading}
          shareInput={{
            tool: "angel",
            number: reading.number,
            resultUrl: canonicalUrl,
          }}
        />

        <PullQuote>
          {`${reading.number} · ${reading.shortMeaning}`}
        </PullQuote>

        <section className="mx-auto max-w-5xl space-y-16">
          <Section eyebrow="Angel Number" title="Meaning by life area">
            <MeaningTabs meanings={reading.meanings} />
          </Section>

          <Section eyebrow="Numeric cipher" title="Gematria values">
            <GematriaValues values={reading.gematriaValues} />
          </Section>

          <Section eyebrow="Root signal" title="Numerology root">
            <NumerologySummary numerology={reading.numerology} />
          </Section>

          <AICtaBanner number={reading.number} />

          <Section eyebrow="References" title="Biblical and symbolic notes">
            <div className="space-y-4">
              {reading.biblicalReferences.map((reference) => (
                <article
                  key={reference.verse}
                  className="observatory-card p-5 md:p-6"
                >
                  <SourceBadge tone="biblical">Biblical · Cross-reference</SourceBadge>
                  <div className="observatory-display mt-4 text-2xl text-[var(--ink-pure)]">{reference.verse}</div>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-secondary)]">
                    {reference.text}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--ink-primary)]">{reference.relevance}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section eyebrow="Constellation" title="Related numbers">
            <MysticSurface className="p-5 md:p-6">
              <RelatedNumbers numbers={reading.relatedNumbers} />
            </MysticSurface>
          </Section>

          <Section eyebrow="Questions" title="FAQ">
            <FAQSection faqs={reading.faqs} />
          </Section>

          <AffirmationCard text={reading.affirmation} />
          <MysticSurface className="p-5 md:p-6">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-3">
                <SourceBadge tone="gematria">Gematria · Cross-system</SourceBadge>
                <h2 className="observatory-display text-3xl text-[var(--ink-pure)]">
                  Curious which words equal {reading.number} in Gematria?
                </h2>
                <p className="text-sm leading-6 text-[var(--ink-secondary)]">
                  Keep the systems separate, but use the same number as a bridge
                  into the calculator.
                </p>
              </div>
              <Button asChild variant="outline" className="observatory-button">
                <Link href={buildAngelToGematriaUrl(reading.number)}>
                  Try the Gematria Calculator
                </Link>
              </Button>
            </div>
          </MysticSurface>
          <MysticSurface className="p-5 md:p-6">
            <SourceBadge tone="angel">Shareable card</SourceBadge>
            <div className="mt-5">
              <ShareCardActions
                input={{
                  tool: "angel",
                  number: reading.number,
                  resultUrl: canonicalUrl,
                }}
                variant="compact"
              />
            </div>
          </MysticSurface>
          <MysticSurface className="p-5 md:p-6">
            <SourceBadge tone={reading.seo.shouldIndex ? "angel" : "numerology"}>
              {reading.seo.shouldIndex ? "Canonical Guide" : "Instant Reading"}
            </SourceBadge>
            <p className="mt-4 text-sm leading-6 text-[var(--ink-secondary)]">
              {reading.seo.reason}
            </p>
          </MysticSurface>
        </section>
      </div>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <MysticSectionTitle eyebrow={eyebrow} title={title} />
      {children}
    </section>
  );
}
