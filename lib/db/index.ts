import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDatabase, type D1Binding, type DB } from "./config";

export type { DB } from "./config";

type DatabaseEnv = {
  DB?: D1Binding;
  NEXTY_DB?: D1Binding;
};

let cachedDb: DB | null = null;
let cachedBinding: D1Binding | null = null;

function resolveBinding(env?: DatabaseEnv) {
  return env?.DB || env?.NEXTY_DB || null;
}

function getCloudflareEnv() {
  try {
    return getCloudflareContext().env as DatabaseEnv;
  } catch {
    return undefined;
  }
}

async function getCloudflareEnvAsync() {
  try {
    const context = await getCloudflareContext({ async: true });
    return context.env as DatabaseEnv;
  } catch {
    return undefined;
  }
}

function getCachedDb(binding: D1Binding | null) {
  if (!binding) {
    throw new Error(
      "Business database is not configured. Bind Cloudflare D1 as DB in wrangler.jsonc.",
    );
  }

  if (!cachedDb || cachedBinding !== binding) {
    cachedDb = createDatabase(binding);
    cachedBinding = binding;
  }

  return cachedDb;
}

export function getDb() {
  return getCachedDb(resolveBinding(getCloudflareEnv()));
}

export async function getDbAsync() {
  return getCachedDb(resolveBinding(await getCloudflareEnvAsync()));
}

export function isDatabaseConfigured() {
  return !!resolveBinding(getCloudflareEnv());
}

export const isDatabaseEnabled = false;

export const db = new Proxy({} as DB, {
  get(_target, property, receiver) {
    const database = getDb();
    const value = Reflect.get(database, property, receiver);
    return typeof value === "function" ? value.bind(database) : value;
  },
});
