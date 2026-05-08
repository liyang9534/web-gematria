import { getAllAngelNumbers } from ".";

export function getAngelNumberStaticParams() {
  return getAllAngelNumbers().map((angelNumber) => ({
    number: angelNumber.slug,
  }));
}
