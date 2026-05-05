# Angel Number Decoder 分阶段实施方案

> 基于 `doc/产品设计方案v2.md`、`DESIGN.md` 与当前 NEXTY.DEV Cloudflare 版本代码库制定。
>
> **目标**: 先以 Angel Number 程序化 SEO 页面和免费计算器建立自然流量，再接入 AI 解读、会员与报告变现。
>
> **实施原则**: 复用现有 Next.js App Router、next-intl、shadcn/ui、Drizzle D1、Cloudflare Workers、AI SDK、Better Auth、支付与 CMS 能力；不引入 Prisma、Contentlayer、Vercel-only 能力。产品结构、信息架构、SEO 和阶段优先级以 `doc/产品设计方案v2.md` 为准；页面样式、组件语言、动效、响应式和页面文案语气以 `DESIGN.md` 为准。

---

## 0. 返工后的产品口径

本实施方案按 2026-05-04 返工要求修订，核心不再是普通 SaaS 工具页，而是 **Angel Number 流量入口 + Gematria 主工具 + Mystical Modern 视觉系统**。

**关键决策**
- Angel Number 是主入口：首页、hub、详情页都以“输入任意数字并解码”为首要路径。
- 采用混合 SEO：精选高频数字使用手写内容、允许 index、进入 sitemap；任意纯数字都可访问并即时生成解读，但默认 `noindex, follow`，不进入 sitemap。
- Calculator 信息架构以 Gematria Calculator 为主：`/calculator` 首屏给 Gematria 65-75% 视觉权重，Numerology 和 Life Path 作为辅助入口。
- 视觉方向统一为 `DESIGN.md` 的 dark observatory：Void 深空底、Vellum 金、Cloister 紫、旧纸白文字、细描边、低噪点和极淡星图；不影响 dashboard、auth、payment、CMS 后台。
- AI 解读本阶段只保留 CTA 与接入点，不做真实 provider 调用。

---

## 1. 当前项目技术栈基线

当前项目不是空白 Next.js 项目，而是已经完成 Cloudflare Workers 适配的 NEXTY.DEV SaaS 模板。产品方案中的部分技术选型需要按现状修订。

| 层级 | 当前项目实际能力 | 实施决策 |
| --- | --- | --- |
| Web 框架 | Next.js `16.2.4`、React `19.2.3`、App Router | 新页面放在 `app/[locale]/(basic-layout)/...`，遵循 Next.js 15+ async params/metadata 写法 |
| 部署 | `@opennextjs/cloudflare` + Cloudflare Workers | 不按 Vercel 方案落地；构建、缓存、预览使用 `pnpm cf:build` / `pnpm cf:preview` |
| 样式 | Tailwind CSS v4、CSS variables、shadcn/ui new-york、Radix、lucide | 复用 `components/ui/*`；业务组件新增到 `components/angel-number` 与 `components/calculator` |
| 国际化 | `next-intl`，`en/zh/ja`，默认 `en`，locale prefix `as-needed` | MVP 先以英文 SEO 页面为主，中文/日文先保留导航和基础文案，避免批量低质翻译页被索引 |
| 数据库 | Cloudflare D1 / SQLite + Drizzle，schema 在 `lib/db/schema.ts` | 静态 SEO 内容优先用 TS/JSON 构建期数据；AI 记录、报告、API key 等再进 D1 |
| 内容系统 | 本地 MDX + 现有 CMS/Posts/Glossary 管理能力 | Angel Number 结构化数据用 `data/angel-numbers` + loader；博客继续复用现有 CMS |
| 认证 | Better Auth，用户表已存在 | AI freemium、报告、API 阶段复用现有登录、dashboard 与用户体系 |
| 支付 | Stripe + Creem，pricing seed/admin 已存在 | Pro 订阅和报告单次付费优先接入现有 pricing/checkout |
| AI | AI SDK v6，多 provider registry，已有 chat/image/video demo | AI 数字解读复用 `config/ai-providers.ts`、`config/ai-models.ts` 与 `lib/ai/chat.ts` |
| 存储 | Cloudflare R2/S3 utils | PDF 报告、分享图、导出产物进入后期阶段再用 R2 |
| 可观测性 | Pino、Sentry、PostHog/Plausible 等 | AI 调用、支付、报告生成必须加结构化日志和错误上报 |

