interface AffirmationCardProps {
  text: string;
}

export function AffirmationCard({ text }: AffirmationCardProps) {
  return (
    <figure className="rounded-lg border border-amber-300/30 bg-amber-300/10 p-6 text-amber-50 shadow-[0_0_42px_rgba(245,158,11,0.08)]">
      <blockquote className="font-serif text-xl font-medium leading-9">"{text}"</blockquote>
    </figure>
  );
}
