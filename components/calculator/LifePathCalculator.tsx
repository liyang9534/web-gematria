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
      <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6">
        <div className="space-y-3">
          <Label htmlFor="life-path-birthday">Birthday</Label>
          <Input
            id="life-path-birthday"
            type="date"
            value={birthday}
            onChange={(event) => setBirthday(event.target.value)}
            className="h-12 border-white/10 bg-zinc-950/70 text-white"
          />
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6">
        <div className="flex gap-5">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-teal-200/20 bg-teal-200/10 font-mono text-4xl font-semibold text-teal-100">
            {result.value}
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-normal text-white">Life Path {result.value}</h2>
            <p className="font-mono text-sm text-zinc-400">{result.calculation}</p>
            <p className="leading-7 text-zinc-300">{result.meaning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
