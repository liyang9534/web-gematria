import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const p0BlogSlugs = [
  "what-does-444-mean-in-love",
  "angel-numbers-for-twin-flames",
  "how-to-calculate-your-life-path-number",
  "what-is-gematria",
  "the-meaning-of-repeating-numbers",
  "angel-number-birthday-calculator",
] as const;

test("P0 blog articles exist as published English local posts", async () => {
  for (const slug of p0BlogSlugs) {
    const source = await readFile(`blogs/en/${slug}.mdx`, "utf8");

    assert.match(source, new RegExp(`slug:\\s*/${slug}`));
    assert.match(source, /status:\s*published/);
    assert.match(source, /visibility:\s*public/);
  }
});

test("P0 blog articles link into calculators and angel number pages", async () => {
  const gematria = await readFile("blogs/en/what-is-gematria.mdx", "utf8");
  const repeating = await readFile(
    "blogs/en/the-meaning-of-repeating-numbers.mdx",
    "utf8",
  );
  const birthday = await readFile(
    "blogs/en/angel-number-birthday-calculator.mdx",
    "utf8",
  );

  assert.match(gematria, /\[Gematria Calculator\]\(\/calculator\/gematria\)/);
  assert.match(gematria, /\[444\]\(\/angel-number\/444\)/);
  assert.match(repeating, /\[Angel Number Decoder\]\(\/angel-number\)/);
  assert.match(repeating, /\[1111\]\(\/angel-number\/1111\)/);
  assert.match(birthday, /\[My Angel Number Calculator\]\(\/calculator\/my-angel-number\)/);
});
