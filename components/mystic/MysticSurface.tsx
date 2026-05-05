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
        "observatory-card",
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
      <p className="observatory-eyebrow">
        {eyebrow}
      </p>
      <h2 className="observatory-display text-3xl text-[var(--ink-pure)] md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-3xl text-sm leading-7 text-[var(--ink-secondary)] md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
