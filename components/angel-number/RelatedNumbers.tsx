import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

interface RelatedNumbersProps {
  numbers: string[];
}

export function RelatedNumbers({ numbers }: RelatedNumbersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {numbers.map((number) => (
        <Button
          key={number}
          asChild
          variant="outline"
          className="rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <Link href={`/angel-number/${number}`}>{number}</Link>
        </Button>
      ))}
    </div>
  );
}
