import meanings from "@/data/number-base-meanings.json";

export interface NumberBaseMeaning {
  keywords: string[];
  numerology_desc: string;
  angel_desc: string;
}

export const REQUIRED_NUMBER_MEANINGS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "11",
  "22",
  "33",
  "44",
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
] as const;

const FALLBACK_MEANING: NumberBaseMeaning = {
  keywords: ["reflection"],
  numerology_desc:
    "A blended numerology influence that invites personal reflection.",
  angel_desc:
    "This number is a personal signal rather than a fixed omen. Notice the pattern, then test its meaning against your real context.",
};

const NUMBER_MEANINGS = meanings as Record<string, NumberBaseMeaning>;

export function normalizeMeaningNumber(number: number | string): string {
  return String(number).replace(/\D/g, "");
}

export function getNumberBaseMeaning(number: number | string): NumberBaseMeaning {
  const normalizedNumber = normalizeMeaningNumber(number);

  return NUMBER_MEANINGS[normalizedNumber] ?? FALLBACK_MEANING;
}

export function getNumberKeywords(number: number | string): string[] {
  return getNumberBaseMeaning(number).keywords;
}

export function getNumerologyDescription(number: number | string): string {
  return getNumberBaseMeaning(number).numerology_desc;
}

export function getAngelDescription(number: number | string): string {
  return getNumberBaseMeaning(number).angel_desc;
}
