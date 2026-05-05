import assert from "node:assert/strict";
import test from "node:test";
import { buildDecoderSearchTarget } from "../lib/decoder-search";

test("routes pure numeric input to an angel number reading", () => {
  assert.equal(buildDecoderSearchTarget("444"), "/angel-number/444");
  assert.equal(buildDecoderSearchTarget(" 12:345 "), "/angel-number/12345");
});

test("routes text input to the gematria calculator with the original phrase", () => {
  assert.equal(
    buildDecoderSearchTarget("Jesus"),
    "/calculator/gematria?input=Jesus",
  );
  assert.equal(
    buildDecoderSearchTarget("Sarah Connor"),
    "/calculator/gematria?input=Sarah%20Connor",
  );
  assert.equal(
    buildDecoderSearchTarget("Jesus 444"),
    "/calculator/gematria?input=Jesus%20444",
  );
});

test("rejects empty or non-decodable input", () => {
  assert.equal(buildDecoderSearchTarget("   "), null);
  assert.equal(buildDecoderSearchTarget("!!!"), null);
  assert.equal(buildDecoderSearchTarget("1".repeat(13)), null);
});
