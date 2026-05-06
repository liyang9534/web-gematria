import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

test("root not-found renders directly instead of redirecting", async () => {
  const source = await readFile("app/not-found.tsx", "utf8");

  assert.doesNotMatch(source, /from\s+["']next\/navigation["']/);
  assert.doesNotMatch(source, /\bredirect\s*\(/);
});

test("header hides the unauthenticated login button", async () => {
  const source = await readFile("components/header/UserAvatar.tsx", "utf8");

  assert.doesNotMatch(source, /LoginButton/);
  assert.match(source, /if\s*\(\s*!user\s*\)\s*{[\s\S]*?return\s+null\s*;/);
});

test("sitemap uses NEXT_PUBLIC_SITE_URL instead of the site config fallback domain", async () => {
  const source = await readFile("app/sitemap.ts", "utf8");

  assert.match(source, /process\.env\.NEXT_PUBLIC_SITE_URL/);
  assert.doesNotMatch(source, /siteConfig/);
  assert.doesNotMatch(source, /angel-number-decoder\.com/);
});

test("tracked project files do not hard-code the production domain", async () => {
  const domain = ["angel", "number", "decoder"].join("-") + ".com";

  await assert.rejects(
    execFileAsync("git", ["grep", "-F", "-n", domain]),
    (error: unknown) => {
      assert.equal((error as { code?: number }).code, 1);
      return true;
    },
  );
});
