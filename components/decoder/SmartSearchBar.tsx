"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { buildDecoderSearchTarget } from "@/lib/decoder-search";
import { FormEvent, useMemo, useState } from "react";

interface SmartSearchBarProps {
  className?: string;
  popularNumbers?: string[];
  placeholder?: string;
}

export function SmartSearchBar({
  className,
  popularNumbers = ["111", "222", "333", "444", "555"],
  placeholder = "Enter a number or word to decode...",
}: SmartSearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const modeSymbol = useMemo(
    () => (/[A-Za-z\p{Script=Hebrew}]/u.test(value) ? "✦" : "◇"),
    [value],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = buildDecoderSearchTarget(value);
    if (!target) {
      setError("Enter a number, name, word or phrase.");
      return;
    }

    setError("");
    router.push(target);
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="group relative flex min-h-16 w-full overflow-hidden rounded-[4px] border border-[var(--stroke-default)] bg-[var(--void-elevated)] shadow-none transition duration-200 focus-within:border-[var(--stroke-active)] focus-within:shadow-[var(--glow-vellum)]"
      >
        <div className="flex w-full items-center gap-3 px-4">
          <span
            className="observatory-mono w-5 shrink-0 text-center text-[var(--vellum-500)]"
            aria-hidden="true"
          >
            {modeSymbol}
          </span>
          <Input
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
            }}
            placeholder={placeholder}
            aria-label="Enter a number or word to decode"
            className="observatory-mono h-14 border-0 bg-transparent px-0 text-base text-[var(--ink-pure)] shadow-none placeholder:italic placeholder:text-[var(--ink-muted)] focus-visible:ring-0 md:text-lg"
          />
          <Button
            type="submit"
            size="lg"
            variant="outline"
            className="observatory-button px-4"
          >
            Decode
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-[var(--hue-rose)]">{error}</p>}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="observatory-eyebrow text-[var(--ink-muted)]">
          Common readings
        </span>
        {popularNumbers.map((number) => (
          <Link
            key={number}
            href={`/angel-number/${number}`}
            className="observatory-mono flex min-h-11 items-center rounded-[2px] border border-[var(--stroke-default)] px-3 py-2 text-sm text-[var(--vellum-300)] transition duration-200 hover:border-[var(--stroke-active)] hover:bg-[rgba(201,169,97,0.06)]"
          >
            {number}
          </Link>
        ))}
      </div>
    </div>
  );
}