---

## 2. 产品方案到当前代码库的关键修订

1. **路由结构修订**
   - 设计稿中的 `/angel-number/[number]/` 在代码中落为 `app/[locale]/(basic-layout)/angel-number/[number]/page.tsx`。
   - 默认英文路径仍然是 `/angel-number/444`，中文/日文可自然映射到 `/zh/angel-number/444`、`/ja/angel-number/444`。

2. **内容生成修订**
   - Cloudflare Workers 运行时不应依赖运行期 `fs` 扫目录。
   - Angel Number 数据建议维护为结构化 JSON/TS 源文件，并通过脚本生成 `data/angel-numbers/generated.ts`，由页面静态 import。
   - 精选高频页面手写并允许索引；任意数字页面由 `interpretAnyNumber()` 规则引擎即时生成，默认 `noindex, follow`，不进入 sitemap。
   - 生成型页面仍需包含 pattern、root number、love/career/money/spiritual 解读、FAQ、affirmation、related numbers，但不输出 FAQPage JSON-LD。

3. **数据库修订**
   - 产品方案里的 PostgreSQL/Prisma 不适用。
   - Phase 1-3 的 SEO 内容和计算器不需要数据库。
   - Phase 5 起新增 AI 请求、报告、API key、用量统计时，统一走 `lib/db/schema.ts` 的 D1/SQLite Drizzle 表。

4. **部署修订**
   - 方案中的 Vercel Edge Cache 改为 Cloudflare Workers + OpenNext cache。
   - 每个阶段验收必须包含 `corepack pnpm build`；上线前额外跑 `corepack pnpm cf:build`。

5. **UI 修订**
   - 原产品方案要求神秘、精致、数字仪式感，不能退化为普通 dashboard card 拼接。
   - 新增 feature-level observatory 组件，在 Angel Number 与 Calculator 专区局部使用 Void 深空底、Vellum 金色数字、Cloister 紫交互、数字星图背景和细描边。
   - 页面文案按 `DESIGN.md` 的“博物馆策展人，不像占卜师”语气执行：克制、精确、保留怀疑空间，不使用 emoji、clickbait 或夸张占卜式表达。
   - 不整体替换 dashboard、auth、payment、CMS 的主题，降低对模板其他 SaaS 能力的影响。

---

## 3. 总体架构

### 3.1 模块划分

```text
app/[locale]/(basic-layout)/
  angel-number/
    page.tsx
    [number]/page.tsx
    [number]/opengraph-image.tsx
  calculator/
    page.tsx
    gematria/page.tsx
    numerology/page.tsx
    life-path/page.tsx
  ai/
    interpreter/page.tsx
    report/page.tsx

app/api/
  ai/number-interpretation/route.ts
  ai/number-report/route.ts
  api-keys/route.ts

components/
  angel-number/
  calculator/
  number-ai/

data/
  angel-numbers/
    source/
    generated.ts
  gematria/
  numerology/

lib/
  angel-numbers/
  gematria/
  numerology/
  number-ai/
  seo/

types/
  angel-number.ts
  gematria.ts
  numerology.ts
  number-ai.ts

tests/
  angel-numbers.test.ts
  gematria.test.ts
  numerology.test.ts
  number-ai-quota.test.ts
```

### 3.2 数据流

1. 用户在首页或 hub 输入任意纯数字，例如 `12345`。
2. `NumberSearch` 只做纯数字、空值和长度校验，跳转到 `/angel-number/12345`。
3. `getReadingForNumber()` 优先读取精选内容；未命中时调用 `interpretAnyNumber()` 生成即时解读。
4. 精选页输出 indexable metadata、FAQPage JSON-LD、breadcrumb，并进入 sitemap。
5. 生成页输出完整可读内容、breadcrumb JSON-LD、`noindex, follow` robots，不进入 sitemap，不输出 FAQPage JSON-LD。
6. AI CTA 在 Phase 5 接入 `/api/ai/number-interpretation`，再根据登录态、免费额度和会员权益决定是否扣减或引导支付。

