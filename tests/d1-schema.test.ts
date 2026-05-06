import assert from "node:assert/strict";
import test from "node:test";
import { createLocalD1 } from "./helpers/d1-local";

test("applies the D1 migration and creates core business tables", { timeout: 60_000 }, () => {
  const db = createLocalD1();

  try {
    const rows = db.queryRows(
      "select name from sqlite_master where type = 'table' order by name"
    );
    const tables = new Set(rows.map((row) => String(row.name)));

    for (const table of [
      "account",
      "credit_logs",
      "orders",
      "number_base_meanings",
      "post_tags",
      "posts",
      "pricing_plan_groups",
      "pricing_plans",
      "session",
      "subscriptions",
      "tags",
      "usage",
      "user",
      "user_source",
      "verification",
    ]) {
      assert.ok(tables.has(table), `missing table ${table}`);
    }
  } finally {
    db.cleanup();
  }
});

test("keeps D1 indexes and defaults needed by migrated queries", { timeout: 60_000 }, () => {
  const db = createLocalD1();

  try {
    const indexRows = db.queryRows(
      "select name from sqlite_master where type = 'index' order by name"
    );
    const indexes = new Set(indexRows.map((row) => String(row.name)));

    for (const indexName of [
      "idx_orders_provider_provider_order_id_unique",
      "idx_post_tags_post_id",
      "idx_posts_language_post_type_status",
      "posts_language_slug_post_type_unique",
      "tags_name_post_type_unique",
      "usage_user_id_unique",
      "user_email_unique",
    ]) {
      assert.ok(indexes.has(indexName), `missing index ${indexName}`);
    }

    const usageTableRows = db.queryRows(
      "select sql from sqlite_master where type = 'table' and name = 'usage'"
    );
    assert.match(String(usageTableRows[0]?.sql), /balance_jsonb.*DEFAULT '\{\}'/);
  } finally {
    db.cleanup();
  }
});
