import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type D1Result = {
  results?: Record<string, unknown>[];
  success?: boolean;
  error?: string;
};

type D1JsonOutput =
  | D1Result[]
  | {
      error?: {
        text?: string;
      };
    };

type WranglerRun = {
  json: D1JsonOutput;
  status: number;
  stderr: string;
  stdout: string;
};

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, "../..");
const migrationsDir = resolve(projectRoot, "lib/db/migrations-d1");
const wranglerBin = resolve(
  projectRoot,
  "node_modules/.bin",
  process.platform === "win32" ? "wrangler.cmd" : "wrangler"
);
const wranglerLogPath = join(tmpdir(), "nexty-d1-test-wrangler.log");

function parseD1Json(stdout: string, stderr: string): D1JsonOutput {
  const output = stdout.trim();

  if (!output) {
    throw new Error(`Wrangler returned no JSON output.\n${stderr}`);
  }

  try {
    return JSON.parse(output) as D1JsonOutput;
  } catch (error) {
    throw new Error(
      `Wrangler returned invalid JSON.\n${(error as Error).message}\n\nstdout:\n${stdout}\n\nstderr:\n${stderr}`
    );
  }
}

function assertSuccessfulD1Result(json: D1JsonOutput, label: string) {
  assert.ok(Array.isArray(json), `${label} should return a D1 result array`);

  for (const result of json) {
    assert.equal(
      result.success,
      true,
      `${label} failed: ${result.error ?? "unknown D1 error"}`
    );
  }
}

function runWrangler(args: string[], allowFailure = false): WranglerRun {
  const result = spawnSync(wranglerBin, args, {
    cwd: projectRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      CI: "true",
      WRANGLER_LOG_PATH: wranglerLogPath,
      WRANGLER_SEND_METRICS: "false",
    },
  });

  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  const json = parseD1Json(stdout, stderr);
  const status = result.status ?? 1;

  if (!allowFailure) {
    assert.equal(
      status,
      0,
      `${wranglerBin} ${args.join(" ")} exited with ${status}\n\nstdout:\n${stdout}\n\nstderr:\n${stderr}`
    );
    assertSuccessfulD1Result(json, `${wranglerBin} ${args.join(" ")}`);
  }

  return {
    json,
    status,
    stderr,
    stdout,
  };
}

export function createLocalD1() {
  const persistTo = mkdtempSync(join(tmpdir(), "nexty-d1-test-"));
  const commonArgs = [
    "d1",
    "execute",
    "DB",
    "--local",
    "--persist-to",
    persistTo,
    "--json",
  ];

  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => resolve(migrationsDir, file));

  for (const migrationFile of migrationFiles) {
    runWrangler([...commonArgs, "--file", migrationFile]);
  }

  return {
    persistTo,
    cleanup() {
      rmSync(persistTo, { recursive: true, force: true });
    },
    execute(sql: string) {
      return runWrangler([...commonArgs, "--command", sql]).json as D1Result[];
    },
    queryRows(sql: string) {
      const result = runWrangler([...commonArgs, "--command", sql])
        .json as D1Result[];

      return result.flatMap((item) => item.results ?? []);
    },
    tryExecute(sql: string) {
      return runWrangler([...commonArgs, "--command", sql], true);
    },
  };
}
