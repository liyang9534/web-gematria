import { Link } from "@/i18n/routing";

interface RelatedNumbersProps {
  numbers: string[];
}

export function RelatedNumbers({ numbers }: RelatedNumbersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {numbers.map((number) => (
        <Link
          key={number}
          href={`/angel-number/${number}`}
          className="observatory-mono flex min-h-11 min-w-11 items-center justify-center rounded-[2px] border border-[var(--stroke-default)] px-4 py-2.5 text-sm text-[var(--vellum-300)] transition duration-200 hover:border-[var(--stroke-active)] hover:bg-[rgba(201,169,97,0.06)]"
        >
          {number}
        </Link>
      ))}
    </div>
  );
}
