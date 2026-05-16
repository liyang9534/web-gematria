import { MyAngelNumberCalculator } from "@/components/calculator/MyAngelNumberCalculator";
import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { SourceBadge } from "@/components/mystic/SourceBadge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Calculator, Hash } from "lucide-react";

type Params = Promise<{ locale: string }>;

const methodCards = [
  {
    title: "Birthday method",
    text: "This method adds every digit in your date of birth and reduces the total to a single digit or master number. It works best when someone is asking for a stable personal number rather than a momentary sign.",
  },
  {
    title: "Name method",
    text: "This method converts the letters in your name with A=1 through Z=26, then reduces the sum. It gives a second angle based on identity, language and the name you choose to enter.",
  },
];

const readingSteps = [
  "Start with the number, not a promise. Treat the result as a symbolic lens, then compare it with what is actually happening in your life.",
  "Open the full angel number meaning page for love, career, money, spiritual and numerology context.",
  "If the birthday and name methods give different numbers, read both. A useful result should clarify a pattern rather than force one fixed answer.",
];

const faqs = [
  {
    question: "What is my angel number?",
    answer:
      "Your angel number can be calculated from a birthday, a name, or noticed as a repeated number in daily life. This page gives a personal starting point, then links each result to a fuller meaning page.",
  },
  {
    question: "Can I have more than one angel number?",
    answer:
      "Yes. The birthday method and name method can produce different numbers because they measure different inputs. Read them as separate perspectives rather than competing answers.",
  },
  {
    question: "Which method should I use?",
    answer:
      "Use the birthday method for a steady personal number. Use the name method when you want to explore the symbolic value of a name, nickname, pen name or business name.",
  },
  {
    question: "Is this the same as a full numerology profile?",
    answer:
      "No. This calculator is the quick entry point. The full numerology calculator also includes life path, expression, soul urge, personality and birthday numbers.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    title: "What Is My Angel Number Calculator",
    description:
      "Find your angel number from your birthday or name. Learn how each method works, compare both results and read the full meaning.",
    locale: locale as Locale,
    path: "/calculator/my-angel-number",
    canonicalUrl: "/calculator/my-angel-number",
    availableLocales: ["en"],
  });
}

export default function MyAngelNumberCalculatorPage() {
  return (
    <main className="observatory-theme relative min-h-screen w-full overflow-hidden">
      <MysticBackdrop variant="quiet" />
      <div className="container relative mx-auto space-y-10 px-5 py-16 md:px-16 md:py-24">
        <MysticSectionTitle
          eyebrow="Personal angel number"
          title="What Is My Angel Number?"
          description="Use a birthday, a name, or both to find a personal angel number. The calculator gives a quick result, then the sections below explain what the number can and cannot tell you."
        />
        <MysticSurface className="p-5 md:p-7">
          <MyAngelNumberCalculator
            baseUrl={`${siteConfig.url}/calculator/my-angel-number`}
          />
        </MysticSurface>

        <section className="grid gap-5 lg:grid-cols-[0.8fr_1fr]">
          <MysticSurface className="p-5 md:p-7">
            <SourceBadge tone="angel">Interpretation frame</SourceBadge>
            <h2 className="observatory-display mt-5 text-4xl text-[var(--ink-pure)]">
              How this calculator works
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-secondary)]">
              The phrase "my angel number" can mean a few different things. Some
              people mean the number they keep seeing in daily life. Others mean
              a personal number derived from a birthday or name. This calculator
              focuses on the second meaning so the result is repeatable and easy
              to compare.
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-secondary)]">
              It does not claim that one number defines you completely. It gives
              you a clean starting point, then sends you to the full angel number
              guide where the interpretation is split into life areas.
            </p>
          </MysticSurface>

          <div className="grid gap-4 md:grid-cols-2">
            {methodCards.map((method) => (
              <MysticSurface key={method.title} as="article" className="p-5">
                <SourceBadge tone="numerology">Calculation method</SourceBadge>
                <h3 className="observatory-display mt-5 text-3xl text-[var(--ink-pure)]">
                  {method.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-secondary)]">
                  {method.text}
                </p>
              </MysticSurface>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
          <MysticSurface className="p-5 md:p-7">
            <MysticSectionTitle
              eyebrow="After the number"
              title="How to read your result"
              description="A number is most useful when it turns attention into a practical question."
            />
            <div className="mt-6 space-y-4">
              {readingSteps.map((step, index) => (
                <div
                  key={step}
                  className="grid gap-4 border-t border-[var(--stroke-hairline)] pt-4 md:grid-cols-[3rem_1fr]"
                >
                  <div className="observatory-mono text-2xl text-[var(--vellum-300)]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="text-sm leading-7 text-[var(--ink-secondary)]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </MysticSurface>

          <MysticSurface className="p-5 md:p-7">
            <SourceBadge tone="gematria">Next paths</SourceBadge>
            <div className="mt-5 space-y-3">
              <NextPath
                href="/angel-number"
                icon={<BookOpen className="size-5" />}
                title="Angel number database"
                text="Browse curated meanings for common repeating and symbolic numbers."
              />
              <NextPath
                href="/calculator/numerology"
                icon={<Calculator className="size-5" />}
                title="Full numerology calculator"
                text="Compare life path, expression, soul urge, personality and birthday numbers."
              />
              <NextPath
                href="/calculator/gematria"
                icon={<Hash className="size-5" />}
                title="Gematria calculator"
                text="Use words and names as numeric inputs across multiple cipher systems."
              />
            </div>
          </MysticSurface>
        </section>

        <section className="space-y-5">
          <MysticSectionTitle
            eyebrow="Calculator notes"
            title="Questions people ask"
            description="Short answers for the search intent behind this tool."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <MysticSurface key={faq.question} as="article" className="p-5">
                <h3 className="observatory-display text-2xl text-[var(--ink-pure)]">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-secondary)]">
                  {faq.answer}
                </p>
              </MysticSurface>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function NextPath({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="observatory-button h-auto w-full justify-start whitespace-normal p-4 text-left"
    >
      <Link href={href} className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <span className="text-[var(--vellum-500)]" aria-hidden="true">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-sm text-[var(--ink-pure)]">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-[var(--ink-secondary)]">
            {text}
          </span>
        </span>
        <ArrowRight className="size-4 text-[var(--ink-muted)]" aria-hidden="true" />
      </Link>
    </Button>
  );
}
