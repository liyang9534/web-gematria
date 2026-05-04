import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MysticSurfaceProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export function MysticSurface({
  children,
  className,
  as: Component = "div",
}: MysticSurfaceProps) {
  return (
    <Component
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.055] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function MysticSectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.28em] text-teal-200/80">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl font-semibold tracking-normal text-white md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
