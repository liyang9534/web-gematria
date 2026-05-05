interface AffirmationCardProps {
  text: string;
}

export function AffirmationCard({ text }: AffirmationCardProps) {
  return (
    <figure className="observatory-card p-7 text-center md:p-10">
      <div className="mb-5 text-[var(--vellum-500)]" aria-hidden="true">
        ❋
      </div>
      <blockquote className="observatory-display text-3xl italic leading-tight text-[var(--ink-pure)] md:text-4xl">
        “{text}”
      </blockquote>
    </figure>
  );
}
