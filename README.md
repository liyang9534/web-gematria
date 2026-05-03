# Nexty - Modern Full-Stack SaaS Boilerplate

Nexty is a feature-rich, full-stack SaaS application boilerplate built with Next.js 16, React 19, and Cloudflare D1. It provides developers with a complete solution to quickly build and deploy SaaS applications.

- 🚀 Get the boilerplate 👉: https://nexty.dev
- 🚀 Roadmap 👉: https://nexty.dev/roadmap
- 🚀 Documentation 👉: https://nexty.dev/docs

> If you encounter any issues, please contact me for support:
> - Email: hi@nexty.dev
> - Twitter (Chinese): https://x.com/weijunext
> - Twitter (English): https://x.com/judewei_dev

## ✨ Key Features

- 🚀 **Next.js 16 & React 19** - Built on the latest tech stack
- 💳 **Stripe Integration** - Complete subscription payment system
- 🔒 **Better Auth + Cloudflare D1** - Secure and reliable user management
- 🌍 **Internationalization (i18n) Ready** - Built-in support for English, Chinese, and Japanese
- 🧠 **AI Integration** - Supports multiple AI providers (OpenAI, Anthropic, DeepSeek, Google, etc.)
- 📊 **Admin Dashboard** - User management, pricing plans, content management, etc.
- 📱 **Responsive Design** - Perfect adaptation across various devices
- 🎨 **Tailwind CSS** - Modern UI design
- 📧 **Email System** - Notifications and marketing emails powered by Resend
- 🖼️ **R2/S3 Storage** - Cloud storage support for media files

