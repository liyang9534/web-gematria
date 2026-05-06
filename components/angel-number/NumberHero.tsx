import { MysticBackdrop } from "@/components/mystic/MysticBackdrop";
import { RitualDivider } from "@/components/mystic/RitualDivider";
import { SourceBadge } from "@/components/mystic/SourceBadge";
import { ShareCardActions } from "@/components/shared/ShareCardActions";
import type { ShareCardInput } from "@/lib/share-cards";
import type { AngelNumberReading } from "@/types/angel-number";

interface NumberHeroProps {
  reading: AngelNumberReading;
  shareInput?: ShareCardInput;
}

export function NumberHero({ reading, shareInput }: NumberHeroProps) {
  return (
    <section className="number-hero observatory-card relative min-h-[520px] overflow-hidden px-5 py-20 text-center md:px-10 md:py-28">
      <MysticBackdrop />
      <div className="absolute inset-0 [background-image:var(--hero-radial)]" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center">
        <SourceBadge tone="angel">
          {reading.source === "curated"
            ? "Angel Number · Interpretation"
            : "Angel Number · Instant Reading"}
        </SourceBadge>
        <div
          aria-label={`Angel Number ${reading.number}`}
          className="observatory-mono mt-10 text-[7rem] font-light leading-none tracking-[-0.04em] text-[var(--vellum-300)] [text-shadow:var(--glow-vellum)] md:text-[12rem]"
        >
          {reading.number}
        </div>
        <RitualDivider className="my-7" />
        <h1 className="observatory-display max-w-3xl text-4xl italic text-[var(--ink-pure)] md:text-6xl">
          {reading.title}
        </h1>
        <p className="mt-5 text-xl text-[var(--vellum-300)] md:text-2xl">
          {reading.shortMeaning}
        </p>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[var(--ink-secondary)] md:text-lg">
          {reading.summary}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs">
          <span className="rounded-full border border-[var(--stroke-default)] px-3 py-1 text-[var(--ink-secondary)]">
            {reading.pattern.label}
          </span>
          <span className="rounded-full border border-[var(--vellum-border)] px-3 py-1 text-[var(--vellum-300)]">
            Root {reading.numerology.rootNumber}
          </span>
          {!reading.seo.shouldIndex && (
            <span className="rounded-full border border-[var(--cloister-border)] px-3 py-1 text-[var(--cloister-300)]">
              Shareable noindex reading
            </span>
          )}
        </div>
        {shareInput && (
          <ShareCardActions
            input={shareInput}
            className="mt-8"
          />
        )}
      </div>
    </section>
  );
}
