import { SourceBadge } from "@/components/mystic/SourceBadge";
import type { ReactNode } from "react";

export function OptionalInterpretation({
  badge,
  title,
  tone = "numerology",
  defaultOpen = true,
  children,
}: {
  badge: string;
  title: string;
  tone?: "angel" | "gematria" | "numerology" | "biblical" | "ai";
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group observatory-card p-5 md:p-7"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <div className="space-y-3">
          <SourceBadge tone={tone}>{badge}</SourceBadge>
          <h3 className="observatory-display text-3xl text-[var(--ink-pure)]">
            {title}
          </h3>
        </div>
        <span
          aria-hidden="true"
          className="mt-2 text-[var(--vellum-500)] transition-transform duration-300 group-open:rotate-90"
        >
          ▸
        </span>
      </summary>
      <div className="mt-6 border-t border-[var(--stroke-hairline)] pt-6">
        {children}
      </div>
    </details>
  );
}
