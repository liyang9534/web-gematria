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

test("uses Cloudflare-safe postgres options when DEPLOYMENT_PLATFORM is cloudflare", () => {
  process.env.DEPLOYMENT_PLATFORM = "cloudflare";

  const preview = previewConfig({
    connectionString: "postgresql://user:pass@example.com:5432/app",
  });

  assert.equal(preview.platform, "cloudflare");
  assert.equal(preview.summary.isServerless, true);
  assert.equal(preview.config.max, 1);
  assert.equal(preview.config.prepare, false);
  assert.equal(
    (preview.config as { fetch_types?: boolean }).fetch_types,
    false,
  );
});
