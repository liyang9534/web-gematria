import { Link } from "@/i18n/routing";
import type { AngelNumber } from "@/types/angel-number";

interface PopularNumberGridProps {
  numbers: AngelNumber[];
}

export function PopularNumberGrid({ numbers }: PopularNumberGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {numbers.map((angelNumber) => (
        <Link
          key={angelNumber.slug}
          href={`/angel-number/${angelNumber.slug}`}
          className="group block"
        >
          <article className="observatory-card relative h-full overflow-hidden p-5 transition duration-200 hover:border-[var(--stroke-active)] hover:bg-[var(--void-membrane)]">
            <div className="flex h-full flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="observatory-mono text-5xl font-light tracking-[-0.04em] text-[var(--vellum-300)] [text-shadow:var(--glow-vellum)]">
                  {angelNumber.number}
                </div>
                <span
                  className="text-sm text-[var(--vellum-500)] transition group-hover:text-[var(--vellum-100)]"
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>
              <div className="space-y-3">
                <div className="inline-flex rounded-full border border-[rgba(155,143,191,0.4)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--cloister-300)]">
                  {angelNumber.shortMeaning}
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-[var(--ink-secondary)]">
                  {angelNumber.summary}
                </p>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
