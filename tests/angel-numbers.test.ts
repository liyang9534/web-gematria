import assert from "node:assert/strict";
import test from "node:test";
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

test("loads the first nine triple angel numbers with unique slugs", () => {
  const numbers = getAllAngelNumbers();
  const slugs = numbers.map((item) => item.slug);

  assert.equal(numbers.length, 9);
  assert.deepEqual(slugs, [
    "111",
    "222",
    "333",
    "444",
    "555",
    "666",
    "777",
    "888",
    "999",
  ]);
  assert.equal(new Set(slugs).size, slugs.length);
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

  assert.equal(featured.length, 9);
  assert.equal(isKnownAngelNumber("111"), true);
  assert.equal(isKnownAngelNumber("12345"), false);
  assert.throws(() => getAngelNumber("12345"), /Unknown angel number/);
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