### 3.3 内容分层

| 内容类型 | 存储方式 | 原因 |
| --- | --- | --- |
| Angel Number 结构化页 | `data/angel-numbers/source` + generated TS | 适合 pSEO，构建期可静态化，Cloudflare Worker 运行期无 `fs` 风险 |
| 任意数字即时解读 | `lib/angel-numbers/interpreter.ts` 规则引擎 | 覆盖所有有效纯数字输入，同时通过 `noindex, follow` 控制 SEO 质量 |
| Gematria 映射表 | `data/gematria/*.ts` 或 `lib/gematria/ciphers.ts` | 纯前端计算，可 tree-shake |
| Numerology 解读 | `data/numerology/*.ts` | 计算和解释可复用 |
| 博客文章 | 现有 CMS / `content` | 复用后台和 sitemap 逻辑 |
| AI 请求记录 | D1 Drizzle 表 | 需要用户、额度、成本、审计 |
| PDF 报告 | D1 metadata + R2 文件 | 文件型付费产物 |

---

## 4. 分阶段实施路线

### Phase 0: 项目适配与执行准备

**目标**: 把产品方案转换成可执行 backlog，确认当前代码库约束，避免后续按错误技术栈实现。

**主要工作**
- 确认品牌名、域名、默认语言、是否保留 NEXTY.DEV 模板 pricing/dashboard。
- 在 `config/site.ts` 中规划后续品牌替换项，但本阶段不急于改全站。
- 定义 Angel Number 数据 schema、页面 URL、SEO title/meta 模板。
- 明确 MVP 只发布英文 SEO 页面，中文/日文进入后续本地化阶段。

**涉及路径**
- `doc/产品设计方案v2.md`
- `DESIGN.md`
- `doc/Angel-Number-Decoder-分阶段实施方案.md`
- `config/site.ts`
- `i18n/routing.ts`
- `app/sitemap.ts`

**阶段产物**
- 本实施方案文档。
- Phase 1-6 backlog。
- 技术差异清单：Cloudflare/D1/Drizzle 替代 Vercel/Postgres/Prisma。

**验收标准**
- 文档能指导开发者不再引入 Prisma、Contentlayer、Vercel-only API。
- 每个阶段有明确产物、路径和验证命令。

---

### Phase 1: SEO 数据模型与静态内容管线

**目标**: 先打通 Angel Number 程序化页面的数据底座，不做复杂交互。

**主要工作**
- 新增类型：
  - `types/angel-number.ts`
  - `types/gematria.ts`
  - `types/numerology.ts`
- 新增 Angel Number reading 类型区分：
  - `CuratedAngelNumber`
  - `GeneratedAngelNumberReading`
  - `AngelNumberReading`
- 新增核心 loader：
  - `lib/angel-numbers/index.ts`
  - `lib/angel-numbers/seo.ts`
  - `lib/angel-numbers/interpreter.ts`
  - `lib/seo/json-ld.ts`
- 新增数据源：
  - `data/angel-numbers/source/en/111.json` 到 `999.json`，先覆盖 9 个三位重复数。
  - `data/angel-numbers/generated.ts`，由脚本生成并被页面静态 import。
- 新增生成脚本：
  - `scripts/build-angel-number-data.ts`
  - 在 `package.json` 增加 `angel:build-data`，并让 `cf:build` 前置执行。
- 新增测试：
  - `tests/angel-numbers.test.ts` 校验 slug 唯一、FAQ 非空、related numbers 存在、meta 长度合理。
  - 任意数字解析测试覆盖重复数、镜像数、递增数、单数字和普通多位数。

**阶段产物**
- 9 个核心 Angel Number 的结构化数据。
- 可被 Next.js 页面直接 import 的 generated 数据文件。
- pSEO 数据质量测试。