Please refer to the [Documentation](https://nexty.dev/docs) for instructions on using the boilerplate.

## Cloudflare Workers 部署流程

本项目已适配 `@opennextjs/cloudflare`，推荐部署架构是：

- **Cloudflare Workers**：运行 Next.js 应用。
- **Cloudflare D1**：业务数据库，Drizzle schema 已迁移为 SQLite/D1。
- **Cloudflare R2**：作为 OpenNext incremental cache。
- **Cloudflare D1 Tag Cache**：作为 OpenNext `revalidateTag` / `revalidatePath` 的 tag cache，和业务数据库分开。
- **Durable Objects**：作为 OpenNext revalidation queue。

旧的 `lib/db/migrations` 是 Postgres 迁移历史；D1 使用新的 `lib/db/migrations-d1`。不要把旧 Postgres SQL 直接应用到 D1。

### 1. 本地验证

安装依赖后，先确认项目可以正常类型检查、构建、启动：

```bash
corepack pnpm install
corepack pnpm test:db-config
corepack pnpm exec tsc --noEmit
corepack pnpm build
PORT=3100 corepack pnpm start
```

启动后访问：

```bash
curl -I http://127.0.0.1:3100/
```

本地 `next dev` / `next start` 没有 Cloudflare D1 binding 时，公共页面会按未登录状态渲染；登录、Dashboard、支付、CMS 等数据库功能需要 D1 binding。需要验证完整 Workers 运行时可使用 `pnpm cf:preview`。

### 2. 准备 Cloudflare 账号和 Wrangler

登录 Cloudflare：

```bash
npx wrangler login
```

如果你的 Cloudflare 账号里有多个 Account，可以在 `wrangler.jsonc` 里补充：

```jsonc
{
  "account_id": "<YOUR_ACCOUNT_ID>"
}
```

Account ID 可以在 Cloudflare Dashboard 的 Workers & Pages 概览页找到。

### 3. 配置 `wrangler.jsonc`

当前项目的 Cloudflare 配置文件是 `wrangler.jsonc`。上线前至少检查这些字段：

```jsonc
{
  "name": "nexty",
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "nexty"
    }
  ],
  "r2_buckets": [
    {
      "binding": "NEXT_INC_CACHE_R2_BUCKET",
      "bucket_name": "nexty-opennext-cache"
    }
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "nexty-business",
      "database_id": "<YOUR_BUSINESS_D1_DATABASE_ID>",
      "migrations_dir": "lib/db/migrations-d1"
    },
    {
      "binding": "NEXT_TAG_CACHE_D1",
      "database_name": "nexty-opennext-tag-cache",
      "database_id": "<YOUR_TAG_CACHE_D1_DATABASE_ID>"
    }
  ]
}
```

要求：

- `name` 是 Worker 项目名。
- `WORKER_SELF_REFERENCE.service` 必须和 `name` 完全一致。
- `DB`、`NEXT_INC_CACHE_R2_BUCKET`、`NEXT_TAG_CACHE_D1` 这些 binding 名不要改，代码和 OpenNext 配置会用到。
- 上线前不能留下 `<YOUR_BUSINESS_D1_DATABASE_ID>` 或 `<YOUR_TAG_CACHE_D1_DATABASE_ID>` 占位符。

### 4. 创建 R2 Bucket

R2 用于 OpenNext incremental cache：

```bash
npx wrangler r2 bucket create nexty-opennext-cache
```

如果你使用其他 bucket 名，把 `wrangler.jsonc` 里的 `r2_buckets[0].bucket_name` 改成实际名称。

### 5. 创建业务 D1 数据库

业务数据使用独立 D1 数据库：

```bash
npx wrangler d1 create nexty-business
```

命令会输出 `database_name` 和 `database_id`，把业务库的 `database_id` 填入 `wrangler.jsonc` 中 `binding: "DB"` 的配置，同时填入本地 `.env`：

```bash
CLOUDFLARE_ACCOUNT_ID="<YOUR_ACCOUNT_ID>"
CLOUDFLARE_D1_DATABASE_ID="<YOUR_BUSINESS_D1_DATABASE_ID>"
CLOUDFLARE_API_TOKEN="<YOUR_CLOUDFLARE_API_TOKEN>"
```

`CLOUDFLARE_API_TOKEN` 用于 `drizzle-kit` 和 `pnpm db:seed` / `pnpm db:export-pricing`，不要提交到仓库。

### 6. 创建 D1 Tag Cache

Tag cache 使用另一个 D1 数据库，不要和业务库混用：

```bash
npx wrangler d1 create nexty-opennext-tag-cache
```

命令会输出 `database_name` 和 `database_id`，把它们填入 `wrangler.jsonc` 的 `d1_databases`。

### 7. 生成并应用 D1 迁移

项目的 D1 schema 在 `lib/db/schema.ts`，迁移输出目录是 `lib/db/migrations-d1`。

生成迁移：

```bash
pnpm db:generate
```

应用到远程业务 D1：

```bash
pnpm exec wrangler d1 migrations apply DB --remote
```

本地 D1 调试可用：

```bash
pnpm exec wrangler d1 migrations apply DB --local
```

也可以用 Drizzle HTTP driver 直接应用远程迁移：

```bash
pnpm db:migrate
```

这需要 `.env` 里已配置 `CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_D1_DATABASE_ID`、`CLOUDFLARE_API_TOKEN`。

如果从 Supabase/Postgres 迁移历史数据，需要单独导出、转换再导入 D1。Postgres 的 `jsonb`、enum、timestamp、大小写搜索等语义已经在代码层改成 SQLite/D1 写法，但历史数据不会自动迁移。

### 8. 同步种子数据

初始化或同步定价配置：

```bash
pnpm db:seed
```

从 D1 导出当前定价配置到 `lib/db/seed/pricing-config.ts`：

```bash
pnpm db:export-pricing
```

这两个脚本通过 Cloudflare D1 HTTP API 访问业务库，需要本地 `.env` 中有 Cloudflare 三个变量。

### 9. 配置生产环境变量

参考 `.env.example`，在 Cloudflare Workers 的 **Settings -> Variables & Secrets** 中配置生产变量。

建议规则：

- `NEXT_PUBLIC_*`：可以作为普通变量，也需要放到 Build variables，因为 Next.js 会在构建时读取。
- 私钥、token、webhook secret：使用 Secret，不要写进 `wrangler.jsonc`。
- `DEPLOYMENT_PLATFORM=cloudflare`：已经在 `wrangler.jsonc` 的 `vars` 中配置。
- `NEXT_PUBLIC_SITE_URL`：必须改成最终域名。
- `NEXT_PUBLIC_BETTER_AUTH_URL`：建议和最终域名保持一致。
- OAuth、支付、AI、Resend、Upstash、R2 上传等功能，只配置实际启用的变量。
- D1 业务库通过 `DB` binding 注入运行时，不需要配置 `DATABASE_URL`。

可选：也可以用项目脚本批量同步运行时变量：

```bash
pnpm cf:sync-env .env.production
```

`NEXT_PUBLIC_*` 仍建议在 Cloudflare Build variables 里单独配置。

### 10. 配置 Cloudflare Workers Git 自动部署

在 Cloudflare Dashboard：

1. 进入 **Workers & Pages -> Create application -> Import a repository**。
2. 选择 GitHub/GitLab 仓库。
3. Project name 填 `wrangler.jsonc` 里的 `name`，例如 `nexty`。
4. Root directory 如果不是 monorepo 根目录，填项目所在目录；当前仓库根目录可留空。
5. Build command 填：

```bash
pnpm cf:build
```

6. Deploy command 使用默认值：

```bash
npx wrangler deploy
```

7. Preview/non-production deploy command 可使用默认值：

```bash
npx wrangler versions upload
```

8. Build cache 建议关闭，避免环境变量或生成文件缓存导致排查困难。
9. 保存后第一次构建可能会因为资源 ID 或环境变量未配置而失败，补齐配置后点击 Retry Build 或重新 push。

### 11. 绑定域名和回调地址

在 Cloudflare Workers 项目里打开 **Settings -> Domains & Routes**，绑定正式域名。

绑定域名后，同步更新：

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- Google/GitHub OAuth callback URL
- Stripe/Creem webhook URL
- Replicate/fal/KIE webhook callback URL
- Resend 发信域名和 DNS 记录
- R2 public URL，如果启用了文件公开访问

### 12. 上线检查清单

部署完成后检查：

- `wrangler.jsonc` 没有残留 `<YOUR_...>` 占位符。
- Worker 项目名和 `WORKER_SELF_REFERENCE.service` 一致。
- R2 bucket、业务 D1、Tag Cache D1 都显示已绑定。
- `pnpm exec wrangler d1 migrations apply DB --remote` 已成功执行。
- 首页、登录、Dashboard、支付回调、CMS、R2 上传按实际启用功能逐一验证。
- Cloudflare Workers 日志没有 `Business database is not configured` 或 D1 SQL 错误。
- 自定义域名访问正常，OAuth 和 webhook 回调使用的都是正式域名。

参考文档：

- [NEXTY.DEV Cloudflare Workers guide](https://nexty.dev/docs/start-project/cf-workers)
- [OpenNext Cloudflare guide](https://opennext.js.org/cloudflare/get-started)
- [OpenNext Cloudflare caching](https://opennext.js.org/cloudflare/caching)
- [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Cloudflare Variables and Secrets](https://developers.cloudflare.com/workers/configuration/environment-variables/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
