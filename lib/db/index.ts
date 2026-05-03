import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDatabase, type DB } from "./config";

export type { DB } from "./config";

type HyperdriveBinding = {
  connectionString: string;
};

type DatabaseEnv = CloudflareEnv & {
  HYPERDRIVE?: HyperdriveBinding;
  DATABASE_URL?: string;
  POSTGRES_URL?: string;
};

let cachedDb: DB | null = null;
let cachedConnectionString: string | null = null;

function resolveFromEnv(env?: DatabaseEnv) {
  return (
    env?.HYPERDRIVE?.connectionString ||
    env?.DATABASE_URL ||
    env?.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    ""
  );
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

function getCachedDb(connectionString: string) {
  if (!connectionString) {
    throw new Error(
      "Database connection is not configured. Set DATABASE_URL for Node/local deployments or bind HYPERDRIVE in Cloudflare Workers.",
    );
  }

  if (!cachedDb || cachedConnectionString !== connectionString) {
    cachedDb = createDatabase({ connectionString });
    cachedConnectionString = connectionString;
  }

  return cachedDb;
}

export function getDb() {
  return getCachedDb(resolveFromEnv(getCloudflareEnv()));
}

export async function getDbAsync() {
  return getCachedDb(resolveFromEnv(await getCloudflareEnvAsync()));
}

export function isDatabaseConfigured() {
  return !!resolveFromEnv(getCloudflareEnv());
}

export const isDatabaseEnabled = !!process.env.DATABASE_URL;

export const db = new Proxy({} as DB, {
  get(_target, property, receiver) {
    const database = getDb();
    const value = Reflect.get(database, property, receiver);
    return typeof value === "function" ? value.bind(database) : value;
  },
});