**验收标准**
- `getAllAngelNumbers()` 返回 9 个核心数字。
- `getAngelNumber("444")` 返回完整 title、summary、meanings、FAQ、related numbers、meta。
- `getReadingForNumber("444")` 返回 curated reading 且允许索引。
- `interpretAnyNumber("12345")` 返回 generated reading 且默认不允许索引。
- 运行期不依赖 `fs` 读取内容目录。

**验证命令**
```bash
corepack pnpm exec tsx scripts/build-angel-number-data.ts
corepack pnpm test
corepack pnpm exec tsc --noEmit
```

---

### Phase 2: Angel Number 公共页面 MVP

**目标**: 上线首页入口、Angel Number hub 和单数字详情页，先获取搜索引擎可抓取内容。

**主要工作**
- 首页替换或重构：
  - `components/home/Hero.tsx` 增加数字搜索框，输入数字跳转到 `/angel-number/[number]`。
  - `components/home/index.tsx` 调整为搜索优先首屏、热门数字入口、Gematria 主入口、FAQ/博客区域。
- 新增 Angel Number 页面：
  - `app/[locale]/(basic-layout)/angel-number/page.tsx`
  - `app/[locale]/(basic-layout)/angel-number/[number]/page.tsx`
  - `app/[locale]/(basic-layout)/angel-number/[number]/opengraph-image.tsx`
- 新增业务组件：
  - `components/angel-number/NumberSearch.tsx`
  - `components/angel-number/PopularNumberGrid.tsx`
  - `components/angel-number/NumberHero.tsx`
  - `components/angel-number/MeaningTabs.tsx`
  - `components/angel-number/GematriaValues.tsx`
  - `components/angel-number/NumerologySummary.tsx`
  - `components/angel-number/RelatedNumbers.tsx`
  - `components/angel-number/FAQSection.tsx`
  - `components/angel-number/AffirmationCard.tsx`
  - `components/number-ai/AICtaBanner.tsx`
- 更新 SEO：
  - `app/sitemap.ts` 加入 angel number hub 和精选详情页，不加入任意生成页。
  - `lib/metadata.ts` 或页面自身 `generateMetadata()` 生成 canonical、OG、hreflang。
  - 精选页输出 `FAQPage`、`BreadcrumbList`；生成页只输出基础 `BreadcrumbList`。
- i18n：
  - 新增 `i18n/messages/en/AngelNumber.json`。
  - `zh/ja` 先提供基础 UI 字段，不批量发布翻译内容。
  - 更新 `i18n/request.ts` 注册新 namespace。

**阶段产物**
- `/angel-number` 列表页。
- `/angel-number/111` 到 `/angel-number/999` 的 9 个精选详情页。
- `/angel-number/[任意有效数字]` 的即时解读页。
- 首页数字搜索与热门数字入口。
- 精选详情页有动态 metadata、FAQ schema、OG image；生成页有 noindex metadata、基础 breadcrumb 和 OG image。

**验收标准**
- 未登录用户可访问所有 Phase 2 页面。
- 详情页对任意有效纯数字返回解读；仅空输入、非数字或超过长度上限时不允许跳转/返回 404。
- `/angel-number/444` 为精选 SEO 页，`index, follow`，有 FAQPage JSON-LD。
- `/angel-number/12345` 可访问且 `noindex, follow`，不输出 FAQPage JSON-LD。
- 移动端 tabs 可横向滚动，桌面端完整展示。
- 页面主体内容在禁用 JS 时仍可读。

**验证命令**
```bash
corepack pnpm exec tsc --noEmit
corepack pnpm build
corepack pnpm cf:build
```

---

### Phase 3: 免费计算器与站内搜索

**目标**: 完成以 Gematria Calculator 为主的免费工具体系，Numerology、Life Path 作为辅助工具，形成工具流量和 AI CTA 漏斗。

**主要工作**
- Gematria：
  - `lib/gematria/ciphers.ts`
  - `lib/gematria/calculate.ts`
  - `lib/gematria/match.ts`
  - `components/calculator/GematriaCalculator.tsx`
  - `components/calculator/LetterBreakdown.tsx`
  - `components/calculator/ValueMatchList.tsx`
  - `app/[locale]/(basic-layout)/calculator/gematria/page.tsx`
