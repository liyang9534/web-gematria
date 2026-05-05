import { cn } from "@/lib/utils";

type SourceBadgeTone = "angel" | "gematria" | "numerology" | "biblical" | "ai";

const toneClasses: Record<SourceBadgeTone, string> = {
  angel: "border-[color:rgba(155,143,191,0.4)] text-[var(--cloister-300)]",
  gematria: "border-[color:rgba(201,169,97,0.42)] text-[var(--vellum-500)]",
  numerology: "border-[color:rgba(123,111,168,0.44)] text-[var(--hue-iris)]",
  biblical: "border-[color:rgba(140,115,64,0.46)] text-[var(--vellum-700)]",
  ai: "border-[color:rgba(232,217,168,0.36)] text-[var(--vellum-300)]",
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
