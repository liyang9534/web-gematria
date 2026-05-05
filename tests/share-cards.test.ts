import assert from "node:assert/strict";
import test from "node:test";
import {
  INSTAGRAM_SHARE_URL,
  TIKTOK_SHARE_URL,
  buildShareCardUrl,
  createSocialShareUrls,
  createShareCardDownloadName,
  createShareLinkText,
  createXIntentUrl,
} from "../lib/share-cards";

test("builds share-card image URLs for the OG route", () => {
  assert.equal(
    buildShareCardUrl({
      tool: "angel",
      number: "444",
      resultUrl: "https://angel-number-decoder.com/angel-number/444",
    }),
    "/api/og?tool=angel&number=444",
  );

  assert.equal(
    buildShareCardUrl({
      tool: "gematria",
      number: "444",
      word: "Jesus",
      resultUrl: "https://angel-number-decoder.com/calculator/gematria?q=Jesus",
    }),
    "/api/og?tool=gematria&number=444&word=Jesus",
  );
});

test("creates stable download names for generated cards", () => {
  assert.equal(
    createShareCardDownloadName({ tool: "numerology", number: "7", label: "Life Path", resultUrl: "/" }),
    "numerology-life-path-7.png",
  );
});

test("creates encoded social share and copy payloads", () => {
  const input = {
    tool: "angel" as const,
    number: "444",
    resultUrl: "https://angel-number-decoder.com/angel-number/444",
  };
  const intent = createXIntentUrl(input);

  assert.match(intent, /^https:\/\/twitter\.com\/intent\/tweet\?/);
  assert.match(intent, /444/);
  assert.ok(!intent.includes(" "));
  assert.equal(INSTAGRAM_SHARE_URL, "https://www.instagram.com/");
  assert.equal(TIKTOK_SHARE_URL, "https://www.tiktok.com/upload");
  assert.equal(createShareLinkText(input), input.resultUrl);
});

test("creates additional social platform share URLs without API keys", () => {
  const input = {
    tool: "gematria" as const,
    number: "444",
    word: "Jesus",
    resultUrl: "https://angel-number-decoder.com/calculator/gematria?q=Jesus",
  };
  const urls = createSocialShareUrls(input);

  assert.match(urls.facebook, /^https:\/\/www\.facebook\.com\/sharer\/sharer\.php\?/);
  assert.match(urls.linkedin, /^https:\/\/www\.linkedin\.com\/sharing\/share-offsite\/\?/);
  assert.match(urls.reddit, /^https:\/\/www\.reddit\.com\/submit\?/);
  assert.match(urls.threads, /^https:\/\/www\.threads\.net\/intent\/post\?/);
  assert.match(urls.whatsapp, /^https:\/\/api\.whatsapp\.com\/send\?/);
  assert.match(urls.telegram, /^https:\/\/t\.me\/share\/url\?/);
  assert.match(urls.pinterest, /^https:\/\/www\.pinterest\.com\/pin\/create\/button\/\?/);
  assert.match(urls.email, /^mailto:\?/);
  assert.ok(!urls.whatsapp.includes(" "));
  assert.ok(urls.pinterest.includes("media="));
});