- Numerology：
  - `lib/numerology/life-path.ts`
  - `lib/numerology/expression.ts`
  - `lib/numerology/soul-urge.ts`
  - `components/calculator/NumerologyCalculator.tsx`
  - `app/[locale]/(basic-layout)/calculator/numerology/page.tsx`
  - `app/[locale]/(basic-layout)/calculator/life-path/page.tsx`
- 工具中心：
  - `app/[locale]/(basic-layout)/calculator/page.tsx`
  - `components/calculator/CalculatorHub.tsx`
  - `/calculator` 首屏以大型 Gematria 输入区和多系统结果面板为主，其他工具只作为次级入口。
- 搜索：
  - `components/angel-number/NumberSearch.tsx` 支持建议、热门搜索和非法输入提示。
  - 可以先本地搜索，不接 Algolia。
- 测试：
  - `tests/gematria.test.ts`
  - `tests/numerology.test.ts`

**阶段产物**
- 一个旗舰 Gematria Calculator 和两个辅助免费计算器。
- 所有计算逻辑均可测试、可复用，不依赖 API。
- 工具页可从首页、Angel Number 详情页、footer 内链进入。

**验收标准**
- Gematria 输入英文时实时计算，展示多系统结果和逐字拆解。
- `/calculator` 首屏明确突出 Gematria，不再三等分展示工具。
- `/calculator/gematria` 提供系统矩阵、letter breakdown、same-value matches、复制结果和分享链接。
- Numerology 支持 full name + birthday，返回 Life Path、Expression、Soul Urge、Personality。
- Life Path 独立页面可作为 SEO 工具页。
- 计算器首屏 JS 控制在可接受范围，重型可视化组件需要 lazy load。

**验证命令**
```bash
corepack pnpm test
corepack pnpm exec tsc --noEmit
corepack pnpm build
```

---

### Phase 3.5: 页面体验与设计系统返工

**目标**: 按 `DESIGN.md` 将公开页面从普通 SaaS/card 拼接返工为 dark observatory 体验，同时保持 v2 文档定义的 Gematria 与 Angel Number 并列关系。

**主要工作**
- 设计 token：
  - 新增 observatory 主题 token，承载 Void、Vellum、Cloister、Ink、stroke、glow、motion 和字体栈。
  - Angel Number 与 Calculator 公开页面使用 observatory 主题；dashboard、auth、payment、CMS 后台不切换。
- 搜索入口：
  - 首页使用 SmartSearchBar，placeholder 为 `Enter a number or word to decode...`。
  - 纯数字输入跳转 `/angel-number/[number]`；含文字输入跳转 `/calculator/gematria?input=...`。
  - `/angel-number` hub 继续使用数字专用 NumberSearch。
- 页面重排：
  - 首页强调双入口搜索、Top 9 数字星图和 Gematria 主工具，不做普通营销 landing。
  - Angel Number 详情页按 Hero、Pull Quote、Tabs、Gematria、Numerology、AI CTA、Biblical、Related Numbers、FAQ、Affirmation 的阅读节奏排列。
  - Calculator hub 保持 Gematria 65-75% 视觉权重，Numerology 与 Life Path 作为辅助入口。
- 来源诚信：
  - 每个内容块使用来源 Badge 区分 `GEMATRIA · CALCULATION`、`ANGEL NUMBER · INTERPRETATION`、`NUMEROLOGY · PERSPECTIVE`、`BIBLICAL · CROSS-REFERENCE`。
  - Gematria 客观计算与 Angel Number 主观解读不混写、不强制互跳，只做可选发现式推荐。
- 文案与动效：
  - 页面文案采用“博物馆策展人”语气，避免 emoji、感叹号堆叠、clickbait 和绝对化承诺。
  - 卡片 hover 只改变边框和背景，不做上浮；按钮使用描边 + 微弱底色，不使用实色填充。

