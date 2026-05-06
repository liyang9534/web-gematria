interface MysticBackdropProps {
  variant?: "dense" | "quiet";
}

const glyphs = ["111", "222", "444", "777", "888", "1212", "33", "9"];

export function MysticBackdrop({ variant = "dense" }: MysticBackdropProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-[var(--vellum-300)]">
      <div className="absolute inset-0 bg-[linear-gradient(var(--constellation-grid)_1px,transparent_1px),linear-gradient(90deg,var(--constellation-grid-cross)_1px,transparent_1px)] bg-[size:96px_96px] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,var(--constellation-dot)_0_0.7px,transparent_1px)] bg-[size:34px_34px] opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div className="absolute left-[10%] top-[18%] h-px w-[34%] rotate-[8deg] bg-[var(--stroke-default)]" />
      <div className="absolute right-[12%] top-[42%] h-px w-[26%] -rotate-[14deg] bg-[var(--stroke-hairline)]" />
      <div className="absolute bottom-[18%] left-[24%] h-px w-[38%] rotate-[-7deg] bg-[var(--stroke-hairline)]" />
      {variant === "dense" && (
        <div className="absolute inset-0">
          {glyphs.map((glyph, index) => (
            <span
              key={glyph}
              className="observatory-mono absolute text-sm text-[var(--ink-whisper)]"
              style={{
                left: `${8 + ((index * 17) % 78)}%`,
                top: `${10 + ((index * 23) % 76)}%`,
              }}
            >
              {glyph}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
