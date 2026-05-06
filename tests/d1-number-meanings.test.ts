import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { REQUIRED_NUMBER_MEANINGS } from "../lib/number-meanings";
import { createLocalD1 } from "./helpers/d1-local";

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, "..");
const tsxBin = resolve(
  projectRoot,
  "node_modules/.bin",
  process.platform === "win32" ? "tsx.cmd" : "tsx"
);
const seedScript = resolve(projectRoot, "scripts/seed-number-base-meanings.ts");

function runSeed(persistTo: string) {
  const result = spawnSync(
    tsxBin,
    [seedScript, "--local", "--persist-to", persistTo],
    {
      cwd: projectRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        CI: "true",
        WRANGLER_SEND_METRICS: "false",
      },
    },
  );

  assert.equal(
    result.status,
    0,
    `seed script failed\n\nstdout:\n${result.stdout}\n\nstderr:\n${result.stderr}`,
  );
}

test("seeds shared number meanings into D1 idempotently", { timeout: 60_000 }, () => {
  const db = createLocalD1();

  try {
    runSeed(db.persistTo);
    runSeed(db.persistTo);

    const rows = db.queryRows(
      "select number, keywords, numerology_desc as numerologyDesc, angel_desc as angelDesc from number_base_meanings order by cast(number as integer), number",
    );

    assert.equal(rows.length, REQUIRED_NUMBER_MEANINGS.length);

    const meaning444 = rows.find((row) => row.number === "444");
    assert.ok(meaning444);
    assert.deepEqual(JSON.parse(String(meaning444.keywords)), [
      "protection",
      "stability",
      "foundation",
    ]);
    assert.match(String(meaning444.numerologyDesc), /structure/i);
    assert.match(String(meaning444.angelDesc), /protection/i);
  } finally {
    db.cleanup();
  }
});