**涉及路径**
- `DESIGN.md`
- `doc/Angel-Number-Decoder-分阶段实施方案.md`
- `components/mystic/*`
- `components/decoder/SmartSearchBar.tsx`
- `components/home/index.tsx`
- `components/angel-number/*`
- `components/calculator/*`
- `app/[locale]/(basic-layout)/angel-number/*`
- `app/[locale]/(basic-layout)/calculator/*`
- `lib/decoder-search.ts`
- `tests/decoder-search.test.ts`

**阶段产物**
- dark observatory token 与共享组件。
- 首页数字/文字双分流搜索。
- 详情页仪式化阅读结构与来源标注。
- Calculator 页面与 Gematria 输入参数联动。
- 设计返工说明写入本实施方案。

**验收标准**
- 3 秒内能识别产品为 Angel Number Decoder，而非通用 SaaS。
- 数字始终是 Angel Number 页面视觉中心，375px 移动端仍成立。
- 页面不用 emoji 图标、紫粉渐变、实色主 CTA、上浮卡片 hover。
- 客观计算、主观解读、数字命理、圣经引用的来源可辨。
- SmartSearchBar 的空输入、纯数字、时钟格式、英文词、混合短语均有测试覆盖。

**验证命令**
```bash
corepack pnpm test
corepack pnpm exec tsc --noEmit
corepack pnpm build
corepack pnpm cf:build
```

---

### Phase 4: 内容规模化与 SEO 运营

**目标**: 从 9 个核心页扩展到 80-100 个高质量 pSEO 页面，并补齐 SEO 运营基础设施。

**主要工作**
- 扩展 Angel Number 数据：
  - 两位重复数：`11` 到 `99`
  - 四位重复数：`1111` 到 `9999`
  - 单数字：`0` 到 `9`
  - 镜像数、递增序列、圣经重要数字
- 内容质量脚本：
  - 校验 meta description 长度。
  - 校验 FAQ 数量、related numbers、canonical slug。
  - 校验核心 20 页字数与唯一内容字段。
- 博客内容：
  - 复用现有 CMS：`actions/posts/posts.ts`、dashboard blogs 管理页。
  - 先发布 6 篇 P0 支撑文章，并内链到对应 number/detail/calculator 页面。
- Sitemap：
  - `app/sitemap.ts` 增加 calculator、AI landing、精选 angel number 页面。
  - 任意数字生成页继续保持可访问但不进 sitemap。
  - 保持 locale URL 规则一致。
- 性能：
  - 对页面组件做 Server Component 优先。
  - 客户端交互只包裹 tabs/search/calculator。
  - 使用 `next/image`、固定尺寸、减少 CLS。

**阶段产物**
- 80-100 个 Angel Number 静态详情页。
- 6 篇支撑博客文章。
- 完整 sitemap 与内链网络。
- 内容质量检查脚本。

**验收标准**
- 任意 `getAllAngelNumbers()` 返回的 slug 都能生成静态页面。
- 任意有效纯数字都能通过 `interpretAnyNumber()` 生成 noindex 解读页。
- sitemap 不产生重复 URL。
- 核心精选页与生成页有明确 SEO 策略差异，避免低质模板页进入索引。
- Lighthouse/Core Web Vitals 达到可发布标准：LCP < 2.5s，CLS < 0.1。

**验证命令**
```bash
corepack pnpm exec tsx scripts/build-angel-number-data.ts
corepack pnpm test
corepack pnpm build
corepack pnpm cf:build
```

---

### Phase 5: AI Freemium 与会员转化

**目标**: 把免费流量转化为 AI 解读和 Pro 订阅。

**主要工作**
- AI 入口：
  - `app/[locale]/(basic-layout)/ai/interpreter/page.tsx`
  - `components/number-ai/NumberInterpreterForm.tsx`
  - `components/number-ai/InterpretationResult.tsx`
  - `app/api/ai/number-interpretation/route.ts`
  - `lib/number-ai/interpreter.ts`
  - `types/number-ai.ts`
- 使用现有 AI SDK：
  - 复用 `config/ai-providers.ts`、`config/ai-models.ts`。
  - 文本生成优先使用 `lib/ai/chat.ts` 的 provider/model 获取方式。
