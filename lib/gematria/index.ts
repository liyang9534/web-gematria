import type {
  GematriaLetterValue,
  GematriaMatch,
  GematriaResult,
  GematriaSystem,
} from "@/types/gematria";

const LATIN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const HEBREW_VALUES: Record<string, number> = {
  א: 1,
  ב: 2,
  ג: 3,
  ד: 4,
  ה: 5,
  ו: 6,
  ז: 7,
  ח: 8,
  ט: 9,
  י: 10,
  כ: 20,
  ך: 20,
  ל: 30,
  מ: 40,
  ם: 40,
  נ: 50,
  ן: 50,
  ס: 60,
  ע: 70,
  פ: 80,
  ף: 80,
  צ: 90,
  ץ: 90,
  ק: 100,
  ר: 200,
  ש: 300,
  ת: 400,
};

const MATCHES: GematriaMatch[] = [
  {
    term: "ANGEL",
    system: "englishOrdinal",
    value: 39,
    description: "A common baseline term for angel number searches.",
  },
  {
    term: "LIGHT",
    system: "englishOrdinal",
    value: 56,
    description: "Often used in spiritual and symbolic readings.",
  },
  {
    term: "שלום",
    system: "hebrewStandard",
    value: 376,
    description: "Hebrew for peace, a classic gematria example.",
  },
];

const EMPTY_VALUES: Record<GematriaSystem, number> = {
  hebrewStandard: 0,
  englishOrdinal: 0,
  englishGematria: 0,
  simple: 0,
  jewish: 0,
  fullReduction: 0,
  reverseOrdinal: 0,
  pythagorean: 0,
};

export function normalizeGematriaInput(input: string): string {
  return input
    .replace(/[^\p{Script=Latin}\p{Script=Hebrew}\s]/gu, " ")
    .replace(/\p{Script=Latin}/gu, (letter) => letter.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateGematria(input: string): GematriaResult {
  const normalizedInput = normalizeGematriaInput(input);
  const letters = [...normalizedInput].filter((letter) => letter !== " ");
  const letterBreakdown = letters.map(getLetterValue);
  const values = letterBreakdown.reduce(
    (accumulator, item) => {
      for (const system of Object.keys(accumulator) as GematriaSystem[]) {
        accumulator[system] += item.values[system];
      }
      return accumulator;
    },
    { ...EMPTY_VALUES },
  );

  return {
    input,
    normalizedInput,
    values,
    letterBreakdown,
  };
}

export function getGematriaMatches(
  value: number,
  system: GematriaSystem,
): GematriaMatch[] {
  return MATCHES.filter((match) => match.value === value && match.system === system);
}

export function createGematriaShareText(result: GematriaResult): string {
  return [
    `Gematria for ${result.normalizedInput || result.input}`,
    `English Ordinal: ${result.values.englishOrdinal}`,
    `English x6: ${result.values.englishGematria}`,
    `Hebrew Standard: ${result.values.hebrewStandard}`,
    `Reverse Ordinal: ${result.values.reverseOrdinal}`,
  ].join("\n");
}

export function createGematriaShareUrl(baseUrl: string, result: GematriaResult): string {
  const url = new URL(baseUrl);
  url.searchParams.set("q", result.input);
  return url.toString();
}

function getLetterValue(letter: string): GematriaLetterValue {
  const latinIndex = LATIN_LETTERS.indexOf(letter);
  const ordinal = latinIndex >= 0 ? latinIndex + 1 : 0;
  const reverseOrdinal = latinIndex >= 0 ? 26 - latinIndex : 0;
  const hebrewStandard = HEBREW_VALUES[letter] ?? 0;
  const pythagorean = ordinal > 0 ? ((ordinal - 1) % 9) + 1 : 0;

  return {
    letter,
    values: {
      hebrewStandard,
      englishOrdinal: ordinal,
      englishGematria: ordinal * 6,
      simple: ordinal,
      jewish: ordinal > 0 ? ordinal * 6 : hebrewStandard,
      fullReduction: pythagorean,
      reverseOrdinal,
      pythagorean,
    },
  };
}
