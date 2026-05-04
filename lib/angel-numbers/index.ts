import { ANGEL_NUMBERS } from "@/data/angel-numbers/generated";
import type {
  AngelNumber,
  AngelNumberReading,
  CuratedAngelNumberReading,
} from "@/types/angel-number";
import {
  classifyAngelNumberPattern,
  interpretAnyNumber,
  normalizeInterpretableNumber,
} from "./interpreter";

export { interpretAnyNumber } from "./interpreter";

const angelNumbersBySlug = new Map(
  ANGEL_NUMBERS.map((angelNumber) => [angelNumber.slug, angelNumber]),
);

export function getAllAngelNumbers(): AngelNumber[] {
  return [...ANGEL_NUMBERS];
}

export function getFeaturedAngelNumbers(): AngelNumber[] {
  return ANGEL_NUMBERS.filter((angelNumber) => angelNumber.isPriority);
}

export function isKnownAngelNumber(number: string): boolean {
  return angelNumbersBySlug.has(normalizeAngelNumber(number));
}

export function getAngelNumber(number: string): AngelNumber {
  const normalizedNumber = normalizeAngelNumber(number);
  const angelNumber = angelNumbersBySlug.get(normalizedNumber);

  if (!angelNumber) {
    throw new Error(`Unknown angel number: ${number}`);
  }

  return angelNumber;
}

export function getReadingForNumber(number: string): AngelNumberReading {
  const normalizedNumber = normalizeInterpretableNumber(number);
  const curated = angelNumbersBySlug.get(normalizedNumber);

  if (!curated) {
    return interpretAnyNumber(normalizedNumber);
  }

  return {
    ...curated,
    source: "curated",
    pattern: classifyAngelNumberPattern(curated.number),
    seo: {
      shouldIndex: true,
      reason: "Curated high-frequency angel number page.",
    },
  } satisfies CuratedAngelNumberReading;
}

export function getRelatedAngelNumbers(number: string): AngelNumber[] {
  const angelNumber = getAngelNumber(number);

  return angelNumber.relatedNumbers
    .map((relatedNumber) => angelNumbersBySlug.get(relatedNumber))
    .filter((item): item is AngelNumber => Boolean(item));
}

export function normalizeAngelNumber(number: string): string {
  return number.replace(/\D/g, "");
}

export function buildAngelNumberSearchTarget(input: string): string | null {
  try {
    const number = normalizeInterpretableNumber(input);
    return `/angel-number/${number}`;
  } catch {
    return null;
  }
}