- 登录与额度：
  - 未登录用户：每天少量免费次数，可用 Upstash rate limit 或 D1 记录。
  - 登录用户：接入现有用户体系。
  - Pro 用户：复用现有 pricing/benefits/usage 体系。
- 支付：
  - 新增或调整 seed：`lib/db/seed/pricing-config.ts`。
  - 复用 checkout：`app/api/payment/checkout-session/route.ts`。
- 数据库：
  - 在 `lib/db/schema.ts` 增加 AI 请求记录表，例如 `number_ai_requests`。
  - 字段包括 `userId`、`inputNumber`、`context`、`provider`、`model`、`status`、`costMetadata`、`createdAt`。
  - 生成 D1 migration。
- 安全与成本控制：
  - Zod 校验输入。
  - 限制 prompt 长度。
  - 对失败调用写日志，不把 provider error 原样暴露给用户。

**阶段产物**
- AI 数字解读页。
- Angel Number 详情页 CTA 可进入 AI 解读。
- 每日免费额度与会员权益判断。
- AI 请求审计记录。

**验收标准**
- 未配置 AI key 时页面能给出友好错误，不导致构建失败。
- 未登录、登录免费、Pro 三种状态路径清晰。
- AI route 有输入校验、rate limit、错误日志。
- 支付成功后会员权益可用于 AI 解读。

**验证命令**
```bash
corepack pnpm db:generate
corepack pnpm test:d1
corepack pnpm test
corepack pnpm exec tsc --noEmit
corepack pnpm build
```

---

### Phase 6: 付费报告、API 与后台运营

**目标**: 建立更深的付费产品和可运营后台，支撑长期变现。

**主要工作**
- PDF 报告：
  - `app/[locale]/(basic-layout)/ai/report/page.tsx`
  - `app/api/ai/number-report/route.ts`
  - `lib/number-ai/report.ts`
  - 报告 metadata 进 D1，PDF/HTML 导出文件进 R2。
- 订单绑定：
  - 单次报告 $4.99 可复用现有 one-time payment。
  - 支付完成后生成或解锁报告。
- API：
  - `app/[locale]/(basic-layout)/api/page.tsx` 作为 API 文档页。
  - `app/api/api-keys/route.ts` 管理 API key。
  - `app/api/v1/angel-number/[number]/route.ts`
  - `app/api/v1/gematria/route.ts`
  - D1 新增 `api_keys`、`api_usage_logs`。
- 后台：
  - `app/[locale]/(protected)/dashboard/(admin)/angel-numbers/page.tsx`
  - `app/[locale]/(protected)/dashboard/(admin)/ai-requests/page.tsx`
  - 可查看热门数字、AI 调用量、转化漏斗。
- 分析：
  - PostHog/Plausible 事件：search、number_page_view、calculator_use、ai_cta_click、ai_success、checkout_start、report_purchase。

**阶段产物**
- 一次性付费 AI 报告。
- API 文档与首批 API endpoint。
- API key 与用量统计。
- 管理后台运营视图。

**验收标准**
- 报告生成失败可重试，不重复扣费。
- API key 可撤销，接口有 rate limit。
- 管理后台仅 admin 可访问。
- 所有付费相关路径有 webhook 幂等处理和日志。

**验证命令**
```bash
corepack pnpm test:d1
corepack pnpm test
corepack pnpm exec tsc --noEmit
corepack pnpm build
corepack pnpm cf:build
```

---

## 5. 推荐里程碑与阶段产物总览

| 阶段 | 建议周期 | 可交付产物 | 是否可上线 |
| --- | --- | --- | --- |
| Phase 0 | 0.5-1 天 | 实施方案、backlog、技术修订清单 | 否 |
| Phase 1 | 2-3 天 | 数据 schema、核心 9 页数据、生成脚本、测试 | 否 |
| Phase 2 | 4-6 天 | 首页入口、hub、9 个详情页、OG、schema、sitemap | 是，SEO MVP |
| Phase 3 | 4-5 天 | Gematria、Numerology、Life Path、工具中心 | 是，工具 MVP |
| Phase 3.5 | 2-3 天 | DESIGN.md 设计系统返工、双分流搜索、详情页阅读节奏、来源 Badge | 是，体验返工版 |
| Phase 4 | 1-2 周 | 80-100 pSEO 页、博客、内容质量脚本、内链 | 是，增长版 |
| Phase 5 | 1-2 周 | AI 解读、额度、登录转化、Pro 支付 | 是，商业化 MVP |
| Phase 6 | 2-4 周 | PDF 报告、API、后台运营、分析体系 | 是，商业化增强 |

