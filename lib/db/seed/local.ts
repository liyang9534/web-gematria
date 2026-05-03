/**
 * Seed pricing data into Wrangler's local D1 database.
 *
 * Usage:
 * pnpm db:migrate:local
 * pnpm db:seed:local
 */

import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pricingGroups, pricingPlans } from './pricing-config'

type SqlValue = string | number | boolean | null | undefined | unknown[] | Record<string, unknown>

const projectRoot = process.cwd()
const wranglerBin = resolve(
  projectRoot,
  'node_modules/.bin',
  process.platform === 'win32' ? 'wrangler.cmd' : 'wrangler'
)

function sqlLiteral(value: SqlValue) {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean') return value ? '1' : '0'
  if (typeof value === 'number') return String(value)

  const text =
    typeof value === 'string' ? value : JSON.stringify(value)

  return `'${text.replace(/'/g, "''")}'`
}

function buildPricingPlanStatement(plan: (typeof pricingPlans)[number]) {
  const row = {
    id: plan.id,
    environment: plan.environment,
    group_slug: plan.groupSlug ?? 'default',
    card_title: plan.cardTitle,
    card_description: plan.cardDescription,
    provider: plan.provider ?? 'none',
    stripe_price_id: plan.stripePriceId,
    stripe_product_id: plan.stripeProductId,
    stripe_coupon_id: plan.stripeCouponId,
    creem_product_id: plan.creemProductId,
    creem_discount_code: plan.creemDiscountCode,
    enable_manual_input_coupon: plan.enableManualInputCoupon ?? false,
    payment_type: plan.paymentType,
    recurring_interval: plan.recurringInterval,
    trial_period_days: plan.trialPeriodDays,
    price: plan.price,
    currency: plan.currency,
    display_price: plan.displayPrice,
    original_price: plan.originalPrice,
    price_suffix: plan.priceSuffix,
    features: plan.features ?? [],
    is_highlighted: plan.isHighlighted ?? false,
    highlight_text: plan.highlightText,
    button_text: plan.buttonText,
    button_link: plan.buttonLink,
    display_order: plan.displayOrder ?? 0,
    is_active: plan.isActive ?? true,
    lang_jsonb: plan.langJsonb ?? {},
    benefits_jsonb: plan.benefitsJsonb ?? {},
  }

  const columns = Object.keys(row)
  const values = Object.values(row).map(sqlLiteral)
  const updates = columns
    .filter((column) => column !== 'id')
    .map((column) => `${column}=excluded.${column}`)

  return [
    `insert into pricing_plans (${columns.join(', ')})`,
    `values (${values.join(', ')})`,
    `on conflict(id) do update set ${updates.join(', ')};`,
  ].join('\n')
}

function buildSql() {
  const statements = [
    ...pricingGroups.map(
      (group) =>
        `insert into pricing_plan_groups (slug) values (${sqlLiteral(group.slug)}) on conflict(slug) do nothing;`
    ),
    ...pricingPlans.map(buildPricingPlanStatement),
  ]

  return statements.join('\n\n')
}

function main() {
  const tempDir = mkdtempSync(join(tmpdir(), 'nexty-local-d1-seed-'))
  const sqlFile = join(tempDir, 'seed.sql')

  try {
    writeFileSync(sqlFile, buildSql())

    const result = spawnSync(
      wranglerBin,
      ['d1', 'execute', 'DB', '--local', '--file', sqlFile],
      {
        cwd: projectRoot,
        encoding: 'utf8',
        env: {
          ...process.env,
          CI: 'true',
          WRANGLER_SEND_METRICS: 'false',
        },
      }
    )

    if (result.status !== 0) {
      console.error(result.stdout)
      console.error(result.stderr)
      process.exit(result.status ?? 1)
    }

    console.log(result.stdout)
    console.log(
      `Seeded local D1 with ${pricingGroups.length} pricing groups and ${pricingPlans.length} pricing plans.`
    )
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
}

main()
