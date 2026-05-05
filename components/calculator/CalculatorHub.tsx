import { GematriaCalculator } from "@/components/calculator/GematriaCalculator";
import { MysticSectionTitle, MysticSurface } from "@/components/mystic/MysticSurface";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Calculator, Hash, Sparkles } from "lucide-react";

const tools = [
  {
    href: "/calculator/gematria",
    title: "Gematria Calculator",
    description: "Calculate Hebrew, English ordinal, reverse, x6 and reduction values.",
    icon: Hash,
  },
  {
    href: "/calculator/numerology",
    title: "Numerology Calculator",
    description: "Decode name and birthday numbers in one compact profile.",
    icon: Sparkles,
  },
  {
    href: "/calculator/life-path",
    title: "Life Path Calculator",
    description: "Find the core birthday number and its growth pattern.",
    icon: Calculator,
  },
];

export function CalculatorHub() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.85fr_0.7fr]">
      <MysticSurface className="p-5 md:p-7">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <MysticSectionTitle
            eyebrow="Flagship tool"
            title="Gematria Calculator"
            description="A calculation-first surface for comparing words, names and Hebrew terms across multiple numeric systems."
          />
          <Button
            asChild
            variant="outline"
            className="observatory-button w-fit"
          >
            <Link href="/calculator/gematria">
              Full page
              <span aria-hidden="true">→</span>
            </Link>
          </Button>
        </div>
        <GematriaCalculator compact />
      </MysticSurface>
      <div className="grid gap-4">
        {tools.slice(1).map((tool) => {
          const Icon = tool.icon;

          return (
            <Link key={tool.href} href={tool.href} className="group block">
              <MysticSurface className="h-full p-5 transition duration-200 hover:border-[var(--stroke-active)] hover:bg-[var(--void-membrane)]">
                <div className="space-y-5">
                  <div className="flex size-11 items-center justify-center rounded-[4px] border border-[var(--stroke-default)] bg-[rgba(107,91,149,0.12)] text-[var(--cloister-100)]">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="observatory-display text-2xl text-[var(--ink-pure)]">
                      {tool.title}
                    </h2>
                    <p className="text-sm leading-6 text-[var(--ink-secondary)]">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </MysticSurface>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
