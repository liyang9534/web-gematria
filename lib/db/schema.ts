import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  numeric,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core'

const uuid = (name: string) =>
  text(name)
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())

const timestamp = (name: string) => integer(name, { mode: 'timestamp_ms' })
const boolean = (name: string) => integer(name, { mode: 'boolean' })
const json = <T>(name: string) => text(name, { mode: 'json' }).$type<T>()

export const userRoleEnum = ['user', 'admin'] as const

export const user = sqliteTable('user', {
  id: uuid('id'),
  email: text('email').unique().notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(), // better-auth
  name: text("name"), // better-auth
  image: text("image"), // better-auth
  role: text('role', { enum: userRoleEnum }).default('user').notNull(),
  isAnonymous: boolean('is_anonymous').default(false).notNull(),
  referral: text('referral'),
  stripeCustomerId: text("stripe_customer_id").unique(),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const session = sqliteTable("session", {
  id: uuid('id'),
  expiresAt: timestamp('expires_at').notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: uuid('id'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = sqliteTable("verification", {
  id: uuid('id'),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// User source/attribution tracking
export const userSource = sqliteTable(
  'user_source',
  {
    id: uuid('id'),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),

    // aff code (from URL params like ref, via, aff.)
    affCode: text('aff_code'),

    // Traffic Source (UTM parameters)
    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
    utmTerm: text('utm_term'),
    utmContent: text('utm_content'),
    referrer: text('referrer'),
    referrerDomain: text('referrer_domain'),
    landingPage: text('landing_page'),

    // Device & Browser
    userAgent: text('user_agent'),
    browser: text('browser'),
    browserVersion: text('browser_version'),
    os: text('os'),
    osVersion: text('os_version'),
    deviceType: text('device_type'), // mobile, desktop, tablet
    deviceBrand: text('device_brand'),
    deviceModel: text('device_model'),
    screenWidth: integer('screen_width'),
    screenHeight: integer('screen_height'),
    language: text('language'),
    timezone: text('timezone'),

    // Network & Location (from Cloudflare headers)
    ipAddress: text('ip_address'),
    countryCode: text('country_code', { length: 2 }),

    // Extensibility
    metadata: json<Record<string, unknown>>('metadata'),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_user_source_user_id').on(table.userId),
    affCodeIdx: index('idx_user_source_aff_code').on(table.affCode),
    utmSourceIdx: index('idx_user_source_utm_source').on(table.utmSource),
    countryCodeIdx: index('idx_user_source_country_code').on(table.countryCode),
    createdAtIdx: index('idx_user_source_created_at').on(table.createdAt),
  })
)

export const pricingPlanEnvironmentEnum = [
  'test',
  'live',
] as const

export const providerEnum = [
  'none', // no payment feature
  'stripe',
  'creem',
] as const
export type PaymentProvider = (typeof providerEnum)[number]

export const paymentTypeEnum = [
  'one_time', // stripe
  'onetime', // creem
  'recurring', // stripe and creem
] as const
export type PaymentType = (typeof paymentTypeEnum)[number]

export const recurringIntervalEnum = [
  'month', // stripe
  'year', // stripe
  'every-month', // creem recurring
  'every-year', // creem recurring
  'once', // creem onetime
] as const
export type RecurringInterval = (typeof recurringIntervalEnum)[number]

// Pricing plan groups for organizing plans
// Using slug as primary key for simplicity and easier querying
export const pricingPlanGroups = sqliteTable('pricing_plan_groups', {
  slug: text('slug', { length: 100 }).primaryKey(),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
})

export const pricingPlans = sqliteTable('pricing_plans', {
  id: uuid('id'),
  environment: text('environment', { enum: pricingPlanEnvironmentEnum }).notNull(),
  groupSlug: text('group_slug', { length: 100 })
    .references(() => pricingPlanGroups.slug, { onDelete: 'restrict' })
    .default('default')
    .notNull(),
  cardTitle: text('card_title').notNull(),
  cardDescription: text('card_description'),
  provider: text('provider', { enum: providerEnum }).default('none'),
  stripePriceId: text('stripe_price_id', { length: 255 }),
  stripeProductId: text('stripe_product_id', { length: 255 }),
  stripeCouponId: text('stripe_coupon_id', { length: 255 }),
  creemProductId: text('creem_product_id', { length: 255 }),
  creemDiscountCode: text('creem_discount_code', { length: 255 }),
  enableManualInputCoupon: boolean('enable_manual_input_coupon')
    .default(false)
    .notNull(),
  // paymentType: varchar('payment_type', { length: 50 }),
  paymentType: text('payment_type', { enum: paymentTypeEnum }),
  // recurringInterval: varchar('recurring_interval', { length: 50 }),
  recurringInterval: text('recurring_interval', { enum: recurringIntervalEnum }),
  trialPeriodDays: integer('trial_period_days'),
  price: numeric('price'),
  currency: text('currency', { length: 10 }),
  displayPrice: text('display_price', { length: 50 }),
  originalPrice: text('original_price', { length: 50 }),
  priceSuffix: text('price_suffix', { length: 100 }),
  features: json<unknown[]>('features').default(sql`'[]'`).notNull(),
  isHighlighted: boolean('is_highlighted').default(false).notNull(),
  highlightText: text('highlight_text'),
  buttonText: text('button_text'),
  buttonLink: text('button_link'),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  langJsonb: json<Record<string, unknown>>('lang_jsonb').default(sql`'{}'`).notNull(),
  benefitsJsonb: json<Record<string, unknown>>('benefits_jsonb').default(sql`'{}'`),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const orders = sqliteTable(
  'orders',
  {
    id: uuid('id'),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    provider: text('provider').notNull(),
    providerOrderId: text('provider_order_id').notNull(),
    orderType: text('order_type').notNull(),
    status: text('status').notNull(),
    stripePaymentIntentId: text('stripe_payment_intent_id'),
    stripeInvoiceId: text('stripe_invoice_id'),
    stripeChargeId: text('stripe_charge_id'),
    subscriptionId: text('subscription_id'),
    planId: text('plan_id').references(() => pricingPlans.id, {
      onDelete: 'set null',
    }),
    productId: text('product_id'),
    priceId: text('price_id', { length: 255 }),
    amountSubtotal: numeric('amount_subtotal'),
    amountDiscount: numeric('amount_discount').default('0'),
    amountTax: numeric('amount_tax').default('0'),
    amountTotal: numeric('amount_total').notNull(),
    currency: text('currency', { length: 10 }).notNull(),
    metadata: json<Record<string, unknown>>('metadata'),
    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdx: index('idx_orders_user_id').on(table.userId),
      providerIdx: index('idx_orders_provider').on(table.provider),
      planIdIdx: index('idx_orders_plan_id').on(table.planId),
      providerProviderOrderIdUnique: unique(
        'idx_orders_provider_provider_order_id_unique'
      ).on(table.provider, table.providerOrderId),
    }
  }
)

export const subscriptions = sqliteTable(
  'subscriptions',
  {
    id: uuid('id'),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    planId: text('plan_id')
      .references(() => pricingPlans.id, { onDelete: 'restrict' })
      .notNull(),
    provider: text('provider', { enum: providerEnum }).notNull(),
    subscriptionId: text('subscription_id').notNull().unique(),
    customerId: text('customer_id').notNull(),
    productId: text('product_id'),
    priceId: text('price_id'),
    status: text('status').notNull(),
    currentPeriodStart: timestamp('current_period_start'),
    currentPeriodEnd: timestamp('current_period_end'),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
    canceledAt: timestamp('canceled_at'),
    endedAt: timestamp('ended_at'),
    trialStart: timestamp('trial_start'),
    trialEnd: timestamp('trial_end'),
    metadata: json<Record<string, unknown>>('metadata'),
    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdx: index('idx_subscriptions_user_id').on(table.userId),
      subscriptionIdIdx: index('idx_subscriptions_subscription_id').on(table.subscriptionId),
      statusIdx: index('idx_subscriptions_status').on(table.status),
      planIdIdx: index('idx_subscriptions_plan_id').on(table.planId),
    }
  }
)

export const usage = sqliteTable('usage', {
  id: uuid('id'),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  subscriptionCreditsBalance: integer('subscription_credits_balance')
    .default(0)
    .notNull(),
  oneTimeCreditsBalance: integer('one_time_credits_balance')
    .default(0)
    .notNull(),
  balanceJsonb: json<Record<string, unknown>>('balance_jsonb').default(sql`'{}'`).notNull(),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const creditLogs = sqliteTable(
  'credit_logs',
  {
    id: uuid('id'),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    amount: integer('amount').notNull(),
    oneTimeCreditsSnapshot: integer('one_time_credits_snapshot').notNull(),
    subscriptionCreditsSnapshot: integer('subscription_credits_snapshot').notNull(),
    type: text('type').notNull(),
    notes: text('notes'),
    relatedOrderId: text('related_order_id').references(() => orders.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdx: index('idx_credit_logs_user_id').on(table.userId),
      typeIdx: index('idx_credit_logs_type').on(table.type),
      relatedOrderIdIdx: index('idx_credit_logs_related_order_id').on(
        table.relatedOrderId
      ),
    }
  }
)

export const postTypeEnum = [
  'blog',
  'glossary',
] as const
export type PostType = (typeof postTypeEnum)[number]

export const postStatusEnum = [
  'draft',
  'published',
  'archived',
] as const
export type PostStatus = (typeof postStatusEnum)[number]

export const postVisibilityEnum = [
  'public',
  'logged_in',
  'subscribers',
] as const

export const posts = sqliteTable(
  'posts',
  {
    id: uuid('id'),
    language: text('language', { length: 10 }).notNull(),
    postType: text('post_type', { enum: postTypeEnum }).default('blog'),
    authorId: text('author_id')
      .references(() => user.id, { onDelete: 'set null' })
      .notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    content: text('content'),
    description: text('description'),
    featuredImageUrl: text('featured_image_url'),
    isPinned: boolean('is_pinned').default(false).notNull(),
    status: text('status', { enum: postStatusEnum }).default('draft').notNull(),
    visibility: text('visibility', { enum: postVisibilityEnum }).default('public').notNull(),
    publishedAt: timestamp('published_at')
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      languageSlugPostTypeUnique: unique('posts_language_slug_post_type_unique').on(
        table.language,
        table.slug,
        table.postType
      ),
      authorIdIdx: index('idx_posts_author_id').on(table.authorId),
      postTypeIdx: index('idx_posts_post_type').on(table.postType),
      statusIdx: index('idx_posts_status').on(table.status),
      visibilityIdx: index('idx_posts_visibility').on(table.visibility),
      languageStatusIdx: index('idx_posts_language_status').on(
        table.language,
        table.status
      ),
      languagePostTypeStatusIdx: index('idx_posts_language_post_type_status').on(
        table.language,
        table.postType,
        table.status
      ),
    }
  }
)

export const tags = sqliteTable(
  'tags',
  {
    id: uuid('id'),
    name: text('name').notNull(),
    postType: text('post_type', { enum: postTypeEnum }).default('blog'),
    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_tags_name').on(table.name),
      namePostTypeUnique: unique('tags_name_post_type_unique').on(
        table.name,
        table.postType
      ),
    }
  }
)

export const postTags = sqliteTable(
  'post_tags',
  {
    postId: text('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    tagId: text('tag_id')
      .references(() => tags.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.postId, table.tagId] }),
      postIdIdx: index('idx_post_tags_post_id').on(table.postId),
      tagIdIdx: index('idx_post_tags_tag_id').on(table.tagId),
    }
  }
)
