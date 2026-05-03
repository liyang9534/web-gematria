import assert from "node:assert/strict";
import test from "node:test";
import { createLocalD1 } from "./helpers/d1-local";

test("supports core business writes and D1-compatible reads", { timeout: 60_000 }, () => {
  const db = createLocalD1();

  try {
    db.execute(`
      insert into "user" (id, email, email_verified, name, role, is_anonymous)
      values ('user_d1', 'd1-user@example.com', 1, 'D1 User', 'user', 0)
    `);

    db.execute(`
      insert into pricing_plan_groups (slug)
      values ('default')
    `);

    db.execute(`
      insert into pricing_plans (
        id,
        environment,
        group_slug,
        card_title,
        provider,
        payment_type,
        recurring_interval,
        price,
        currency,
        benefits_jsonb
      )
      values (
        'plan_monthly',
        'test',
        'default',
        'Pro Monthly',
        'stripe',
        'recurring',
        'month',
        '1900',
        'usd',
        '{"monthlyCredits":100}'
      )
    `);

    db.execute(`
      insert into orders (
        id,
        user_id,
        provider,
        provider_order_id,
        order_type,
        status,
        plan_id,
        amount_total,
        currency
      )
      values (
        'order_1',
        'user_d1',
        'stripe',
        'pi_d1_1',
        'subscription',
        'paid',
        'plan_monthly',
        '1900',
        'usd'
      )
    `);

    db.execute(`
      insert into usage (
        id,
        user_id,
        subscription_credits_balance,
        one_time_credits_balance,
        balance_jsonb
      )
      values ('usage_1', 'user_d1', 0, 25, '{}')
    `);

    db.execute(`
      update usage
      set
        subscription_credits_balance = 100,
        balance_jsonb = json_patch(
          coalesce(balance_jsonb, '{}'),
          '{"monthlyAllocationDetails":{"monthlyCredits":100,"relatedOrderId":"order_1"}}'
        )
      where user_id = 'user_d1'
    `);

    const usageRows = db.queryRows(`
      select
        subscription_credits_balance as subscriptionCreditsBalance,
        one_time_credits_balance as oneTimeCreditsBalance,
        json_extract(balance_jsonb, '$.monthlyAllocationDetails.monthlyCredits') as monthlyCredits,
        json_extract(balance_jsonb, '$.monthlyAllocationDetails.relatedOrderId') as relatedOrderId
      from usage
      where user_id = 'user_d1'
    `);

    assert.equal(usageRows.length, 1);
    assert.equal(usageRows[0]?.subscriptionCreditsBalance, 100);
    assert.equal(usageRows[0]?.oneTimeCreditsBalance, 25);
    assert.equal(usageRows[0]?.monthlyCredits, 100);
    assert.equal(usageRows[0]?.relatedOrderId, "order_1");

    db.execute(`
      insert into posts (
        id,
        language,
        post_type,
        author_id,
        title,
        slug,
        status,
        visibility
      )
      values (
        'post_1',
        'en',
        'blog',
        'user_d1',
        'Cloudflare D1 launch',
        'cloudflare-d1-launch',
        'published',
        'public'
      )
    `);

    db.execute(`
      insert into tags (id, name, post_type)
      values ('tag_1', 'Cloudflare', 'blog')
    `);

    db.execute(`
      insert into post_tags (post_id, tag_id)
      values ('post_1', 'tag_1')
    `);

    const postRows = db.queryRows(`
      select p.slug
      from posts p
      where
        p.language = 'en'
        and p.post_type = 'blog'
        and p.status = 'published'
        and exists (
          select 1
          from post_tags pt
          join tags t on t.id = pt.tag_id
          where
            pt.post_id = p.id
            and t.post_type = p.post_type
            and lower(t.name) = lower('cloudflare')
        )
    `);

    assert.deepEqual(
      postRows.map((row) => row.slug),
      ["cloudflare-d1-launch"]
    );

    const duplicateEmail = db.tryExecute(`
      insert into "user" (id, email)
      values ('user_duplicate', 'd1-user@example.com')
    `);

    assert.notEqual(duplicateEmail.status, 0);
    assert.match(duplicateEmail.stdout, /UNIQUE constraint failed: user.email/);
  } finally {
    db.cleanup();
  }
});
