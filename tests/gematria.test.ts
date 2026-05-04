import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateGematria,
  createGematriaShareText,
  createGematriaShareUrl,
  getGematriaMatches,
  normalizeGematriaInput,
} from "../lib/gematria";

test("normalizes gematria input without losing Hebrew letters", () => {
  assert.equal(normalizeGematriaInput("  Hello, 444! שלום "), "HELLO שלום");
});

test("calculates English ordinal, x6, reverse, and reduction systems", () => {
  const result = calculateGematria("Angel");

  assert.equal(result.input, "Angel");
  assert.equal(result.normalizedInput, "ANGEL");
  assert.equal(result.values.englishOrdinal, 39);
  assert.equal(result.values.simple, 39);
  assert.equal(result.values.englishGematria, 234);
  assert.equal(result.values.reverseOrdinal, 96);
  assert.equal(result.values.fullReduction, 21);
  assert.equal(result.values.pythagorean, 21);
  assert.deepEqual(
    result.letterBreakdown.map((item) => item.letter),
    ["A", "N", "G", "E", "L"],
  );
});

test("calculates standard Hebrew gematria", () => {
  const result = calculateGematria("שלום");

  assert.equal(result.values.hebrewStandard, 376);
  assert.equal(result.letterBreakdown.length, 4);
});

test("finds same-value example terms for common calculator results", () => {
  const matches = getGematriaMatches(39, "englishOrdinal");

  assert.ok(matches.some((match) => match.term === "ANGEL"));
});

test("creates share text and URLs for gematria results", () => {
  const result = calculateGematria("Angel");

  assert.match(createGematriaShareText(result), /ANGEL/);
  assert.match(createGematriaShareText(result), /English Ordinal: 39/);
  assert.equal(
    createGematriaShareUrl("https://example.com/calculator/gematria", result),
    "https://example.com/calculator/gematria?q=Angel",
  );
});
