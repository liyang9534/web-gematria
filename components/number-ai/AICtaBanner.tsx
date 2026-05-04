import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AICtaBannerProps {
  number?: string;
}

export function AICtaBanner({ number }: AICtaBannerProps) {
  return (
    <section className="rounded-lg border border-teal-300/30 bg-teal-300/10 p-6 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.18em] text-teal-200">
            AI reading
          </p>
          <h2 className="text-2xl font-semibold tracking-normal">
            Want a personalized interpretation{number ? ` for ${number}` : ""}?
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-zinc-300">
            The AI interpreter is planned for the freemium phase. This entry point is ready for the next rollout.
          </p>
        </div>
        <Button className="rounded-md" disabled>
          <Sparkles className="size-4" />
          Coming soon
        </Button>
      </div>
    </section>
  );
}
