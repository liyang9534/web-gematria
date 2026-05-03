import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

export type DB = DrizzleD1Database<typeof schema>;

export type D1Binding = {
  prepare: (query: string) => unknown;
  batch?: (statements: unknown[]) => Promise<unknown[]>;
  exec?: (query: string) => Promise<unknown>;
  dump?: () => Promise<ArrayBuffer>;
};

export function createDatabase(binding: D1Binding): DB {
  return drizzle(binding as never, { schema });
}

function detectPlatform() {
  if (process.env.DEPLOYMENT_PLATFORM === "cloudflare") return "cloudflare";
  if (process.env.VERCEL_ENV) return "vercel";
  if (process.env.NETLIFY) return "netlify";
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) return "lambda";
  return "server";
}

export function previewConfig() {
  const platform = detectPlatform();

  return {
    platform,
    database: "cloudflare-d1",
    summary: {
      isServerless: true,
      requiresSSL: false,
      connectionPooling: false,
      preparedStatements: true,
      runtimeBinding: "DB",
    },
  };
}
