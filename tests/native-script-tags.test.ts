import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const SOURCE_DIRS = ["app", "components", "lib"];
const TSX_FILE_PATTERN = /\.(?:tsx|jsx)$/;
const NATIVE_SCRIPT_PATTERN = /<script(?:\s|>)/;
const SERVER_ONLY_IMPORT_PATTERN = /import\s+["']server-only["'];/;

test("native JSX script tags stay in server-only modules", async () => {
  const files = await collectSourceFiles(SOURCE_DIRS);
  const filesWithNativeScripts: string[] = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");

    if (!NATIVE_SCRIPT_PATTERN.test(source)) continue;

    filesWithNativeScripts.push(file);
    assert.match(
      source,
      SERVER_ONLY_IMPORT_PATTERN,
      `${file} renders a native <script> tag and must be marked server-only`,
    );
  }

  assert.ok(
    filesWithNativeScripts.length > 0,
    "expected at least one native script tag policy check",
  );
});

async function collectSourceFiles(entries: string[]): Promise<string[]> {
  const files: string[] = [];

  for (const entry of entries) {
    const stats = await readdir(entry, { withFileTypes: true });

    for (const stat of stats) {
      const child = path.join(entry, stat.name);

      if (stat.isDirectory()) {
        if (child.includes(`${path.sep}migrations`)) continue;
        files.push(...(await collectSourceFiles([child])));
        continue;
      }

      if (stat.isFile() && TSX_FILE_PATTERN.test(stat.name)) {
        files.push(child);
      }
    }
  }

  return files;
}
