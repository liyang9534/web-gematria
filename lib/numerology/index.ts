import type {
  MyAngelNumberProfile,
  MyAngelNumberProfileInput,
  MyAngelNumberResult,
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

export function calculateMyAngelNumberFromBirthday(
  birthday: string,
): MyAngelNumberResult {
  const digits = birthday.replace(/\D/g, "").split("").map(Number);
  const rawValue = digits.reduce((sum, digit) => sum + digit, 0);
  const value = reduceNumerologyNumber(rawValue);

  return {
    method: "birthday",
    label: "Birthday Method",
    value,
    rawValue,
    calculation: `Birthday method: ${digits.join("+") || "0"} = ${rawValue}${formatReduction(rawValue, value)}`,
    meaning: getNumerologyMeaning(value),
    description:
      "Adds every digit in your birth date, then reduces the sum into one angel number or master number.",
  };
}

export function calculateMyAngelNumberFromName(
  fullName: string,
): MyAngelNumberResult {
  const letters = normalizeNameLetters(fullName);
  const letterValues = letters.map(getOrdinalValue);
  const rawValue = letterValues.reduce((sum, value) => sum + value, 0);
  const value = reduceNumerologyNumber(rawValue);

  return {
    method: "name",
    label: "Name Method",
    value,
    rawValue,
    calculation: `Name method: ${letterValues.join("+") || "0"} = ${rawValue}${formatReduction(rawValue, value)}`,
    meaning: getNumerologyMeaning(value),
    description:
      "Converts A-Z into 1-26, adds the letters in your name, then reduces the result into an angel number or master number.",
  };
}

export function calculateMyAngelNumberProfile(
  input: MyAngelNumberProfileInput,
): MyAngelNumberProfile {
  const fullName = input.fullName?.trim() ?? "";
  const birthday = input.birthday?.trim() ?? "";
  const birthdayResult = birthday.replace(/\D/g, "")
    ? calculateMyAngelNumberFromBirthday(birthday)
    : undefined;
  const nameResult = normalizeNameLetters(fullName).length
    ? calculateMyAngelNumberFromName(fullName)
    : undefined;
  const results = [birthdayResult, nameResult].filter(
    (result): result is MyAngelNumberResult => Boolean(result),
  );

  return {
    fullName,
    birthday,
    primary: results[0] ?? null,
    birthdayResult,
    nameResult,
    results,
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

function getOrdinalValue(letter: string): number {
  return letter.charCodeAt(0) - 64;
}

function normalizeNameLetters(fullName: string): string[] {
  return fullName.toUpperCase().replace(/[^A-Z]/g, "").split("");
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
