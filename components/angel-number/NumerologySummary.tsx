import type { AngelNumberNumerology } from "@/types/angel-number";

interface NumerologySummaryProps {
  numerology: AngelNumberNumerology;
}

export function NumerologySummary({ numerology }: NumerologySummaryProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-amber-200/20 bg-amber-300/10 font-mono text-4xl font-semibold text-amber-200">
          {numerology.rootNumber}
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Root number
          </p>
          <p className="font-mono text-sm text-zinc-400">
            {numerology.calculation}
          </p>
          <p className="text-base leading-7 text-zinc-100">{numerology.rootMeaning}</p>
        </div>
      </div>
    </div>
  );
}
