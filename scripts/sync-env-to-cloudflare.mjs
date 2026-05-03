#!/usr/bin/env node

import { spawn, spawnSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function parseEnvFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const entries = [];

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    let [, key, value] = match;
    value = value.trim().replace(/\r$/, "");

    if (value.startsWith('"') || value.startsWith("'")) {
      const quote = value[0];
      const endQuoteIndex = value.indexOf(quote, 1);
      if (endQuoteIndex !== -1) {
        value = value.substring(1, endQuoteIndex);
      }
    } else {
      const commentIndex = value.indexOf(" #");
      if (commentIndex !== -1) {
        value = value.substring(0, commentIndex);
      }
      value = value.trim();
    }

    entries.push({ key, value });
  }

  return entries;
}

function checkWrangler() {
  const result = spawnSync("wrangler", ["--version"], { stdio: "ignore" });
  return result.status === 0;
}

function putSecret(key, value, configPath) {
  return new Promise((resolveSecret) => {
    const child = spawn(
      "wrangler",
      ["secret", "put", key, "--config", configPath],
      {
        stdio: ["pipe", "inherit", "inherit"],
      },
    );

    child.stdin.write(value);
    child.stdin.end();
    child.on("close", (code) => resolveSecret({ key, success: code === 0 }));
  });
}

async function main() {
  const envFile = process.argv[2] || ".env";
  const configPath = process.argv[3] || "wrangler.jsonc";
  const envPath = resolve(process.cwd(), envFile);

  if (!checkWrangler()) {
    console.error(
      "Wrangler CLI is not available. Run this script through pnpm: pnpm cf:sync-env",
    );
    process.exit(1);
  }

  if (!existsSync(envPath)) {
    console.error(`Env file not found: ${envFile}`);
    process.exit(1);
  }

  const entries = parseEnvFile(envPath).filter(({ key, value }) => {
    return value && key !== "DEPLOYMENT_PLATFORM";
  });

  for (const { key, value } of entries) {
    const result = await putSecret(key, value, configPath);
    console.log(`${result.success ? "set" : "failed"} ${result.key}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
