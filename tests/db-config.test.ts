import assert from "node:assert/strict";
import test from "node:test";
import { previewConfig } from "../lib/db/config";

const ORIGINAL_DEPLOYMENT_PLATFORM = process.env.DEPLOYMENT_PLATFORM;

test.afterEach(() => {
  if (ORIGINAL_DEPLOYMENT_PLATFORM === undefined) {
    delete process.env.DEPLOYMENT_PLATFORM;
  } else {
    process.env.DEPLOYMENT_PLATFORM = ORIGINAL_DEPLOYMENT_PLATFORM;
  }
});

test("describes Cloudflare D1 as the business database", () => {
  process.env.DEPLOYMENT_PLATFORM = "cloudflare";

  const preview = previewConfig();

  assert.equal(preview.platform, "cloudflare");
  assert.equal(preview.database, "cloudflare-d1");
  assert.equal(preview.summary.isServerless, true);
  assert.equal(preview.summary.connectionPooling, false);
  assert.equal(preview.summary.runtimeBinding, "DB");
});
