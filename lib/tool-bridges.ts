import { getReadingForNumber } from "@/lib/angel-numbers";
import { getAngelDescription } from "@/lib/number-meanings";
import type { GematriaResult, GematriaSystem } from "@/types/gematria";

export const GEMATRIA_ANGEL_NUMBER_TARGETS = new Set([
  "111",
  "222",
  "333",
  "444",
  "555",
  "666",
  "777",
  "888",
  "999",
  "1111",
  "1212",
  "1234",
]);

const GEMATRIA_SYSTEM_LABELS: Record<GematriaSystem, string> = {
  hebrewStandard: "Hebrew Standard",
  englishOrdinal: "English Ordinal",
  englishGematria: "English Gematria",
  simple: "Simple",
  jewish: "Jewish",
  fullReduction: "Full Reduction",
  reverseOrdinal: "Reverse Ordinal",
  pythagorean: "Pythagorean",
};

export interface GematriaAngelNumberMatch {
  number: string;
  system: GematriaSystem;
  systemLabel: string;
  title: string;
  description: string;
  href: string;
}

export function getGematriaAngelNumberMatches(
  result: GematriaResult,
): GematriaAngelNumberMatch[] {
  const matches: GematriaAngelNumberMatch[] = [];
  const seen = new Set<string>();

  for (const [system, value] of Object.entries(result.values) as Array<
    [GematriaSystem, number]
  >) {
    const number = String(value);

    if (!GEMATRIA_ANGEL_NUMBER_TARGETS.has(number) || seen.has(number)) {
      continue;
    }

    const reading = getReadingForNumber(number);
    seen.add(number);
    matches.push({
      number,
      system,
      systemLabel: GEMATRIA_SYSTEM_LABELS[system],
      title: `${number} - ${reading.shortMeaning}`,
      description: getAngelDescription(number),
      href: `/angel-number/${number}`,
    });
  }

  return matches;
}

export function buildAngelToGematriaUrl(number: string): string {
  const params = new URLSearchParams();
  params.set("value", number.replace(/\D/g, ""));
  return `/calculator/gematria?${params.toString()}`;
}
