import assert from "node:assert/strict";
import test from "node:test";
import {
  REQUIRED_NUMBER_MEANINGS,
  getAngelDescription,
  getNumberBaseMeaning,
  getNumberKeywords,
  getNumerologyDescription,
} from "../lib/number-meanings";
import { getNumerologyMeaning } from "../lib/numerology";

test("covers all required cross-tool numbers", () => {
  for (const number of REQUIRED_NUMBER_MEANINGS) {
    const meaning = getNumberBaseMeaning(number);

    assert.ok(meaning.keywords.length > 0, `${number} should have keywords`);
    assert.ok(meaning.numerology_desc.length > 0, `${number} should have numerology copy`);
    assert.ok(meaning.angel_desc.length > 0, `${number} should have angel copy`);
  }
});

test("returns safe fallback copy for unknown numbers", () => {
  const meaning = getNumberBaseMeaning("98765");

  assert.deepEqual(getNumberKeywords("98765"), ["reflection"]);
  assert.match(meaning.numerology_desc, /blended numerology influence/i);
  assert.match(getAngelDescription("98765"), /personal signal/i);
});

test("numerology meanings use the shared numerology description", () => {
  assert.equal(getNumerologyMeaning(7), getNumerologyDescription("7"));
  assert.match(getNumerologyMeaning(7), /truth|wisdom|insight/i);
});
