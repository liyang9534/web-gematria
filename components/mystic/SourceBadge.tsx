import { cn } from "@/lib/utils";

type SourceBadgeTone = "angel" | "gematria" | "numerology" | "biblical" | "ai";

const toneClasses: Record<SourceBadgeTone, string> = {
  angel: "border-[color:var(--cloister-border)] text-[var(--cloister-300)]",
  gematria: "border-[color:var(--vellum-border)] text-[var(--vellum-500)]",
  numerology: "border-[color:var(--iris-border)] text-[var(--hue-iris)]",
  biblical: "border-[color:var(--biblical-border)] text-[var(--vellum-700)]",
  ai: "border-[color:var(--ai-border)] text-[var(--vellum-300)]",
};

export function SourceBadge({
  children,
  tone = "angel",
  className,
}: {
  children: string;
  tone?: SourceBadgeTone;
  className?: string;
}) {
  return (
    <span
      role="note"
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
