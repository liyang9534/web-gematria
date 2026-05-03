CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `credit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`amount` integer NOT NULL,
	`one_time_credits_snapshot` integer NOT NULL,
	`subscription_credits_snapshot` integer NOT NULL,
	`type` text NOT NULL,
	`notes` text,
	`related_order_id` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_credit_logs_user_id` ON `credit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_credit_logs_type` ON `credit_logs` (`type`);--> statement-breakpoint
CREATE INDEX `idx_credit_logs_related_order_id` ON `credit_logs` (`related_order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_order_id` text NOT NULL,
	`order_type` text NOT NULL,
	`status` text NOT NULL,
	`stripe_payment_intent_id` text,
	`stripe_invoice_id` text,
	`stripe_charge_id` text,
	`subscription_id` text,
	`plan_id` text,
	`product_id` text,
	`price_id` text(255),
	`amount_subtotal` numeric,
	`amount_discount` numeric DEFAULT '0',
	`amount_tax` numeric DEFAULT '0',
	`amount_total` numeric NOT NULL,
	`currency` text(10) NOT NULL,
	`metadata` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plan_id`) REFERENCES `pricing_plans`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_orders_user_id` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_provider` ON `orders` (`provider`);--> statement-breakpoint
CREATE INDEX `idx_orders_plan_id` ON `orders` (`plan_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_orders_provider_provider_order_id_unique` ON `orders` (`provider`,`provider_order_id`);--> statement-breakpoint
CREATE TABLE `post_tags` (
	`post_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`post_id`, `tag_id`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_post_tags_post_id` ON `post_tags` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_post_tags_tag_id` ON `post_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`language` text(10) NOT NULL,
	`post_type` text DEFAULT 'blog',
	`author_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text,
	`description` text,
	`featured_image_url` text,
	`is_pinned` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`visibility` text DEFAULT 'public' NOT NULL,
	`published_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_posts_author_id` ON `posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `idx_posts_post_type` ON `posts` (`post_type`);--> statement-breakpoint
CREATE INDEX `idx_posts_status` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `idx_posts_visibility` ON `posts` (`visibility`);--> statement-breakpoint
CREATE INDEX `idx_posts_language_status` ON `posts` (`language`,`status`);--> statement-breakpoint
CREATE INDEX `idx_posts_language_post_type_status` ON `posts` (`language`,`post_type`,`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `posts_language_slug_post_type_unique` ON `posts` (`language`,`slug`,`post_type`);--> statement-breakpoint
CREATE TABLE `pricing_plan_groups` (
	`slug` text(100) PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pricing_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`environment` text NOT NULL,
	`group_slug` text(100) DEFAULT 'default' NOT NULL,
	`card_title` text NOT NULL,
	`card_description` text,
	`provider` text DEFAULT 'none',
	`stripe_price_id` text(255),
	`stripe_product_id` text(255),
	`stripe_coupon_id` text(255),
	`creem_product_id` text(255),
	`creem_discount_code` text(255),
	`enable_manual_input_coupon` integer DEFAULT false NOT NULL,
	`payment_type` text,
	`recurring_interval` text,
	`trial_period_days` integer,
	`price` numeric,
	`currency` text(10),
	`display_price` text(50),
	`original_price` text(50),
	`price_suffix` text(100),
	`features` text DEFAULT '[]' NOT NULL,
	`is_highlighted` integer DEFAULT false NOT NULL,
	`highlight_text` text,
	`button_text` text,
	`button_link` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`lang_jsonb` text DEFAULT '{}' NOT NULL,
	`benefits_jsonb` text DEFAULT '{}',
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`group_slug`) REFERENCES `pricing_plan_groups`(`slug`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan_id` text NOT NULL,
	`provider` text NOT NULL,
	`subscription_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`product_id` text,
	`price_id` text,
	`status` text NOT NULL,
	`current_period_start` integer,
	`current_period_end` integer,
	`cancel_at_period_end` integer DEFAULT false NOT NULL,
	`canceled_at` integer,
	`ended_at` integer,
	`trial_start` integer,
	`trial_end` integer,
	`metadata` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plan_id`) REFERENCES `pricing_plans`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_subscription_id_unique` ON `subscriptions` (`subscription_id`);--> statement-breakpoint
CREATE INDEX `idx_subscriptions_user_id` ON `subscriptions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_subscriptions_subscription_id` ON `subscriptions` (`subscription_id`);--> statement-breakpoint
CREATE INDEX `idx_subscriptions_status` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `idx_subscriptions_plan_id` ON `subscriptions` (`plan_id`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`post_type` text DEFAULT 'blog',
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_tags_name` ON `tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_post_type_unique` ON `tags` (`name`,`post_type`);--> statement-breakpoint
CREATE TABLE `usage` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`subscription_credits_balance` integer DEFAULT 0 NOT NULL,
	`one_time_credits_balance` integer DEFAULT 0 NOT NULL,
	`balance_jsonb` text DEFAULT '{}' NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usage_user_id_unique` ON `usage` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`name` text,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`is_anonymous` integer DEFAULT false NOT NULL,
	`referral` text,
	`stripe_customer_id` text,
	`banned` integer,
	`ban_reason` text,
	`ban_expires` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_stripe_customer_id_unique` ON `user` (`stripe_customer_id`);--> statement-breakpoint
CREATE TABLE `user_source` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`aff_code` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`utm_term` text,
	`utm_content` text,
	`referrer` text,
	`referrer_domain` text,
	`landing_page` text,
	`user_agent` text,
	`browser` text,
	`browser_version` text,
	`os` text,
	`os_version` text,
	`device_type` text,
	`device_brand` text,
	`device_model` text,
	`screen_width` integer,
	`screen_height` integer,
	`language` text,
	`timezone` text,
	`ip_address` text,
	`country_code` text(2),
	`metadata` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_user_source_user_id` ON `user_source` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_user_source_aff_code` ON `user_source` (`aff_code`);--> statement-breakpoint
CREATE INDEX `idx_user_source_utm_source` ON `user_source` (`utm_source`);--> statement-breakpoint
CREATE INDEX `idx_user_source_country_code` ON `user_source` (`country_code`);--> statement-breakpoint
CREATE INDEX `idx_user_source_created_at` ON `user_source` (`created_at`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
