"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateNumerologyProfile } from "@/lib/numerology";
import { useMemo, useState } from "react";

export function NumerologyCalculator() {
  const [fullName, setFullName] = useState("Ada Lovelace");
  const [birthday, setBirthday] = useState("1815-12-10");
  const profile = useMemo(
    () => calculateNumerologyProfile({ fullName, birthday }),
    [fullName, birthday],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="numerology-name">Full name</Label>
            <Input
              id="numerology-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="h-12 border-white/10 bg-zinc-950/70 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numerology-birthday">Birthday</Label>
            <Input
              id="numerology-birthday"
              type="date"
              value={birthday}
              onChange={(event) => setBirthday(event.target.value)}
              className="h-12 border-white/10 bg-zinc-950/70 text-white"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <NumberResult title="Life Path" value={profile.lifePath.value} text={profile.lifePath.meaning} detail={profile.lifePath.calculation} />
        <NumberResult title="Expression" value={profile.expression.value} text={profile.expression.meaning} detail={profile.expression.calculation} />
        <NumberResult title="Soul Urge" value={profile.soulUrge.value} text={profile.soulUrge.meaning} detail={profile.soulUrge.calculation} />
        <NumberResult title="Personality" value={profile.personality.value} text={profile.personality.meaning} detail={profile.personality.calculation} />
      </div>
    </div>
  );
}

function NumberResult({
  title,
  value,
  text,
  detail,
}: {
  title: string;
  value: number;
  text: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
      <div className="flex gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-amber-200/20 bg-amber-300/10 font-mono text-3xl font-semibold text-amber-200">
          {value}
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-normal text-white">{title}</h2>
          <p className="font-mono text-xs text-zinc-400">{detail}</p>
          <p className="text-sm leading-6 text-zinc-300">{text}</p>
        </div>
      </div>
    </div>
  );
}
