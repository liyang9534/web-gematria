import type {
  NumerologyCalculation,
  NumerologyProfile,
  NumerologyProfileInput,
} from "@/types/numerology";
import { getNumerologyDescription } from "@/lib/number-meanings";

const MASTER_NUMBERS = new Set([11, 22, 33, 44]);
const VOWELS = new Set(["A", "E", "I", "O", "U", "Y"]);

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

export function calculateBirthdayNumber(birthday: string): NumerologyCalculation {
  const day = birthday.split("-")[2] ?? "";
  const digits = day.replace(/\D/g, "").split("").map(Number);
  const rawValue = digits.reduce((sum, digit) => sum + digit, 0);
  const value = reduceNumerologyNumber(rawValue);

  return {
    value,
    rawValue,
    calculation: `Birthday: ${digits.join("+") || "0"} = ${rawValue}${formatReduction(rawValue, value)}`,
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
  const birthdayNumber = calculateBirthdayNumber(input.birthday);

  return {
    fullName: input.fullName,
    birthday: input.birthday,
    lifePath: calculateLifePathNumber(input.birthday),
    expression: calculateExpressionNumber(input.fullName),
    soulUrge: calculateSoulUrgeNumber(input.fullName),
    personality: calculatePersonalityNumber(input.fullName),
    birthdayNumber,
  };
}

export function getNumerologyMeaning(value: number): string {
  return getNumerologyDescription(value);
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
