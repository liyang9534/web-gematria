"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { buildAngelNumberSearchTarget } from "@/lib/angel-numbers";
import { FormEvent, useState } from "react";

interface NumberSearchProps {
  popularNumbers?: string[];
  className?: string;
  placeholder?: string;
}

export function NumberSearch({
  popularNumbers = ["111", "222", "333", "444", "555"],
  className,
  placeholder = "Enter any number to decode its meaning...",
}: NumberSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = buildAngelNumberSearchTarget(value);
    if (!target) {
      setError("Enter 1 to 12 digits. Any valid number can be decoded.");
      return;
    }

    setError("");
    router.push(target);
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="group relative flex min-h-16 w-full overflow-hidden rounded-[4px] border border-[var(--stroke-default)] bg-[var(--void-elevated)] transition duration-200 focus-within:border-[var(--stroke-active)] focus-within:shadow-[var(--glow-vellum)]"
      >
        <div className="flex w-full items-center gap-3 px-4">
          <span
            className="observatory-mono w-5 shrink-0 text-center text-[var(--vellum-500)]"
            aria-hidden="true"
          >
            ◇
          </span>
          <Input
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={placeholder}
            aria-label="Enter an angel number"
            className="observatory-mono h-14 border-0 bg-transparent px-0 text-base text-[var(--ink-pure)] shadow-none placeholder:italic placeholder:text-[var(--ink-muted)] focus-visible:ring-0 md:text-lg"
          />
          <Button
            type="submit"
            size="lg"
            variant="outline"
            className="observatory-button px-4"
          >
            <span className="hidden sm:inline">Decode</span>
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-[var(--hue-rose)]">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="observatory-eyebrow text-[var(--ink-muted)]">
          High-frequency readings
        </span>
        {popularNumbers.map((number) => (
          <Link
            key={number}
            href={`/angel-number/${number}`}
            className="observatory-mono flex min-h-11 items-center rounded-[2px] border border-[var(--stroke-default)] px-3 py-2 text-sm text-[var(--vellum-300)] transition duration-200 hover:border-[var(--stroke-active)] hover:bg-[var(--vellum-wash)]"
          >
            {number}
          </Link>
        ))}
      </div>
    </div>
  );
}
