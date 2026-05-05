"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SourceBadge } from "@/components/mystic/SourceBadge";
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
  initialInput?: string;
}

export function GematriaCalculator({
  compact = false,
  initialInput = "Angel",
}: GematriaCalculatorProps) {
  const [input, setInput] = useState(initialInput);
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
      <div className="observatory-card min-w-0 p-5">
        <div className="space-y-4">
          <SourceBadge tone="gematria">Gematria · Calculation</SourceBadge>
          <label
            htmlFor="gematria-input"
            className="block text-sm font-medium text-[var(--ink-pure)]"
          >
            Text or Hebrew word
          </label>
          <Input
            id="gematria-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type a word or phrase"
            className="observatory-mono h-14 rounded-[4px] border-[var(--stroke-default)] bg-[var(--void-elevated)] text-lg text-[var(--ink-pure)] placeholder:italic placeholder:text-[var(--ink-muted)] focus-visible:ring-[var(--vellum-500)]"
          />
          <p className="text-sm text-[var(--ink-secondary)]">
            Normalized: {result.normalizedInput || "None"}
          </p>
        </div>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {systems.map((system) => (
          <div
            key={system.key}
            className="observatory-card min-w-0 p-4"
          >
            <div className="observatory-eyebrow text-[var(--ink-muted)]">
              {system.label}
            </div>
            <div className="observatory-mono mt-3 text-4xl font-light text-[var(--vellum-300)]">
              {result.values[system.key]}
            </div>
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-wrap gap-2">
        <Button
          type="button"
          onClick={copyText}
          variant="outline"
          className="observatory-button"
        >
          {copied === "text" ? <Check className="size-4" /> : <Copy className="size-4" />}
          Copy result
        </Button>
        <Button
          type="button"
          onClick={copyLink}
          variant="outline"
          className="observatory-button"
        >
          {copied === "link" ? <Check className="size-4" /> : <Link2 className="size-4" />}
          Copy link
        </Button>
      </div>

      {!compact && (
      <div className="observatory-card min-w-0 p-4 md:p-6">
        <div className="space-y-4">
          <h2 className="observatory-display text-3xl text-[var(--ink-pure)]">Letter breakdown</h2>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-[var(--ink-secondary)]">
                <tr className="border-b border-[var(--stroke-hairline)]">
                  <th className="py-3 pr-4">Letter</th>
                  <th className="py-3 pr-4">Ordinal</th>
                  <th className="py-3 pr-4">Hebrew</th>
                  <th className="py-3 pr-4">Reverse</th>
                  <th className="py-3 pr-4">Reduction</th>
                </tr>
              </thead>
              <tbody>
                {result.letterBreakdown.map((letter, index) => (
                  <tr key={`${letter.letter}-${index}`} className="border-b border-[var(--stroke-hairline)] text-[var(--ink-primary)] last:border-0">
                    <td className="observatory-mono py-3 pr-4 text-base text-[var(--vellum-300)]">{letter.letter}</td>
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
        <div className="observatory-card min-w-0 p-4 md:p-6">
          <div className="space-y-4">
            <h2 className="observatory-display text-3xl text-[var(--ink-pure)]">Same-value matches</h2>
            <div className="flex flex-wrap gap-2">
              {matches.map((match) => (
                <Badge
                  key={match.term}
                  variant="secondary"
                  className="rounded-[2px] border border-[var(--stroke-default)] bg-[rgba(107,91,149,0.14)] text-[var(--cloister-100)]"
                >
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
