import { SourceBadge } from "@/components/mystic/SourceBadge";
import { Button } from "@/components/ui/button";

interface AICtaBannerProps {
  number?: string;
}

export function AICtaBanner({ number }: AICtaBannerProps) {
  return (
    <section className="observatory-card p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <SourceBadge tone="ai">AI Reading · Planned</SourceBadge>
          <h2 className="observatory-display pt-3 text-3xl text-[var(--ink-pure)]">
            A more personal reading{number ? ` for ${number}` : ""}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-[var(--ink-secondary)]">
            The AI interpreter will combine the calculation, symbolic reading and context in a later freemium phase.
          </p>
        </div>
        <Button variant="outline" className="observatory-button w-fit" disabled>
          <span aria-hidden="true">✦</span>
          Coming soon
        </Button>
      </div>
    </section>
  );
}
