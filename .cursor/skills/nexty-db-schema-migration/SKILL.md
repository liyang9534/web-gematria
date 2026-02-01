---
name: Database Schema Isolation and Migration
description: Automates database schema migration from one PostgreSQL database to another using PostgreSQL Schema isolation mechanism. Supports migration from Neon to Supabase or between any PostgreSQL databases.
---

# Database Schema Isolation and Migration Skill

This skill automates the process of migrating a Next.js + Drizzle ORM project to use PostgreSQL Schema isolation, allowing multiple products to share a single Supabase database instance.

## Pre-execution Checklist

Before running this skill, you MUST:

1. **Ask the user for the new schema name**:
   - Prompt: "What should the new schema be named? (Suggested: use your product name, e.g., 'dofollow', 'bitlap')"
   - Store this value for use throughout the migration

2. **Verify environment variables**:
   - Ask: "Please confirm you have configured the following environment variables in your .env file:
     - `OLD_DB_URL`: Old database connection string
     - `NEW_DB_URL`: New database connection string
     
     Have you configured these? (y/n)"
   - If user confirms 'n', stop and provide setup instructions
   - If user confirms 'y', proceed

3. **Confirm backup**:
   - Ask: "Have you backed up your database? This is strongly recommended before migration. (y/n)"
   - If 'n', warn user and ask if they want to proceed anyway

## Automation Steps

Once pre-checks are completed, perform the following operations automatically:

### Step 1: Modify Drizzle Configuration

1. Locate `drizzle.config.ts` file
2. Add `schemaFilter` configuration with the user-provided schema name
3. Update the `out` path to `./lib/db/migrations`
4. Example modification:
   ```typescript
   export default defineConfig({
     // ... other configs
     out: './lib/db/migrations',
     schemaFilter: ['{{SCHEMA_NAME}}'], // Use the schema name from user input
   });
   ```

### Step 2: Update Schema Definitions

1. Locate `lib/db/schema.ts` (or equivalent schema file)
2. Add schema import and definition at the top of the file:
   ```typescript
   import { pgSchema } from 'drizzle-orm/pg-core';
   
   export const {{SCHEMA_VAR_NAME}} = pgSchema('{{SCHEMA_NAME}}');
   ```
   - `{{SCHEMA_VAR_NAME}}` should be camelCase version of schema name (e.g., 'dofollow' -> 'dofollowSchema')
   - `{{SCHEMA_NAME}}` is the exact schema name from user input

3. Replace all `pgTable(...)` calls with `{{SCHEMA_VAR_NAME}}.table(...)`
4. Replace all `pgEnum(...)` calls with `{{SCHEMA_VAR_NAME}}.enum(...)`
5. Keep all other table/column definitions unchanged

### Step 3: Reset Migration Files

1. **Delete old migration files**:
   - Remove all contents from `lib/db/migrations/` directory
   - Keep the `lib/db/migrations/` directory itself

2. **Do NOT run generation commands yet** - this will be user's responsibility

### Step 4: Update Package.json

1. Locate `package.json` file
2. Ensure the following scripts exist (add/update if needed):
   ```json
   {
     "scripts": {
       "db:generate": "drizzle-kit generate",
       "db:migrate": "drizzle-kit migrate",
       "db:migrate-data": "tsx scripts/migrate-to-schema.ts"
     }
   }
   ```

### Step 5: Generate Migration Script

1. Create a new migration script at `scripts/migrate-to-schema.ts`
2. Use the reference script structure from existing migration scripts
3. Customize for the user's schema:
   - Read all tables from `lib/db/schema.ts`
   - Determine table dependency order (tables without foreign keys first)
   - Use `OLD_DB_URL` and `NEW_DB_URL` environment variables
   - Include table truncation with correct schema name
   - Include column mapping logic for snake_case to camelCase conversion
   - Include batch insert with conflict handling

4. Key script features:
   - Clear logging for each step
   - Error handling with helpful messages
   - Automatic schema name injection in TRUNCATE commands
   - Column name mapping from database to Drizzle schema
   - Batch processing for efficient data transfer

## Post-Execution Instructions

After automation completes, provide the user with the following checklist:

```
✅ Migration preparation complete! Follow these steps in order:

1. **Review File Changes**
   Carefully review the modified files:
   - drizzle.config.ts
   - lib/db/schema.ts
   - package.json
   - scripts/migrate-to-schema.ts
   
2. **Generate New Migration Files**
   Run the following command to generate the new schema structure:
   ```bash
   pnpm db:generate
   ```

3. **Apply Database Structure**
   Push the new schema to your new database:
   ```bash
   pnpm db:migrate
   ```

4. **Execute Data Migration**
   Run the migration script to copy data from old to new database:
   ```bash
   pnpm db:migrate-data
   ```

5. **Verify Data**
   Log into your new database and confirm:
   - Schema {{SCHEMA_NAME}} has been created
   - All tables are correctly created
   - Data has been fully migrated

6. **Update Production Environment**
   - Update the DATABASE_URL environment variable in your production environment (Vercel/Railway/etc.) to point to the new database
   - Redeploy your application

7. **Test Application**
   - Test all features locally
   - Verify production environment

⚠️ Important Notes:
- The migration script will TRUNCATE target tables before inserting data
- Test in development/staging first before updating production
- Keep the old database available until you confirm the new environment is stable
```

## Error Handling

Throughout the automation process, handle these common errors:

1. **Missing schema file**: If `lib/db/schema.ts` doesn't exist, look for alternative paths:
   - `src/lib/db/schema.ts`
   - `db/schema.ts`
   - `src/db/schema.ts`
   
2. **Missing drizzle config**: If `drizzle.config.ts` doesn't exist, create it with minimal config

3. **Complex schema structure**: If schema file uses non-standard patterns, warn user and request manual review

4. **Table dependency detection**: For complex foreign key relationships, generate tables in alphabetical order and warn user to review order in migration script

5. **Missing package.json**: If `package.json` doesn't exist, skip script modification and warn user

## Files to Modify

- `drizzle.config.ts` - Add schemaFilter and update migration output path
- `lib/db/schema.ts` - Convert to schema-based tables
- `package.json` - Add/update migration scripts
- Delete: `lib/db/migrations/*` - Remove old migrations
- Create: `scripts/migrate-to-schema.ts` - New migration script

## Files to Preserve

- `.env` - Environment variables (DO NOT MODIFY)
- `lib/db/index.ts` or similar database connection files
- Any existing database query/service files

## Success Criteria

The automation is successful when:
1. All schema table definitions are converted to use the custom schema
2. Drizzle config includes schemaFilter and correct output path
3. Package.json includes necessary migration scripts
4. Old migration files are removed
5. New migration script is created and functional
6. User is provided with clear next steps

## Notes

- This skill is designed for Next.js projects using Drizzle ORM
- Supports migration from Neon, Supabase, or any PostgreSQL database
- The skill performs code modifications but does NOT execute database operations
- Database operations (generate, migrate, data migration) remain user's responsibility for safety
- Migration files are stored in `lib/db/migrations/` per this template's convention
