import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateExpressionNumber,
  calculateLifePathNumber,
  calculateNumerologyProfile,
  calculatePersonalityNumber,
  calculateSoulUrgeNumber,
  reduceNumerologyNumber,
} from "../lib/numerology";

test("reduces numerology numbers while preserving master numbers", () => {
  assert.equal(reduceNumerologyNumber(29), 11);
  assert.equal(reduceNumerologyNumber(38), 11);
  assert.equal(reduceNumerologyNumber(44), 44);
  assert.equal(reduceNumerologyNumber(37), 1);
});

test("calculates life path number from an ISO birthday", () => {
  const result = calculateLifePathNumber("1990-07-24");

  assert.equal(result.value, 5);
  assert.equal(result.calculation, "1+9+9+0+0+7+2+4 = 32 -> 3+2 = 5");
  assert.match(result.meaning, /freedom/i);
});

test("calculates name numerology values", () => {
  assert.equal(calculateExpressionNumber("Ada Lovelace").value, 9);
  assert.equal(calculateSoulUrgeNumber("Ada Lovelace").value, 1);
  assert.equal(calculatePersonalityNumber("Ada Lovelace").value, 8);
});

test("builds a complete numerology profile", () => {
  const profile = calculateNumerologyProfile({
    fullName: "Ada Lovelace",
    birthday: "1815-12-10",
  });

  assert.equal(profile.lifePath.value, 1);
  assert.equal(profile.expression.value, 9);
  assert.equal(profile.soulUrge.value, 1);
  assert.equal(profile.personality.value, 8);
});
