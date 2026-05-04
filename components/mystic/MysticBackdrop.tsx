interface MysticBackdropProps {
  variant?: "dense" | "quiet";
}

const glyphs = ["111", "222", "444", "777", "888", "1212", "33", "9"];

export function MysticBackdrop({ variant = "dense" }: MysticBackdropProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(124,58,237,0.28),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(20,184,166,0.18),transparent_24%),radial-gradient(circle_at_50%_92%,rgba(245,158,11,0.16),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1.5px)] bg-[size:28px_28px] opacity-20" />
      {variant === "dense" && (
        <div className="absolute inset-0">
          {glyphs.map((glyph, index) => (
            <span
              key={glyph}
              className="absolute font-mono text-sm text-white/10"
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
