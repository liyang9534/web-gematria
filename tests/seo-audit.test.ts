import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import matter from "gray-matter";
import { getAllAngelNumbers } from "../lib/angel-numbers";
import {
  createArticleJsonLd,
  createBreadcrumbJsonLd,
  createFAQJsonLd,
  createWebsiteSearchJsonLd,
} from "../lib/seo/schema";
import { getPublicSiteUrl } from "../lib/site-url";

const BLOG_TITLE_MINIMUM = 20;
const BLOG_TITLE_MAXIMUM = 65;
const BLOG_DESCRIPTION_MINIMUM = 100;
const BLOG_DESCRIPTION_MAXIMUM = 160;

test("published blog frontmatter keeps search-safe unique metadata", async () => {
  const blogDir = path.join(process.cwd(), "blogs", "en");
  const files = (await readdir(blogDir)).filter((file) => file.endsWith(".mdx"));
  const seenDescriptions = new Set<string>();

  for (const file of files) {
    const source = await readFile(path.join(blogDir, file), "utf8");
    const { data } = matter(source);

    if (data.status !== "published") {
      continue;
    }

    assert.equal(data.visibility, "public", `${file} must be public`);
    assert.match(data.slug, /^\/[a-z0-9-]+$/, `${file} must use a clean absolute slug`);
    assert.ok(
      data.title.length >= BLOG_TITLE_MINIMUM &&
        data.title.length <= BLOG_TITLE_MAXIMUM,
      `${file} title must be ${BLOG_TITLE_MINIMUM}-${BLOG_TITLE_MAXIMUM} characters`,
    );
    assert.ok(
      data.description.length >= BLOG_DESCRIPTION_MINIMUM &&
        data.description.length <= BLOG_DESCRIPTION_MAXIMUM,
      `${file} description must be ${BLOG_DESCRIPTION_MINIMUM}-${BLOG_DESCRIPTION_MAXIMUM} characters`,
    );

    const descriptionKey = data.description.toLowerCase().replace(/\s+/g, " ").trim();
    assert.equal(seenDescriptions.has(descriptionKey), false, `${file} duplicates a meta description`);
    seenDescriptions.add(descriptionKey);
  }
});

test("curated angel-number FAQs are unique within each reading", () => {
  for (const reading of getAllAngelNumbers()) {
    const questions = reading.faqs.map((faq) => faq.question.toLowerCase().replace(/\s+/g, " ").trim());
    const answers = reading.faqs.map((faq) => faq.answer.toLowerCase().replace(/\s+/g, " ").trim());

    assert.equal(new Set(questions).size, questions.length, `${reading.slug} has duplicate FAQ questions`);
    assert.equal(new Set(answers).size, answers.length, `${reading.slug} has duplicate FAQ answers`);
  }
});

test("schema builders emit SearchAction, FAQPage, BreadcrumbList, and Article JSON-LD", () => {
  assert.deepEqual(createWebsiteSearchJsonLd({
    siteName: "Angel Number Decoder",
    siteUrl: "https://example.com",
    searchUrlTemplate: "https://example.com/angel-number/{search_term_string}",
  }), {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Angel Number Decoder",
    url: "https://example.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://example.com/angel-number/{search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  });

  assert.equal(createFAQJsonLd([{ question: "What is 444?", answer: "A foundation signal." }])["@type"], "FAQPage");
  assert.equal(createBreadcrumbJsonLd([{ name: "Home", url: "https://example.com" }])["@type"], "BreadcrumbList");
  assert.equal(createArticleJsonLd({
    headline: "What Does 444 Mean in Love?",
    description: "A grounded relationship reading.",
    url: "https://example.com/blog/what-does-444-mean-in-love",
    datePublished: "2026-05-09T00:00:00.000Z",
    authorName: "Angel Number Decoder",
    publisherName: "Angel Number Decoder",
    publisherUrl: "https://example.com",
  })["@type"], "Article");
});

test("site and blog pages mount canonical SEO schema", async () => {
  const rootLayoutSource = await readFile("app/layout.tsx", "utf8");
  const layoutSource = await readFile("app/[locale]/layout.tsx", "utf8");
  const blogPageSource = await readFile("app/[locale]/(basic-layout)/blog/[slug]/page.tsx", "utf8");
  const metadataSource = await readFile("lib/metadata.ts", "utf8");

  assert.match(rootLayoutSource, /metadataBase:\s*new URL\(siteConfig\.url\)/);

  assert.match(layoutSource, /createWebsiteSearchJsonLd/);
  assert.match(layoutSource, /id="website-search"/);
  assert.match(layoutSource, /\/angel-number\/\{search_term_string\}/);

  assert.match(blogPageSource, /createArticleJsonLd/);
  assert.match(blogPageSource, /createBreadcrumbJsonLd/);
  assert.match(blogPageSource, /id=\{`blog-\$\{postSlug\}-article`\}/);
  assert.match(blogPageSource, /id=\{`blog-\$\{postSlug\}-breadcrumb`\}/);

  assert.match(metadataSource, /alternates:\s*{/);
  assert.match(metadataSource, /canonical:/);
  assert.match(metadataSource, /languages:\s*alternateLanguages/);
  assert.match(metadataSource, /x-default/);
  assert.match(metadataSource, /LOCALE_TO_HREFLANG/);
});

test("production public site URL does not silently fall back to localhost", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalSiteUrl = process.env.SITE_URL;
  const originalPublicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const originalCloudflarePagesUrl = process.env.CF_PAGES_URL;

  Object.defineProperty(process.env, "NODE_ENV", {
    value: "production",
    writable: true,
    configurable: true,
    enumerable: true,
  });
  delete process.env.SITE_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.CF_PAGES_URL;

  try {
    assert.throws(
      () => getPublicSiteUrl(),
      /SITE_URL|NEXT_PUBLIC_SITE_URL|CF_PAGES_URL/,
    );
  } finally {
    if (originalNodeEnv === undefined) {
      delete (process.env as Record<string, string | undefined>).NODE_ENV;
    } else {
      Object.defineProperty(process.env, "NODE_ENV", {
        value: originalNodeEnv,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    if (originalSiteUrl === undefined) {
      delete process.env.SITE_URL;
    } else {
      process.env.SITE_URL = originalSiteUrl;
    }

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

test("package exposes an SEO audit script", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));

  assert.equal(
    packageJson.scripts["seo:audit"],
    "node --import tsx --test tests/seo-audit.test.ts",
  );
  assert.match(packageJson.scripts["test:unit"], /tests\/seo-audit\.test\.ts/);
});
