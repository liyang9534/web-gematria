"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateLifePathNumber } from "@/lib/numerology";
import { useMemo, useState } from "react";

export function LifePathCalculator() {
  const [birthday, setBirthday] = useState("1990-07-24");
  const result = useMemo(() => calculateLifePathNumber(birthday), [birthday]);

  return (
    <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
      <div className="observatory-card p-6">
        <div className="space-y-3">
          <Label htmlFor="life-path-birthday">Birthday</Label>
          <Input
            id="life-path-birthday"
            type="date"
            value={birthday}
            onChange={(event) => setBirthday(event.target.value)}
            className="h-12 rounded-[4px] border-[var(--stroke-default)] bg-[var(--void-elevated)] text-[var(--ink-pure)]"
          />
        </div>
      </div>
      <div className="observatory-card p-6">
        <div className="flex gap-5">
          <div className="observatory-mono flex size-20 shrink-0 items-center justify-center rounded-[4px] border border-[rgba(123,111,168,0.44)] bg-[rgba(107,91,149,0.12)] text-4xl font-light text-[var(--cloister-100)]">
            {result.value}
          </div>
          <div className="space-y-3">
            <h2 className="observatory-display text-3xl text-[var(--ink-pure)]">Life Path {result.value}</h2>
            <p className="observatory-mono text-sm text-[var(--ink-secondary)]">{result.calculation}</p>
            <p className="leading-7 text-[var(--ink-secondary)]">{result.meaning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
