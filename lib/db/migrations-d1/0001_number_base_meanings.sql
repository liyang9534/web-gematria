CREATE TABLE IF NOT EXISTS `number_base_meanings` (
  `number` text(20) PRIMARY KEY NOT NULL,
  `keywords` text DEFAULT '[]' NOT NULL,
  `numerology_desc` text NOT NULL,
  `angel_desc` text NOT NULL,
  `created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
  `updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
