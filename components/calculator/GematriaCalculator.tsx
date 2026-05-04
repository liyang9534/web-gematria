"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  calculateGematria,
  createGematriaShareText,
  createGematriaShareUrl,
  getGematriaMatches,
} from "@/lib/gematria";
import type { GematriaSystem } from "@/types/gematria";
import { Check, Copy, Link2 } from "lucide-react";
import { useMemo, useState } from "react";

const systems: Array<{ key: GematriaSystem; label: string }> = [
  { key: "hebrewStandard", label: "Hebrew" },
  { key: "englishOrdinal", label: "English Ordinal" },
  { key: "englishGematria", label: "English x6" },
  { key: "reverseOrdinal", label: "Reverse" },
  { key: "fullReduction", label: "Reduction" },
  { key: "pythagorean", label: "Pythagorean" },
];

interface GematriaCalculatorProps {
  compact?: boolean;
}

export function GematriaCalculator({ compact = false }: GematriaCalculatorProps) {
  const [input, setInput] = useState("Angel");
  const [copied, setCopied] = useState<"text" | "link" | null>(null);
  const result = useMemo(() => calculateGematria(input), [input]);
  const matches = useMemo(
    () => getGematriaMatches(result.values.englishOrdinal, "englishOrdinal"),
    [result.values.englishOrdinal],
  );
  const shareText = useMemo(() => createGematriaShareText(result), [result]);

  async function copyText() {
    await navigator.clipboard.writeText(shareText);
    setCopied("text");
    window.setTimeout(() => setCopied(null), 1400);
  }

  async function copyLink() {
    const link = createGematriaShareUrl(window.location.href.split("?")[0], result);
    await navigator.clipboard.writeText(link);
    setCopied("link");
    window.setTimeout(() => setCopied(null), 1400);
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="min-w-0 rounded-lg border border-amber-200/15 bg-zinc-950/70 p-5 shadow-[0_0_42px_rgba(245,158,11,0.08)]">
        <div className="space-y-4">
          <label htmlFor="gematria-input" className="text-sm font-medium text-zinc-100">
            Text or Hebrew word
          </label>
          <Input
            id="gematria-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type a word or phrase"
            className="h-14 border-white/10 bg-white/[0.055] text-lg text-white placeholder:text-zinc-500"
          />
          <p className="text-sm text-zinc-400">
            Normalized: {result.normalizedInput || "None"}
          </p>
        </div>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {systems.map((system) => (
          <div key={system.key} className="min-w-0 rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
              {system.label}
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold text-amber-200">
              {result.values[system.key]}
            </div>
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-wrap gap-2">
        <Button type="button" onClick={copyText} variant="outline" className="rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
          {copied === "text" ? <Check className="size-4" /> : <Copy className="size-4" />}
          Copy result
        </Button>
        <Button type="button" onClick={copyLink} variant="outline" className="rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
          {copied === "link" ? <Check className="size-4" /> : <Link2 className="size-4" />}
          Copy link
        </Button>
      </div>

      {!compact && (
      <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-sm md:p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-normal text-white">Letter breakdown</h2>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-zinc-400">
                <tr className="border-b">
                  <th className="py-3 pr-4">Letter</th>
                  <th className="py-3 pr-4">Ordinal</th>
                  <th className="py-3 pr-4">Hebrew</th>
                  <th className="py-3 pr-4">Reverse</th>
                  <th className="py-3 pr-4">Reduction</th>
                </tr>
              </thead>
              <tbody>
                {result.letterBreakdown.map((letter, index) => (
                  <tr key={`${letter.letter}-${index}`} className="border-b border-white/10 text-zinc-200 last:border-0">
                    <td className="py-3 pr-4 font-mono text-base text-amber-200">{letter.letter}</td>
                    <td className="py-3 pr-4">{letter.values.englishOrdinal}</td>
                    <td className="py-3 pr-4">{letter.values.hebrewStandard}</td>
                    <td className="py-3 pr-4">{letter.values.reverseOrdinal}</td>
                    <td className="py-3 pr-4">{letter.values.fullReduction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {matches.length > 0 && (
        <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.055] p-4 md:p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-normal text-white">Same-value matches</h2>
            <div className="flex flex-wrap gap-2">
              {matches.map((match) => (
                <Badge key={match.term} variant="secondary" className="rounded-md bg-teal-200/10 text-teal-100">
                  {match.term} = {match.value}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
