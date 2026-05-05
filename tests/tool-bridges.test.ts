import assert from "node:assert/strict";
import test from "node:test";
import { calculateGematria } from "../lib/gematria";
import {
  buildAngelToGematriaUrl,
  getGematriaAngelNumberMatches,
} from "../lib/tool-bridges";

test("detects Gematria results that match angel-number targets", () => {
  const matches = getGematriaAngelNumberMatches(calculateGematria("Jesus"));

  assert.ok(matches.some((match) => match.number === "444"));
  assert.ok(matches.some((match) => match.system === "englishGematria"));
  assert.match(matches[0].title, /444/);
  assert.match(matches[0].description, /angel|spiritual|signal/i);
});

test("does not create Gematria bridge recommendations for ordinary results", () => {
  const matches = getGematriaAngelNumberMatches(calculateGematria("Angel"));

  assert.equal(matches.length, 0);
});

test("builds Angel Number to Gematria target links", () => {
  assert.equal(
    buildAngelToGematriaUrl("444"),
    "/calculator/gematria?value=444",
  );
});
