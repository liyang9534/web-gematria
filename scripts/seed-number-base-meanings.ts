/**
 * Seed shared number meanings into Cloudflare D1.
 *
 * Usage:
 * tsx scripts/seed-number-base-meanings.ts --local
 * tsx scripts/seed-number-base-meanings.ts --remote
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { buildNumberBaseMeaningsSeedSql } from "@/lib/number-meanings-sql";
import { REQUIRED_NUMBER_MEANINGS } from "@/lib/number-meanings";

const projectRoot = process.cwd();
const wranglerBin = resolve(
  projectRoot,
  "node_modules/.bin",
  process.platform === "win32" ? "wrangler.cmd" : "wrangler",
);

function readFlagValue(flag: string) {
  const index = process.argv.indexOf(flag);

  if (index === -1) return undefined;

  return process.argv[index + 1];
}

function getTargetFlag() {
  if (process.argv.includes("--remote")) return "--remote";

  return "--local";
}

function main() {
  const targetFlag = getTargetFlag();
  const persistTo = readFlagValue("--persist-to");
  const tempDir = mkdtempSync(join(tmpdir(), "nexty-number-meanings-seed-"));
  const sqlFile = join(tempDir, "number-base-meanings.sql");

  try {
    writeFileSync(sqlFile, buildNumberBaseMeaningsSeedSql());

    const args = ["d1", "execute", "DB", targetFlag, "--file", sqlFile];

    if (persistTo) {
      args.splice(4, 0, "--persist-to", persistTo);
    }

    const result = spawnSync(wranglerBin, args, {
      cwd: projectRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        CI: "true",
        WRANGLER_SEND_METRICS: "false",
      },
    });

    if (result.status !== 0) {
      console.error(result.stdout);
      console.error(result.stderr);
      process.exit(result.status ?? 1);
    }

    console.log(result.stdout);
    console.log(
      `Seeded D1 ${targetFlag.slice(2)} DB with ${REQUIRED_NUMBER_MEANINGS.length} number meanings.`,
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main();
