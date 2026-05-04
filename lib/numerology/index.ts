import type {
  NumerologyCalculation,
  NumerologyProfile,
  NumerologyProfileInput,
} from "@/types/numerology";

const MASTER_NUMBERS = new Set([11, 22, 33, 44]);
const VOWELS = new Set(["A", "E", "I", "O", "U", "Y"]);

const MEANINGS: Record<number, string> = {
  1: "Leadership, independence, initiative, and the courage to begin.",
  2: "Partnership, sensitivity, patience, and emotional intelligence.",
  3: "Creativity, expression, optimism, and communication.",
  4: "Structure, discipline, stability, and steady foundations.",
  5: "Freedom, change, adaptability, and lived experience.",
  6: "Care, responsibility, harmony, and service to home or community.",
  7: "Insight, study, intuition, and spiritual depth.",
  8: "Power, ambition, stewardship, and material mastery.",
  9: "Compassion, completion, wisdom, and higher purpose.",
  11: "Inspired intuition, sensitivity, and visionary awareness.",
  22: "Master building, practical vision, and large-scale manifestation.",
  33: "Master teaching, compassion, and healing service.",
  44: "Master structure, endurance, and disciplined leadership.",
};

export function reduceNumerologyNumber(value: number): number {
  let currentValue = Math.abs(Math.trunc(value));

  while (currentValue > 9 && !MASTER_NUMBERS.has(currentValue)) {
    currentValue = sumDigits(currentValue);
  }

  return currentValue;
}

export function calculateLifePathNumber(birthday: string): NumerologyCalculation {
  const digits = birthday.replace(/\D/g, "").split("").map(Number);
  const rawValue = digits.reduce((sum, digit) => sum + digit, 0);
  const value = reduceNumerologyNumber(rawValue);

  return {
    value,
    rawValue,
    calculation: `${digits.join("+")} = ${rawValue}${formatReduction(rawValue, value)}`,
    meaning: getNumerologyMeaning(value),
  };
}

export function calculateExpressionNumber(fullName: string): NumerologyCalculation {
  return calculateNameNumber(fullName, () => true, "Expression");
}

export function calculateSoulUrgeNumber(fullName: string): NumerologyCalculation {
  return calculateNameNumber(fullName, (letter) => VOWELS.has(letter), "Soul Urge");
}

export function calculatePersonalityNumber(fullName: string): NumerologyCalculation {
  return calculateNameNumber(fullName, (letter) => !VOWELS.has(letter), "Personality");
}

export function calculateNumerologyProfile(
  input: NumerologyProfileInput,
): NumerologyProfile {
  return {
    fullName: input.fullName,
    birthday: input.birthday,
    lifePath: calculateLifePathNumber(input.birthday),
    expression: calculateExpressionNumber(input.fullName),
    soulUrge: calculateSoulUrgeNumber(input.fullName),
    personality: calculatePersonalityNumber(input.fullName),
  };
}

export function getNumerologyMeaning(value: number): string {
  return MEANINGS[value] ?? "A blended numerology influence that invites personal reflection.";
}

function calculateNameNumber(
  fullName: string,
  includeLetter: (letter: string) => boolean,
  label: string,
): NumerologyCalculation {
  const letters = fullName
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .filter(includeLetter);
  const letterValues = letters.map(getPythagoreanValue);
  const rawValue = letterValues.reduce((sum, value) => sum + value, 0);
  const value = reduceNumerologyNumber(rawValue);

  return {
    value,
    rawValue,
    calculation: `${label}: ${letterValues.join("+")} = ${rawValue}${formatReduction(rawValue, value)}`,
    meaning: getNumerologyMeaning(value),
  };
}

function getPythagoreanValue(letter: string): number {
  return ((letter.charCodeAt(0) - 65) % 9) + 1;
}

function sumDigits(value: number): number {
  return String(value)
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function formatReduction(rawValue: number, reducedValue: number): string {
  if (rawValue === reducedValue) {
    return "";
  }

  const digits = String(rawValue).split("");
  return ` -> ${digits.join("+")} = ${reducedValue}`;
}
