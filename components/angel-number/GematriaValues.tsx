import { SourceBadge } from "@/components/mystic/SourceBadge";
import type { AngelNumberGematriaValues } from "@/types/angel-number";

interface GematriaValuesProps {
  values: AngelNumberGematriaValues;
}

const labels: Array<[keyof AngelNumberGematriaValues, string]> = [
  ["hebrew", "Hebrew"],
  ["english", "English"],
  ["simple", "Simple"],
  ["jewish", "Jewish"],
  ["reduction", "Reduction"],
];

export function GematriaValues({ values }: GematriaValuesProps) {
  return (
    <div className="observatory-card space-y-6 p-5 md:p-7">
      <SourceBadge tone="gematria">Gematria · Calculation</SourceBadge>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {labels.map(([key, label]) => (
          <div
            key={key}
            className="rounded-[4px] border border-[var(--stroke-hairline)] bg-[rgba(26,26,38,0.62)] p-4"
          >
            <div className="observatory-eyebrow text-[var(--ink-muted)]">
              {label}
            </div>
            <div className="observatory-mono mt-3 text-4xl font-light text-[var(--vellum-300)]">
              {values[key].toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
