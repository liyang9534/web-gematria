# Repository Guidelines

## Project Structure & Module Organization

This pnpm-managed Next.js 16 / React 19 SaaS app targets Cloudflare Workers through OpenNext. Route handlers and pages live in `app/`, including localized routes under `app/[locale]/`. Shared UI lives in `components/`, with shadcn-style primitives in `components/ui/`. Server actions are in `actions/`; reusable business logic, integrations, auth, logging, database access, and AI adapters are in `lib/`. Locale messages are stored in `i18n/messages/{en,zh,ja}/`. Static assets belong in `public/`; MDX blog content is in `blogs/` and `content/`. Tests live in `tests/`. Drizzle schema is in `lib/db/schema.ts`; current Cloudflare D1 migrations are in `lib/db/migrations-d1/`, while `lib/db/migrations/` is legacy Postgres history. When you need to reference historical feature implementations, look for the relevant docs in `doc/` first.

## Build, Test, and Development Commands

- `corepack pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `corepack pnpm dev`: run local Next.js dev server with local Wrangler D1 by default.
- `corepack pnpm dev:remote-db`: run dev against remote Cloudflare D1; use carefully because it reads/writes remote data.
- `corepack pnpm build`: generate angel-number data, then run `next build`.
- `corepack pnpm cf:build`: build for Cloudflare Workers via OpenNext.
- `corepack pnpm test`: run unit, database config, and serialized D1 tests.
- `corepack pnpm test:verify`: run tests, typecheck, and build.
- `corepack pnpm db:migrate:local` and `corepack pnpm db:seed:local`: prepare local D1 data.

## Coding Style & Naming Conventions

Use TypeScript with strict mode and the `@/*` path alias. Follow nearby file style: 2-space indentation, React components in PascalCase, hooks as `useX`, server actions grouped by domain, and test files named `*.test.ts`. Prefer shadcn/Radix components and `lucide-react` icons before adding new UI primitives. For UI decisions, reference `DESIGN.md` before changing visuals. Run `corepack pnpm lint` for linting.

## Testing Guidelines

Tests use Node’s built-in `node:test` runner with `node:assert/strict`. Add focused coverage in `tests/` for changed business logic, route behavior, and database rules. D1 tests should use `tests/helpers/d1-local.ts` and match the existing `d1-*.test.ts` pattern so `test:d1` includes them.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit prefixes: `feat:`, `fix:`, `chore:`, `docs:`, with optional scopes such as `fix(db):`. Keep commits focused. PRs should include a concise summary, test results, linked issue or context, screenshots for UI changes, and explicit notes for migrations, environment variables, Cloudflare bindings, or remote-data impact.

## Security & Configuration Tips

Start from `.env.example`; never commit secrets or real Cloudflare, Stripe, Resend, Sentry, or AI provider tokens. Keep `wrangler.jsonc` binding names stable (`DB`, `NEXT_TAG_CACHE_D1`, `NEXT_INC_CACHE_R2_BUCKET`). Do not apply legacy Postgres migrations directly to D1.
