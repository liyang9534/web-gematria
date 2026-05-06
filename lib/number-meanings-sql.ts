import { NUMBER_MEANINGS, type NumberBaseMeaning } from "@/lib/number-meanings";

type SqlValue = string | number | boolean | null | undefined | unknown[];

export function sqlLiteral(value: SqlValue) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number") return String(value);

  const text = typeof value === "string" ? value : JSON.stringify(value);

  return `'${text.replace(/'/g, "''")}'`;
}

function validateMeaning(number: string, meaning: NumberBaseMeaning) {
  if (!/^\d+$/.test(number)) {
    throw new Error(`Invalid number meaning key: ${number}`);
  }

  if (!Array.isArray(meaning.keywords) || meaning.keywords.length === 0) {
    throw new Error(`${number} must include at least one keyword`);
  }

  if (!meaning.numerology_desc || !meaning.angel_desc) {
    throw new Error(`${number} must include numerology and angel descriptions`);
  }
}

export function buildNumberBaseMeaningsSeedSql(
  meanings: Record<string, NumberBaseMeaning> = NUMBER_MEANINGS,
) {
  return Object.entries(meanings)
    .sort(
      ([left], [right]) =>
        Number(left) - Number(right) || left.localeCompare(right),
    )
    .map(([number, meaning]) => {
      validateMeaning(number, meaning);

      return [
        "insert into number_base_meanings (number, keywords, numerology_desc, angel_desc)",
        `values (${[
          sqlLiteral(number),
          sqlLiteral(meaning.keywords),
          sqlLiteral(meaning.numerology_desc),
          sqlLiteral(meaning.angel_desc),
        ].join(", ")})`,
        "on conflict(number) do update set",
        "  keywords=excluded.keywords,",
        "  numerology_desc=excluded.numerology_desc,",
        "  angel_desc=excluded.angel_desc,",
        "  updated_at=(cast((julianday('now') - 2440587.5)*86400000 as integer));",
      ].join("\n");
    })
    .join("\n\n");
}
