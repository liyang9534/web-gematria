import { cn } from "@/lib/utils";

export function RitualDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)} aria-hidden="true">
      <span className="h-px w-16 bg-[var(--stroke-default)] [mask-image:linear-gradient(to_right,transparent,black)]" />
      <span className="text-sm text-[var(--vellum-500)]">✦</span>
      <span className="h-px w-16 bg-[var(--stroke-default)] [mask-image:linear-gradient(to_left,transparent,black)]" />
    </div>
  );
}
