import { RitualDivider } from "@/components/mystic/RitualDivider";

export function PullQuote({
  children,
  cite,
}: {
  children: string;
  cite?: string;
}) {
  return (
    <figure className="mx-auto max-w-3xl text-center">
      <RitualDivider className="mb-8" />
      <blockquote className="observatory-display text-3xl italic leading-tight text-[var(--ink-pure)] md:text-5xl">
        {children}
      </blockquote>
      {cite && (
        <figcaption className="mt-5 text-sm leading-6 text-[var(--ink-secondary)]">
          {cite}
        </figcaption>
      )}
    </figure>
  );
}
