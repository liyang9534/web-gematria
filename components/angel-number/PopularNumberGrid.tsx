import { Link } from "@/i18n/routing";
import type { AngelNumber } from "@/types/angel-number";
import { ArrowUpRight } from "lucide-react";

interface PopularNumberGridProps {
  numbers: AngelNumber[];
}

export function PopularNumberGrid({ numbers }: PopularNumberGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {numbers.map((angelNumber) => (
        <Link
          key={angelNumber.slug}
          href={`/angel-number/${angelNumber.slug}`}
          className="group block"
        >
          <article className="relative h-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/60 hover:bg-white/[0.08] hover:shadow-[0_0_40px_rgba(245,158,11,0.12)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
            <div className="flex h-full flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="font-mono text-5xl font-semibold tracking-normal text-amber-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.18)]">
                  {angelNumber.number}
                </div>
                <ArrowUpRight className="size-5 text-zinc-500 transition group-hover:text-amber-300" />
              </div>
              <div className="space-y-3">
                <div className="inline-flex rounded-md border border-teal-200/15 bg-teal-200/10 px-2.5 py-1 text-xs text-teal-100">
                  {angelNumber.shortMeaning}
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-zinc-300">
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
