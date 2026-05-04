import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import type { AngelNumberReading } from "@/types/angel-number";

interface NumberHeroProps {
  reading: AngelNumberReading;
}

export function NumberHero({ reading }: NumberHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-zinc-950 text-white">
      <MysticBackdrop />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
      <div className="relative grid gap-8 px-6 py-12 md:grid-cols-[0.8fr_1.2fr] md:px-10 lg:px-12">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-amber-300/20" />
            <div className="relative font-mono text-8xl font-semibold tracking-normal text-amber-300 drop-shadow-[0_0_36px_rgba(245,158,11,0.34)] md:text-9xl">
              {reading.number}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-5">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.32em] text-teal-200">
              {reading.source === "curated" ? "Curated angel number guide" : "Instant angel number reading"}
            </p>
            <h1 className="max-w-3xl font-serif text-4xl font-semibold tracking-normal md:text-6xl">
              {reading.title}
            </h1>
            <p className="text-xl text-amber-100">{reading.shortMeaning}</p>
          </div>
          <p className="max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
            {reading.summary}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-zinc-300">
              {reading.pattern.label}
            </span>
            <span className="rounded-md border border-amber-200/15 bg-amber-200/10 px-3 py-1 text-amber-100">
              Root {reading.numerology.rootNumber}
            </span>
            {!reading.seo.shouldIndex && (
              <span className="rounded-md border border-teal-200/15 bg-teal-200/10 px-3 py-1 text-teal-100">
                Shareable noindex reading
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
