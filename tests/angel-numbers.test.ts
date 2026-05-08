import assert from "node:assert/strict";
import test from "node:test";
import { checkAngelNumberContent } from "../scripts/check-angel-number-content";
import {
  buildAngelNumberSearchTarget,
  getAllAngelNumbers,
  getAngelNumber,
  getFeaturedAngelNumbers,
  getReadingForNumber,
  interpretAnyNumber,
  isKnownAngelNumber,
} from "../lib/angel-numbers";
import { getAngelNumberRobotsPolicy } from "../lib/angel-numbers/seo";
import { getAngelNumberStaticParams } from "../lib/angel-numbers/static-params";

const EXPECTED_CURATED_SLUGS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "11",
  "12",
  "22",
  "24",
  "33",
  "40",
  "44",
  "50",
  "55",
  "66",
  "70",
  "72",
  "77",
  "88",
  "99",
  "101",
  "108",
  "111",
  "120",
  "123",
  "144",
  "153",
  "202",
  "222",
  "234",
  "303",
  "318",
  "333",
  "345",
  "365",
  "390",
  "404",
  "444",
  "456",
  "490",
  "505",
  "555",
  "567",
  "606",
  "613",
  "616",
  "666",
  "678",
  "707",
  "777",
  "789",
  "808",
  "888",
  "909",
  "999",
  "1000",
  "1001",
  "1111",
  "1212",
  "1221",
  "1234",
  "1260",
  "1331",
  "1441",
  "1551",
  "2002",
  "2112",
  "2222",
  "2332",
  "2345",
  "2442",
  "3003",
  "3113",
  "3333",
  "3456",
  "4444",
  "5555",
  "6666",
  "7777",
  "8888",
  "9999",
  "144000",
];

const EXPECTED_PRIORITY_SLUGS = [
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
];

test("loads 87 curated angel numbers with unique numeric slugs", () => {
  const numbers = getAllAngelNumbers();
  const slugs = numbers.map((item) => item.slug);

  assert.equal(numbers.length, 87);
  assert.deepEqual(slugs, EXPECTED_CURATED_SLUGS);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(slugs.every((slug) => /^\d+$/.test(slug)));
});

test("covers every curated angel number in static params", () => {
  const staticSlugs = getAngelNumberStaticParams().map((param) => param.number);

  assert.deepEqual(staticSlugs, EXPECTED_CURATED_SLUGS);
  assert.equal(new Set(staticSlugs).size, staticSlugs.length);
});

test("returns complete SEO and reading data for 444", () => {
  const angelNumber = getAngelNumber("444");

  assert.equal(angelNumber.number, "444");
  assert.equal(angelNumber.category, "triple");
  assert.match(angelNumber.meta.title, /Angel Number 444 Meaning/);
  assert.ok(angelNumber.meta.description.length >= 120);
  assert.ok(angelNumber.summary.length > 80);
  assert.ok(angelNumber.meanings.love.length > 40);
  assert.ok(angelNumber.meanings.career.length > 40);
  assert.ok(angelNumber.meanings.money.length > 40);
  assert.ok(angelNumber.meanings.spiritual.length > 40);
  assert.ok(angelNumber.faqs.length >= 3);
  assert.ok(angelNumber.relatedNumbers.includes("44"));
  assert.ok(angelNumber.relatedNumbers.includes("4444"));
  assert.equal(angelNumber.numerology.rootNumber, 3);
});

test("exposes featured numbers and known-number lookups", () => {
  const featured = getFeaturedAngelNumbers();
  const featuredSlugs = featured.map((item) => item.slug);

  assert.equal(featured.length, 20);
  assert.deepEqual(featuredSlugs, EXPECTED_PRIORITY_SLUGS);
  assert.equal(isKnownAngelNumber("111"), true);
  assert.equal(isKnownAngelNumber("12345"), false);
  assert.throws(() => getAngelNumber("12345"), /Unknown angel number/);
});

test("curated records cover all planned content categories", () => {
  const categories = new Set(getAllAngelNumbers().map((item) => item.category));

  assert.deepEqual([...categories].sort(), [
    "double",
    "mirror",
    "quad",
    "sequence",
    "single",
    "special",
    "triple",
  ]);
});

test("interprets arbitrary numbers without requiring curated content", () => {
  const reading = interpretAnyNumber("12345");

  assert.equal(reading.number, "12345");
  assert.equal(reading.slug, "12345");
  assert.equal(reading.source, "generated");
  assert.equal(reading.seo.shouldIndex, false);
  assert.match(reading.pattern.label, /sequence/i);
  assert.equal(reading.numerology.rootNumber, 6);
  assert.ok(reading.meanings.love.length > 40);
  assert.ok(reading.meanings.career.length > 40);
  assert.ok(reading.faqs.length >= 3);
  assert.ok(reading.relatedNumbers.includes("1234"));
});

test("uses curated content and index policy for high-frequency numbers", () => {
  const reading = getReadingForNumber("444");

  assert.equal(reading.source, "curated");
  assert.equal(reading.seo.shouldIndex, true);
  assert.match(reading.meta.title, /Angel Number 444 Meaning/);
  assert.equal(reading.numerology.rootNumber, 3);
});

test("keeps arbitrary number pages followable while excluding them from index", () => {
  const generated = getReadingForNumber("12345");
  const curated = getReadingForNumber("444");

  assert.deepEqual(getAngelNumberRobotsPolicy(generated), {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  });
  assert.equal(getAngelNumberRobotsPolicy(curated), undefined);
});

test("classifies common number patterns", () => {
  assert.equal(interpretAnyNumber("1221").pattern.kind, "mirror");
  assert.equal(interpretAnyNumber("7777").pattern.kind, "repeat");
  assert.equal(interpretAnyNumber("7").pattern.kind, "single");
  assert.equal(interpretAnyNumber("8462").pattern.kind, "general");
});

test("builds search targets for any numeric input", () => {
  assert.equal(buildAngelNumberSearchTarget(" 12:345 "), "/angel-number/12345");
  assert.equal(buildAngelNumberSearchTarget("abc"), null);
  assert.equal(buildAngelNumberSearchTarget("1".repeat(13)), null);
});

test("source angel number content passes quality checks", async () => {
  const result = await checkAngelNumberContent({
    rootDir: process.cwd(),
    silent: true,
  });

  assert.equal(result.checkedCount, 87);
  assert.deepEqual(result.errors, []);
});
