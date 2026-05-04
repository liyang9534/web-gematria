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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {labels.map(([key, label]) => (
        <div
          key={key}
          className="rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-sm"
        >
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            {label}
          </div>
          <div className="mt-2 font-mono text-3xl font-semibold text-amber-200">
            {values[key].toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