---

## 6. 首批实施任务建议

建议第一轮只执行 Phase 1 + Phase 2，原因是它们能最快验证 SEO 入口和产品定位，同时不引入数据库、AI 成本和支付复杂度。

第一轮任务拆分：

1. 建立 `types/angel-number.ts`、`lib/angel-numbers`、`data/angel-numbers`。
2. 准备 9 个三位重复数的结构化内容。
3. 添加内容生成与校验脚本。
4. 新增 `/angel-number` hub 与 `/angel-number/[number]` detail。
5. 改造首页 hero 为数字搜索入口。
6. 加入 sitemap、metadata、JSON-LD、OG image。
7. 跑 `test`、`tsc`、`build`、`cf:build`。

---

## 7. 风险与控制点

| 风险 | 影响 | 控制方式 |
| --- | --- | --- |
| 批量模板页内容重复 | SEO 收录和排名受损 | 核心 20 页手写，模板页必须有唯一 FAQ、related、root meaning、场景描述 |
| 运行期读文件不兼容 Workers | Cloudflare 部署失败 | 构建期生成 TS 数据，页面静态 import |
| 全站主题一次性重构 | 影响现有 dashboard/payment/CMS | Angel Number 专区局部视觉升级，后续再统一品牌 |
| 设计返工偏离 `DESIGN.md` | 产品退化为普通 SaaS 或廉价灵性站 | 使用 observatory token、来源 Badge、设计禁区清单和移动端截图作为验收 |
| AI 成本失控 | 毛利不稳定 | 先做 daily quota、登录门槛、rate limit、日志，再开放 Pro |
| i18n 低质批量翻译 | 多语言 SEO 风险 | MVP 只索引英文内容，多语言内容经人工/质量脚本后再开放 |
| D1 迁移误操作 | 生产数据风险 | migration 生成后人工 review，远程 apply 不自动执行 |

---

## 8. 完成定义

Phase 2 完成时，产品应具备：

- 用户打开首页即可输入数字并跳转到解读页。
- Google 可抓取 `/angel-number` 与 9 个精选核心详情页。
- 任意有效数字详情页可访问、可分享，但默认 `noindex, follow` 且不进 sitemap。
- 精选详情页有清晰的 H1、meta、canonical、FAQ schema、related links；生成页有基础 breadcrumb、场景解读和 related links。
- 项目可通过 `corepack pnpm build` 与 `corepack pnpm cf:build`。
- 不新增数据库依赖，不破坏现有登录、支付、dashboard、CMS。

Phase 3.5 完成时，产品应具备：

- 首页 SmartSearchBar 可把纯数字分流到 Angel Number，把文字分流到 Gematria。
- Angel Number 详情页按 `DESIGN.md` 的阅读节奏呈现，并且每个体系有来源 Badge。
- 公开页面使用 dark observatory 视觉系统，避免 emoji 图标、紫粉渐变、实色主 CTA 和上浮卡片 hover。
- Calculator hub 明确突出 Gematria，Gematria 页面可从 `?input=` 带入初始输入。
- desktop 与 375px mobile 截图均通过设计 QA：数字是视觉中心、文字不溢出、触摸目标可用。

Phase 5 完成时，产品应具备：

- 免费内容和工具形成 AI CTA 漏斗。
- 用户可获得个性化 AI 解读。
- 免费额度、登录、Pro 订阅和支付闭环可用。
- AI 请求可审计、可限流、可观测。

---

*文档版本: v1.1 | 更新日期: 2026-05-05 | 来源: `doc/产品设计方案v2.md`、`DESIGN.md` 与当前代码库*
