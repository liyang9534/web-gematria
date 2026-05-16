import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateBirthdayNumber,
  calculateExpressionNumber,
  calculateLifePathNumber,
  calculateMyAngelNumberProfile,
  calculateMyAngelNumberFromBirthday,
  calculateMyAngelNumberFromName,
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

test("calculates birthday number from the birthday day", () => {
  const result = calculateBirthdayNumber("1990-07-24");

  assert.equal(result.value, 6);
  assert.equal(result.calculation, "Birthday: 2+4 = 6");
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
  assert.equal(profile.birthday, "1815-12-10");
  assert.equal(profile.birthdayNumber.value, 1);
});

test("calculates my angel number from birthday digits", () => {
  const result = calculateMyAngelNumberFromBirthday("1990-07-24");

  assert.equal(result.value, 5);
  assert.equal(result.rawValue, 32);
  assert.equal(result.calculation, "Birthday method: 1+9+9+0+0+7+2+4 = 32 -> 3+2 = 5");
  assert.match(result.meaning, /freedom/i);
});

test("calculates my angel number from name with ordinal letters", () => {
  const result = calculateMyAngelNumberFromName("Sarah");

  assert.equal(result.value, 11);
  assert.equal(result.rawValue, 47);
  assert.equal(result.calculation, "Name method: 19+1+18+1+8 = 47 -> 4+7 = 11");
  assert.match(result.meaning, /intuition/i);
});

test("builds my angel number profile from optional birthday and name inputs", () => {
  const profile = calculateMyAngelNumberProfile({
    fullName: "Sarah",
    birthday: "1990-07-24",
  });

  assert.ok(profile.primary);
  assert.equal(profile.primary.value, 5);
  assert.equal(profile.birthdayResult?.value, 5);
  assert.equal(profile.nameResult?.value, 11);
  assert.equal(profile.results.length, 2);
});
