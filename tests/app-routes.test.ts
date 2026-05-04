import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("root not-found renders directly instead of redirecting", async () => {
  const source = await readFile("app/not-found.tsx", "utf8");

  assert.doesNotMatch(source, /from\s+["']next\/navigation["']/);
  assert.doesNotMatch(source, /\bredirect\s*\(/);
});
