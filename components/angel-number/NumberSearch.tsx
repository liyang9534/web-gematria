"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { buildAngelNumberSearchTarget } from "@/lib/angel-numbers";
import { ArrowRight, Search, Sparkles } from "lucide-react";
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
        className="group relative flex min-h-16 w-full overflow-hidden rounded-lg border border-amber-200/20 bg-zinc-950/70 shadow-[0_0_42px_rgba(245,158,11,0.12)] backdrop-blur"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" />
        <div className="flex w-full items-center gap-3 px-4">
          <Search className="size-5 shrink-0 text-amber-300" aria-hidden="true" />
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
            className="h-14 border-0 bg-transparent px-0 text-lg text-white shadow-none placeholder:text-white/50 focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="lg"
            className="h-11 rounded-md bg-amber-300 px-4 text-zinc-950 hover:bg-amber-200"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Decode</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-rose-200">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-white/45">
          High-frequency portals
        </span>
        {popularNumbers.map((number) => (
          <Button
            key={number}
            asChild
            size="sm"
            variant="outline"
            className="h-8 rounded-md border-white/15 bg-white/5 px-3 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href={`/angel-number/${number}`}>{number}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
