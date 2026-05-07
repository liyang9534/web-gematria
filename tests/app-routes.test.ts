import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { promisify } from "node:util";
import { buildPublicUrl, getConfiguredPublicSiteUrl, getPublicSiteUrl } from "../lib/site-url";

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

test("sitemap derives URLs from runtime request host instead of static localhost fallback", async () => {
  const source = await readFile("app/sitemap.ts", "utf8");

  assert.match(source, /from\s+["']next\/headers["']/);
  assert.match(source, /dynamic\s*=\s*["']force-dynamic["']/);
  assert.match(source, /getConfiguredPublicSiteUrl/);
  assert.doesNotMatch(source, /siteConfig/);
  assert.doesNotMatch(source, /angel-number-decoder\.com/);
  assert.doesNotMatch(source, /getPublicSiteUrl\(\)/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_SITE_URL is required/);
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

test("share-card OG route renders the request host instead of the site config fallback", async () => {
  const source = await readFile("app/api/og/route.ts", "utf8");

  assert.match(source, /request\.nextUrl\.host/);
  assert.doesNotMatch(source, /siteConfig/);
});

test("page previews use generated OG images instead of static public image assets", async () => {
  const metadataSource = await readFile("lib/metadata.ts", "utf8");
  const defaultOgSource = await readFile("app/opengraph-image.tsx", "utf8");
  const blogOgSource = await readFile("app/[locale]/(basic-layout)/blog/[slug]/opengraph-image.tsx", "utf8");
  const glossaryOgSource = await readFile("app/[locale]/(basic-layout)/glossary/[slug]/opengraph-image.tsx", "utf8");

  assert.match(metadataSource, /\/opengraph-image/);
  assert.doesNotMatch(metadataSource, /\/og(?:_\$?\{[^}]+\})?\.png/);
  assert.match(defaultOgSource, /ImageResponse/);
  assert.doesNotMatch(blogOgSource, /logo\.png|<img/);
  assert.doesNotMatch(glossaryOgSource, /logo\.png|<img/);
});

test("public site URL falls back to Cloudflare deployment URL during builds", () => {
  const originalPublicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const originalCloudflarePagesUrl = process.env.CF_PAGES_URL;

  delete process.env.NEXT_PUBLIC_SITE_URL;
  process.env.CF_PAGES_URL = "https://preview.example.pages.dev/";

  try {
    assert.equal(getPublicSiteUrl(), "https://preview.example.pages.dev");
    assert.equal(buildPublicUrl("/sitemap.xml"), "https://preview.example.pages.dev/sitemap.xml");
  } finally {
    if (originalPublicSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalPublicSiteUrl;
    }

    if (originalCloudflarePagesUrl === undefined) {
      delete process.env.CF_PAGES_URL;
    } else {
      process.env.CF_PAGES_URL = originalCloudflarePagesUrl;
    }
  }
});

test("configured public site URL excludes local development fallback", () => {
  const originalPublicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const originalCloudflarePagesUrl = process.env.CF_PAGES_URL;

  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.CF_PAGES_URL;

  try {
    assert.equal(getConfiguredPublicSiteUrl(), undefined);

    process.env.NEXT_PUBLIC_SITE_URL = "example.com/";
    assert.equal(getConfiguredPublicSiteUrl(), "https://example.com");
  } finally {
    if (originalPublicSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalPublicSiteUrl;
    }

    if (originalCloudflarePagesUrl === undefined) {
      delete process.env.CF_PAGES_URL;
    } else {
      process.env.CF_PAGES_URL = originalCloudflarePagesUrl;
    }
  }
});
