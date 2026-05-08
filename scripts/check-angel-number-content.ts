import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AngelNumber, AngelNumberCategory } from "../types/angel-number";
import { getPlannedAngelNumberSlugs } from "./generate-angel-number-source";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT_DIR = path.resolve(__dirname, "..");
const CORE_WORD_COUNT_MINIMUM = 260;
const META_DESCRIPTION_MINIMUM = 120;
const META_DESCRIPTION_MAXIMUM = 165;

const PRIORITY_SLUGS = new Set([
  "11",
  "22",
  "33",
  "44",
  "55",
  "66",
  "77",
  "88",
  "99",
  "111",
  "222",
  "333",
  "444",
  "555",
  "666",
  "777",
  "888",
  "999",
  "1111",
  "1212",
]);

const REQUIRED_CATEGORIES: AngelNumberCategory[] = [
  "single",
  "double",
  "triple",
  "quad",
  "mirror",
  "sequence",
  "special",
];

const PLACEHOLDER_PATTERN = /\b(?:todo|tbd|lorem|placeholder|coming soon)\b/i;

export interface AngelNumberContentCheckOptions {
  rootDir?: string;
  silent?: boolean;
}

export interface AngelNumberContentCheckResult {
  checkedCount: number;
  errors: string[];
}

export async function checkAngelNumberContent({
  rootDir = DEFAULT_ROOT_DIR,
  silent = false,
}: AngelNumberContentCheckOptions = {}): Promise<AngelNumberContentCheckResult> {
  const errors: string[] = [];
  const sourceDir = path.join(rootDir, "data", "angel-numbers", "source", "en");
  const expectedSlugs = getPlannedAngelNumberSlugs();
  const filenames = (await readdir(sourceDir))
    .filter((filename) => filename.endsWith(".json"))
    .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));
  const slugs = filenames.map((filename) => filename.replace(/\.json$/, ""));

  compareLists("curated source slugs", slugs, expectedSlugs, errors);

  const seenSlugs = new Set<string>();
  const seenTitles = new Set<string>();
  const seenSummaries = new Set<string>();
  const categories = new Set<AngelNumberCategory>();
  const records: AngelNumber[] = [];

  for (const filename of filenames) {
    const filePath = path.join(sourceDir, filename);
    const raw = await readFile(filePath, "utf8");
    let item: AngelNumber;

    try {
      item = JSON.parse(raw) as AngelNumber;
    } catch (error) {
      errors.push(`${filename} is not valid JSON: ${(error as Error).message}`);
      continue;
    }

    records.push(item);
    const expectedSlug = filename.replace(/\.json$/, "");
    validateRecord(item, expectedSlug, errors);

    if (seenSlugs.has(item.slug)) {
      errors.push(`${item.slug} is duplicated`);
    }
    seenSlugs.add(item.slug);

    const titleKey = normalizeContentFingerprint(item.title);
    const summaryKey = normalizeContentFingerprint(item.summary);
    if (seenTitles.has(titleKey)) {
      errors.push(`${item.slug} duplicates a title`);
    }
    if (seenSummaries.has(summaryKey)) {
      errors.push(`${item.slug} duplicates a summary`);
    }
    seenTitles.add(titleKey);
    seenSummaries.add(summaryKey);
    categories.add(item.category);

    if (PRIORITY_SLUGS.has(item.slug) && countWords(getContentText(item)) < CORE_WORD_COUNT_MINIMUM) {
      errors.push(
        `${item.slug} core content must contain at least ${CORE_WORD_COUNT_MINIMUM} words across unique content fields`,
      );
    }
  }

  for (const category of REQUIRED_CATEGORIES) {
    if (!categories.has(category)) {
      errors.push(`missing ${category} category content`);
    }
  }

  const prioritySlugs = records
    .filter((item) => item.isPriority)
    .map((item) => item.slug)
    .sort((a, b) => Number(a) - Number(b));
  compareLists(
    "priority slugs",
    prioritySlugs,
    [...PRIORITY_SLUGS].sort((a, b) => Number(a) - Number(b)),
    errors,
  );

  if (!silent) {
    if (errors.length > 0) {
      console.error(errors.map((error) => `- ${error}`).join("\n"));
    } else {
      console.log(`Checked ${records.length} angel number records.`);
    }
  }

  return {
    checkedCount: records.length,
    errors,
  };
}

function validateRecord(item: AngelNumber, expectedSlug: string, errors: string[]) {
  if (item.slug !== expectedSlug) {
    errors.push(`${expectedSlug} filename must match slug ${item.slug}`);
  }
  if (item.number !== item.slug) {
    errors.push(`${item.slug} number must match slug`);
  }
  if (!/^\d+$/.test(item.slug)) {
    errors.push(`${item.slug} slug must be pure digits`);
  }
  if (PLACEHOLDER_PATTERN.test(getContentText(item))) {
    errors.push(`${item.slug} contains placeholder content`);
  }
  if (
    item.meta.description.length < META_DESCRIPTION_MINIMUM ||
    item.meta.description.length > META_DESCRIPTION_MAXIMUM
  ) {
    errors.push(
      `${item.slug} meta description must be ${META_DESCRIPTION_MINIMUM}-${META_DESCRIPTION_MAXIMUM} characters`,
    );
  }
  if (item.faqs.length < 3) {
    errors.push(`${item.slug} must include at least 3 FAQs`);
  }
  if (item.relatedNumbers.length < 3) {
    errors.push(`${item.slug} must include at least 3 related numbers`);
  }

  for (const relatedNumber of item.relatedNumbers) {
    if (!/^\d{1,12}$/.test(relatedNumber)) {
      errors.push(`${item.slug} has invalid related number ${relatedNumber}`);
    }
    if (relatedNumber === item.slug) {
      errors.push(`${item.slug} cannot relate to itself`);
    }
  }
}

function compareLists(
  label: string,
  actual: string[],
  expected: string[],
  errors: string[],
) {
  if (actual.length !== expected.length) {
    errors.push(`${label} expected ${expected.length} items but found ${actual.length}`);
  }

  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  const missing = expected.filter((item) => !actualSet.has(item));
  const unexpected = actual.filter((item) => !expectedSet.has(item));

  if (missing.length > 0) {
    errors.push(`${label} missing: ${missing.join(", ")}`);
  }
  if (unexpected.length > 0) {
    errors.push(`${label} unexpected: ${unexpected.join(", ")}`);
  }
}

function getContentText(item: AngelNumber) {
  return [
    item.title,
    item.shortMeaning,
    item.summary,
    ...Object.values(item.meanings),
    item.numerology.rootMeaning,
    item.numerology.calculation,
    ...item.biblicalReferences.flatMap((reference) => [
      reference.verse,
      reference.text,
      reference.relevance,
    ]),
    item.affirmation,
    ...item.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
}

function countWords(value: string) {
  return value.split(/\s+/).filter(Boolean).length;
}

function normalizeContentFingerprint(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  checkAngelNumberContent().then((result) => {
    if (result.errors.length > 0) {
      process.exitCode = 1;
    }
  });
}
