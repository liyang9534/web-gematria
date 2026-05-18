import { LOCALES } from "@/i18n/routing";
import { getAllAngelNumbers } from ".";

export function getAngelNumberStaticParams() {
  return LOCALES.flatMap((locale) =>
    getAllAngelNumbers().map((angelNumber) => ({
      locale,
      number: angelNumber.slug,
    })),
  );
}
