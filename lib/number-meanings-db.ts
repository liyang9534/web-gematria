import { eq } from "drizzle-orm";
import { numberBaseMeanings } from "@/lib/db/schema";
import { getDbAsync, type DB } from "@/lib/db";
import {
  FALLBACK_NUMBER_MEANING,
  getNumberBaseMeaning,
  normalizeMeaningNumber,
  type NumberBaseMeaning,
} from "@/lib/number-meanings";

function toNumberBaseMeaning(
  row: typeof numberBaseMeanings.$inferSelect | undefined,
  fallback: NumberBaseMeaning,
): NumberBaseMeaning {
  if (!row) return fallback;

  return {
    keywords: Array.isArray(row.keywords) && row.keywords.length > 0
      ? row.keywords
      : fallback.keywords,
    numerology_desc: row.numerologyDesc || fallback.numerology_desc,
    angel_desc: row.angelDesc || fallback.angel_desc,
  };
}

export async function getNumberBaseMeaningFromD1(
  number: number | string,
  database?: DB,
): Promise<NumberBaseMeaning> {
  const normalizedNumber = normalizeMeaningNumber(number);

  if (!normalizedNumber) {
    return FALLBACK_NUMBER_MEANING;
  }

  const fallback = getNumberBaseMeaning(normalizedNumber);

  try {
    const db = database ?? await getDbAsync();
    const [row] = await db
      .select()
      .from(numberBaseMeanings)
      .where(eq(numberBaseMeanings.number, normalizedNumber))
      .limit(1);

    return toNumberBaseMeaning(row, fallback);
  } catch {
    return fallback;
  }
}

export async function getNumerologyDescriptionFromD1(
  number: number | string,
  database?: DB,
) {
  return (await getNumberBaseMeaningFromD1(number, database)).numerology_desc;
}

export async function getAngelDescriptionFromD1(
  number: number | string,
  database?: DB,
) {
  return (await getNumberBaseMeaningFromD1(number, database)).angel_desc;
}
