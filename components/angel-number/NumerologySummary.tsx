import { SourceBadge } from "@/components/mystic/SourceBadge";
import type { AngelNumberNumerology } from "@/types/angel-number";

interface NumerologySummaryProps {
  numerology: AngelNumberNumerology;
}

export function NumerologySummary({ numerology }: NumerologySummaryProps) {
  return (
    <div className="observatory-card p-5 md:p-7">
      <SourceBadge tone="numerology">Numerology · Perspective</SourceBadge>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="observatory-mono mt-5 flex size-20 shrink-0 items-center justify-center rounded-[4px] border border-[rgba(123,111,168,0.44)] bg-[rgba(107,91,149,0.12)] text-4xl font-light text-[var(--cloister-100)] sm:mt-0">
          {numerology.rootNumber}
        </div>
        <div className="space-y-3">
          <p className="observatory-eyebrow text-[var(--ink-muted)]">
            Root number
          </p>
          <p className="observatory-mono text-sm text-[var(--ink-secondary)]">
            {numerology.calculation}
          </p>
          <p className="text-base leading-7 text-[var(--ink-primary)]">
            {numerology.rootMeaning}
          </p>
        </div>
      </div>
    </div>
  );
}
