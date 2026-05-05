import { buildAngelNumberSearchTarget } from "@/lib/angel-numbers";

const LETTER_PATTERN = /[\p{Script=Latin}\p{Script=Hebrew}]/u;
const DECODABLE_PATTERN = /[\p{Script=Latin}\p{Script=Hebrew}\d]/u;

export function buildDecoderSearchTarget(input: string): string | null {
  const trimmedInput = input.trim();

  if (!trimmedInput || !DECODABLE_PATTERN.test(trimmedInput)) {
    return null;
  }

  if (LETTER_PATTERN.test(trimmedInput)) {
    return `/calculator/gematria?input=${encodeURIComponent(trimmedInput)}`;
  }

  return buildAngelNumberSearchTarget(trimmedInput);
}
