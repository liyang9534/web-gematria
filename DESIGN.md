# Angel Number Decoder — Design System

> **设计哲学**：在数学的精确与神秘的诗意之间寻找平衡。
> 我们不模仿星象学网站的廉价霓虹，也不沦为又一个冷冰冰的 SaaS 工具。
> 我们要做的是 **天文台的克制 × 古籍的厚重 × 现代极简的呼吸感**。

---

## 1. 设计理念 (Design Philosophy)

### 1.1 核心定位 — Mystical Modern

> *"Numbers are the highest degree of knowledge. It is knowledge itself."* — Plato

我们的设计语言建立在三组张力之上：

| 维度 A | × | 维度 B | 设计表达 |
|-------|---|-------|---------|
| 古老 (Ancient) | × | 现代 (Modern) | 衬线展示字 + 几何无衬线正文 |
| 神秘 (Mystical) | × | 精确 (Precise) | 微弱光晕 + 等宽数字 + 严格栅格 |
| 深邃 (Deep) | × | 通透 (Airy) | 近黑底色 + 大量留白 + 细如蛛丝的描边 |

**我们 NOT 做的：**
- ❌ 紫色渐变到粉色（廉价的"灵性网站"标配）
- ❌ 水晶 / 月亮 / 塔罗牌 emoji 堆砌
- ❌ 闪烁的星星动画、彩虹光斑
- ❌ Comic Sans / 手写体伪装的"魔法字体"
- ❌ Inter / Roboto / Arial 等无个性默认字体

**我们 YES 做的：**
- ✅ 近乎黑色的深空底色，让数字本身发光
- ✅ 衬线大字（Cormorant Garamond）作为仪式感的载体
- ✅ 等宽数字（JetBrains Mono）传递计算的精确性
- ✅ 微妙的金色高光，模拟旧书烫金边
- ✅ 几何符号（◈ ✦ ✧ ❋）替代 emoji，做视觉锚点
- ✅ 像天文学论文一样严谨的栅格系统

### 1.2 视觉关键词

```
Astronomical · Editorial · Monastic · Refined · Quietly Luminous
```

参考美学坐标：
- **Linear.app** 的克制与精确
- **The Browser Company / Arc** 的现代仪式感
- **Aesop** 的字体气质（衬线 + 极简留白）
- **Monocle Magazine** 的编辑设计语言
- **古籍善本** 的烫金、版心、留白
- **天文台星图** 的深色底 + 精细线条

**反面参考（明确避开）：**
- 任何 "horoscope.com" 类站点
- 任何使用紫粉渐变 + Outfit 字体的 AI 工具站
- Gematrix.org 的 2010 年表格美学

---

## 2. 色彩系统 (Color System)

### 2.1 设计逻辑

色彩遵循 **"深空 + 古籍烫金 + 仪式紫"** 三色哲学：

- **深空 (Void)**：作为底，所有内容的舞台
- **羊皮纸金 (Vellum Gold)**：用于数字本身，呼应古籍烫金
- **修道紫 (Cloister Violet)**：用于交互与强调，节制使用

### 2.2 完整色板

```css
:root {
  /* ━━━━━━━━ Void 深空底色系 ━━━━━━━━ */
  --void-absolute:   #07070C;  /* 几乎纯黑，页面最底层 */
  --void-deep:       #0C0C14;  /* 主背景 */
  --void-rise:       #12121C;  /* 卡片表面 */
  --void-elevated:   #1A1A26;  /* 浮起元素 / 输入框 */
  --void-membrane:   #232332;  /* 悬浮 / hover 态 */

  /* ━━━━━━━━ Vellum 羊皮纸金 ━━━━━━━━ */
  --vellum-100:      #FBF6E9;  /* 最亮，几乎只用于数字高光 */
  --vellum-300:      #E8D9A8;  /* 数字主色 */
  --vellum-500:      #C9A961;  /* 标准烫金 */
  --vellum-700:      #8C7340;  /* 深烫金，描边用 */
  --vellum-900:      #4A3D22;  /* 仅用于极深描边 */

  /* ━━━━━━━━ Cloister 修道紫 ━━━━━━━━ */
  /* 深沉、克制，绝非廉价 RGB(128,0,128) */
  --cloister-100:    #D8CFE8;
  --cloister-300:    #9B8FBF;
  --cloister-500:    #6B5B95;  /* 主交互色 */
  --cloister-700:    #463A6A;
  --cloister-900:    #2A2240;

  /* ━━━━━━━━ Ink 文字色阶 ━━━━━━━━ */
  --ink-pure:        #F4F1E8;  /* 旧纸白，避免刺眼纯白 */
  --ink-primary:     #E8E4D6;  /* 正文主色 */
  --ink-secondary:   #A8A394;  /* 副文字 */
  --ink-muted:       #6B6759;  /* 弱化文字、占位符 */
  --ink-whisper:     #3D3A33;  /* 极弱文字，仅装饰 */

  /* ━━━━━━━━ Semantic 语义色 ━━━━━━━━ */
  /* 注意：保留语义色但调成低饱和的"古朴版" */
  --hue-rose:        #B85450;  /* 玫红 — 爱情类 (古铜玫瑰) */
  --hue-jade:        #5C8C7A;  /* 青玉 — 健康/成长 */
  --hue-amber:       #C4923D;  /* 琥珀 — 财富/事业 */
  --hue-iris:        #7B6FA8;  /* 鸢尾 — 灵性 */

  /* ━━━━━━━━ Stroke 描边 ━━━━━━━━ */
  --stroke-hairline: rgba(232, 217, 168, 0.06);   /* 蛛丝 */
  --stroke-default:  rgba(232, 217, 168, 0.12);   /* 默认 */
  --stroke-emphasis: rgba(232, 217, 168, 0.28);   /* 强调 */
  --stroke-active:   rgba(201, 169, 97, 0.55);    /* 激活态 */

  /* ━━━━━━━━ Glow 光晕 (节制使用) ━━━━━━━━ */
  --glow-vellum:     0 0 24px rgba(201, 169, 97, 0.18),
                     0 0 48px rgba(201, 169, 97, 0.08);
  --glow-cloister:   0 0 32px rgba(107, 91, 149, 0.22);
  --glow-text-soft:  0 0 16px rgba(232, 217, 168, 0.12);

  /* ━━━━━━━━ Shadow 投影 ━━━━━━━━ */
  --shadow-page:     0 1px 0 rgba(232, 217, 168, 0.04) inset;
  --shadow-card:     0 24px 48px -16px rgba(0, 0, 0, 0.5),
                     0 0 0 1px var(--stroke-hairline);
  --shadow-modal:    0 48px 96px -24px rgba(0, 0, 0, 0.7),
                     0 0 0 1px var(--stroke-default);
}

/* ━━━━━━━━ Light Mode — Parchment Observatory ━━━━━━━━ */
/* 浅色不是白底 SaaS，而是自然光下的古籍研究桌。 */
/* 变量名继续沿用 Void/Vellum/Cloister，保证现有组件无需改类名。 */
.light .observatory-theme {
  /* Parchment 羊皮纸表面系 */
  --void-absolute:   #F7F1E3;  /* 页面最底层，温润旧纸 */
  --void-deep:       #F2E7CF;  /* 主背景 */
  --void-rise:       #FFF8E8;  /* 卡片表面 */
  --void-elevated:   #EFE0BC;  /* 输入框 / 浮起元素 */
  --void-membrane:   #E5D0A8;  /* 悬浮 / hover 态 */

  /* Antique Gold 古籍墨金 */
  --vellum-100:      #3F3216;  /* 最强金墨，用于 hover 文字 */
  --vellum-300:      #6B5420;  /* 数字主色，浅底上需压暗 */
  --vellum-500:      #7F5F25;  /* 标准强调、eyebrow、分隔线 */
  --vellum-700:      #B08A3A;  /* 柔和金边 */
  --vellum-900:      #E7D7A9;  /* 金色淡底 */

  /* Cloister 修道紫 — 在纸面上更像批注墨水 */
  --cloister-100:    #352A53;  /* 紫色区域文字 */
  --cloister-300:    #594A82;  /* 主交互紫 */
  --cloister-500:    #6B5B95;
  --cloister-700:    #9B8FBF;
  --cloister-900:    #EFE8F7;  /* 紫色淡底 */

  /* Ink 纸面墨色 */
  --ink-pure:        #18150F;  /* 标题 / 主导航 */
  --ink-primary:     #252016;  /* 正文主色 */
  --ink-secondary:   #5B5141;  /* 副文字 */
  --ink-muted:       #71634F;  /* 占位符 / 元信息 */
  --ink-whisper:     #B9A988;  /* 极弱装饰 */

  /* Semantic 语义色 — 保持低饱和、可读 */
  --hue-rose:        #9D4F50;
  --hue-jade:        #3F7463;
  --hue-amber:       #8A672A;
  --hue-iris:        #594A82;

  /* Stroke 描边 — 用纸面压痕感替代夜色光边 */
  --stroke-hairline: rgba(81, 64, 34, 0.10);
  --stroke-default:  rgba(81, 64, 34, 0.16);
  --stroke-emphasis: rgba(107, 84, 32, 0.28);
  --stroke-active:   rgba(107, 84, 32, 0.55);

  /* Glow 光晕 — 浅色下必须像纸面压力，不像霓虹 */
  --glow-vellum:     0 0 0 3px rgba(138, 101, 35, 0.10),
                     0 16px 36px -24px rgba(107, 84, 32, 0.55);
  --glow-cloister:   0 0 0 3px rgba(89, 74, 130, 0.10),
                     0 16px 36px -24px rgba(53, 42, 83, 0.45);
  --glow-text-soft:  none;

  /* Shadow 投影 — 避免浮夸卡片，模拟厚纸边缘 */
  --shadow-page:     0 1px 0 rgba(255, 255, 255, 0.55) inset;
  --shadow-card:     0 18px 38px -26px rgba(54, 42, 21, 0.32),
                     0 1px 0 rgba(255, 255, 255, 0.68) inset,
                     0 0 0 1px var(--stroke-hairline);
  --shadow-modal:    0 34px 72px -28px rgba(54, 42, 21, 0.42),
                     0 0 0 1px var(--stroke-default);
}
```

### 2.3 色彩使用律

> 默认深色模式。浅色模式作为可选，但深色才是产品的"母语"。

**60-30-10 比例铁律：**
- **60%** Void 系（背景、卡片底、大块面积）
- **30%** Ink 系（文字、图标、描边）
- **10%** Vellum + Cloister（数字高光、CTA、激活态）

**Vellum 金的使用纪律：**
- ✅ 数字本身（这是产品的主角）
- ✅ Logo 标记
- ✅ 页面里 1-2 个真正重要的强调点
- ❌ 不用于大段文字（疲劳眼睛）
- ❌ 不用于次要装饰

**Light Mode 纪律：**
- 浅色模式命名为 **Parchment Observatory**：古籍纸面 + 研究仪器，不是纯白仪表盘。
- Void 变量在浅色下代表纸张层级：底纸、版心、卡片、输入框、hover 压痕。
- Vellum 金必须整体压暗，数字使用 `--vellum-300`，小号标签使用 `--vellum-500`；禁止浅金文字直接放在浅底上。
- Cloister 紫在浅色下更像批注墨水，只用于交互、来源徽章、AI CTA 和少量状态提示。
- 卡片靠细描边、纸面内阴影和轻微层级区分，不使用大面积白色浮卡或强烈投影。
- 浅色模式的目标是提升阅读舒适度，但不能削弱“天文台 × 古籍 × 数字仪器”的品牌记忆。

---

## 3. 字体系统 (Typography)

### 3.1 字体选择哲学

> 字体是产品的"声音"。我们要避开所有 AI 默认字体，选择有性格的组合。

| 角色 | 字体 | 理由 |
|------|------|------|
| **Display 展示** | `Cormorant Garamond` | 文艺复兴时期 Garamond 的现代复刻，极致优雅，神秘感与古籍气质 |
| **Body 正文** | `Söhne` / fallback `Söhne Buch` → `IBM Plex Sans` | 瑞士现代主义，清晰但不冰冷；备选 IBM Plex 同样有性格 |
| **Mono 数字** | `JetBrains Mono` | 等宽、几何，最完美的"计算"字体；零(0)与圆(O)清晰可辨 |
| **Accent 装饰** | `Cormorant Infant` | 衬线带卷曲收尾，用于 pull-quote 与 affirmation |

**字体加载策略：**
- 使用 `next/font` 本地托管，避免 FOUT
- Cormorant Garamond → Google Fonts 可获取
- Söhne 是付费字体，无授权时用 IBM Plex Sans 作为 fallback（同样有强烈性格）
- 所有字体加载失败时的 fallback：`Georgia, serif` / `system-ui` / `monospace`

### 3.2 字号尺度 (Type Scale)

采用 **1.250 (Major Third)** 比例，更柔和优雅，适配编辑式阅读。

```css
:root {
  /* Body Scale */
  --type-xs:       0.75rem;     /* 12px — 元数据、标签 */
  --type-sm:       0.875rem;    /* 14px — 辅助文字 */
  --type-base:     1rem;        /* 16px — 正文 */
  --type-md:       1.125rem;    /* 18px — 强调正文 */
  --type-lg:       1.375rem;    /* 22px — 引导段落 */

  /* Display Scale */
  --type-h6:       1.25rem;     /* 20px */
  --type-h5:       1.5rem;      /* 24px */
  --type-h4:       1.875rem;    /* 30px */
  --type-h3:       2.5rem;      /* 40px */
  --type-h2:       3.5rem;      /* 56px */
  --type-h1:       4.5rem;      /* 72px */

  /* Numerical Display — 数字独占的字号体系 */
  --type-num-sm:   2rem;        /* 32px — 行内数字 */
  --type-num-md:   4rem;        /* 64px — 卡片数字 */
  --type-num-lg:   8rem;        /* 128px — 详情页主数字 */
  --type-num-xl:   12rem;       /* 192px — Hero 数字 */

  /* Line Heights */
  --leading-display:  1.05;
  --leading-heading:  1.15;
  --leading-body:     1.65;     /* 阅读舒适 */
  --leading-tight:    1.3;

  /* Letter Spacing */
  --tracking-display: -0.02em;  /* 大标题略紧 */
  --tracking-body:    0;
  --tracking-eyebrow: 0.18em;   /* 副标签宽松，带仪式感 */
  --tracking-num:     -0.04em;  /* 数字略紧，更密实 */
}
```

### 3.3 字体使用范例

```css
/* Hero 数字展示 — 详情页的主角 */
.number-hero {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--type-num-xl);
  font-weight: 300;             /* 注意：细体而非粗体，更有空气感 */
  letter-spacing: var(--tracking-num);
  color: var(--vellum-300);
  text-shadow: var(--glow-text-soft);
  font-feature-settings: "tnum", "lnum";  /* 等宽数字 */
}

/* 章节标题 */
.section-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: var(--type-h3);
  font-weight: 400;             /* Cormorant 在 400 已足够优雅 */
  font-style: italic;           /* 部分场景用斜体增加韵律 */
  letter-spacing: var(--tracking-display);
  color: var(--ink-pure);
}

/* Eyebrow 副标 — 用在大标题上方的小标签 */
.eyebrow {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: var(--type-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  color: var(--vellum-500);
}

/* 引述 / Affirmation */
.affirmation {
  font-family: 'Cormorant Infant', 'Cormorant Garamond', serif;
  font-size: var(--type-h4);
  font-style: italic;
  font-weight: 300;
  line-height: var(--leading-heading);
  color: var(--ink-pure);
  /* 前后加古籍式引号 */
  &::before { content: "\201C"; }
  &::after  { content: "\201D"; }
}

/* 正文 */
.prose {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: var(--type-base);
  line-height: var(--leading-body);
  color: var(--ink-primary);
}
```

---

## 4. 空间与栅格 (Spacing & Grid)

### 4.1 间距尺度

基于 **4px 基准网格**，但使用 8px 的整数倍作为常用值。

```css
:root {
  --space-px:    1px;
  --space-0-5:   2px;
  --space-1:     4px;
  --space-2:     8px;
  --space-3:     12px;
  --space-4:     16px;
  --space-5:     20px;
  --space-6:     24px;
  --space-8:     32px;
  --space-10:    40px;
  --space-12:    48px;
  --space-16:    64px;
  --space-20:    80px;
  --space-24:    96px;
  --space-32:    128px;
  --space-40:    160px;     /* 章节间距 */
  --space-48:    192px;     /* 主区块间距 */
}
```

### 4.2 栅格系统

```
12 列网格
─────────────────────────────────────────
最大内容宽度:    1240px
内容栏 (阅读):   680px (单栏阅读最佳行长 ~70 字符)
内容栏 (宽):     920px
左右安全边距:    desktop 64px / tablet 32px / mobile 20px
列间距 (gutter): desktop 24px / mobile 16px
```

### 4.3 留白原则

> *"白纸的留白不是浪费，是文字呼吸的空间。"*

- 章节之间 ≥ `space-24` (96px)，重大区块 ≥ `space-40`
- 卡片内边距至少 `space-8` (32px)，重要卡片用 `space-12`
- 数字 Hero 区域上下空间 ≥ `space-32`，给数字"足够的舞台"

---

## 5. 组件设计语言 (Components)

### 5.1 数字 Hero（产品的灵魂）

详情页最核心的视觉单元。**不是简单地把数字放大，而是给它一个仪式感的舞台**。

```
┌─────────────────────────────────────────────┐
│                                             │
│         · ◈ ANGEL NUMBER ◈ ·                │  ← Eyebrow, vellum-500
│                                             │
│                                             │
│              4 4 4                          │  ← Mono, 192px, vellum-300
│                                             │     字距 -0.04em
│                                             │     极细描边光晕
│       ─── ✦ ───                             │  ← 装饰分隔线
│                                             │
│     "Protection · Stability · Foundation"   │  ← Cormorant italic, 28px
│                                             │
│      Three pillars of unseen scaffolding    │  ← Body, ink-secondary
│                                             │
└─────────────────────────────────────────────┘
```

**实现要点：**
- 数字使用 JetBrains Mono **300 字重**（细体），而非粗体——粗体显得廉价
- 数字下方有一条 1px 的金色分隔线，长度仅 60px，居中
- 整个区块至少 480px 高度，给数字"主角光环"
- 微妙的暗色径向渐变背景（从中心向外，深度极浅）

```css
.number-hero {
  position: relative;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-20) var(--space-8);
  background:
    radial-gradient(
      ellipse at center top,
      rgba(201, 169, 97, 0.04) 0%,
      transparent 60%
    ),
    var(--void-deep);
}

.number-hero::before {
  /* 极弱的星图噪点纹理 */
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,...");  /* SVG 噪点 */
  opacity: 0.03;
  pointer-events: none;
  mix-blend-mode: screen;
}
```

### 5.2 SmartSearchBar — 探索的入口

> 既要让用户感到这是"严肃工具"，又要有发现的趣味。

```
┌───────────────────────────────────────────────────┐
│  ◈   Enter a number or word to decode...      →  │
└───────────────────────────────────────────────────┘
   ↑                                             ↑
   左侧符号                                  动作按钮
   vellum-500                              悬停时金色发光
```

**形态规则：**
- 高度：64px（足够大，但不夸张）
- 圆角：4px（克制的圆角，避免"圆滚滚的卡片"感）
- 边框：1px solid `--stroke-default`
- 聚焦态：边框变为 `--stroke-active`，外发光 `--glow-vellum`，**带 200ms 缓出过渡**
- 字体：JetBrains Mono（让用户输入时也感到在"操作仪器"）
- 占位符：`--ink-muted`，italic
- 智能识别：纯数字输入时，左侧符号变为数字风格的 ◇；含字母时，变为 ✦

### 5.3 Gematria 数值卡片

```
┌──────────────────────────────────────────────────────┐
│  GEMATRIA · MISPAR HECHRACHI                          │  ← Eyebrow
│                                                      │
│  3 5 8                                               │  ← Mono 64px, vellum-300
│                                                      │
│  Hebrew · Standard Method                             │  ← ink-secondary
│                                                      │
│  ─────                                               │
│                                                      │
│  Same Value: Mashiach (Messiah) · Nachash (Serpent)  │  ← 同值词，italic
└──────────────────────────────────────────────────────┘
```

**纪律：**
- 每张卡片必须明确标注 cipher 系统名称（Eyebrow 风格）
- 数字使用 Mono，64px，与正文形成强烈对比
- 同值词使用 Cormorant italic，呼应古籍研究的氛围
- 卡片之间不靠投影区分，靠 `1px solid --stroke-hairline`

### 5.4 来源标注 Badge — Gematria vs Angel Number 的"礼貌徽章"

> 这是产品的关键诚信元素：让用户清楚每段解读来自哪个体系。

```
[ GEMATRIA · CALCULATION ]      ← 客观计算，金色徽章
[ NUMEROLOGY · PERSPECTIVE ]    ← 数字命理视角，紫色徽章
[ ANGEL NUMBER · INTERPRETATION ] ← 灵性解读，紫罗兰
[ BIBLICAL · CROSS-REFERENCE ]  ← 圣经引用，深古铜
```

**视觉规则：**
- 徽章为胶囊形，padding 4px 12px
- 字号 `--type-xs`，全大写，字距 `--tracking-eyebrow`
- 边框为 1px solid，颜色与文字色一致但 opacity 0.4
- 不同来源使用不同色调（但保持低饱和）：
  - Gematria → `--vellum-500`
  - Angel Number → `--cloister-300`
  - Numerology → `--hue-iris`
  - Biblical → `--vellum-700`

### 5.5 Tab 切换（Love / Career / Money / Spiritual）

避开常见的"按钮组"，使用**编辑式底部下划线 Tab**：

```
  ❤  Love      ◈  Career      ✦  Money      ❋  Spirit
  ─────────                                              ← 激活下划线为 vellum
                                                            其他无下划线
```

- Tab 不使用方块按钮，使用纯文字 + 符号
- 符号优先于 emoji（神秘感来自克制）
- 激活态：文字变 `--ink-pure`，下划线 `--vellum-500`，1px 高
- 切换动画：下划线 sliding（300ms cubic-bezier(0.4, 0, 0.2, 1)）

### 5.6 可折叠区块（OptionalInterpretation）

```
┌─────────────────────────────────────────────────┐
│ [ NUMEROLOGY · PERSPECTIVE ]              ▾    │  ← Badge 风格
│ Root Number Calculation                          │
│ ─────────────────────────────────────────────  │
│                                                 │
│  4 + 4 + 4 = 12     1 + 2 = 3                  │
│                                                 │
│  Number 3 represents creative expression...    │
└─────────────────────────────────────────────────┘
```

**展开/折叠动画：**
- 使用 `max-height` + `opacity` 的组合过渡
- 时长 350ms，缓动 cubic-bezier(0.32, 0.72, 0, 1)
- 折叠时上方 chevron (▾→▸) 旋转 -90deg

### 5.7 按钮系统

```
┌────────────────────────┐
│  Decode Full Meaning → │   ← Primary: vellum-500 描边 + 金色文字
└────────────────────────┘     悬停: 边框变实，背景微金 (alpha 0.08)

┌────────────────────────┐
│   Get AI Reading       │   ← Secondary: 纯文字 + 下划线
└────────────────────────┘     ✦ 装饰符替代箭头

──────  Read more  ──────    ← Tertiary: 居中文字 + 两侧细线
```

**关键纪律：**
- 主按钮**绝不**使用实色填充，使用描边 + 微弱底色，更接近"印章"质感
- 圆角统一为 2px（极小的圆角，接近矩形，呼应古籍方框感）
- Hover 态用 200ms 过渡，而非瞬时变化

---

## 6. 图标与符号系统

### 6.1 弃用 Emoji，启用古典符号

| 类别 | 弃用 | 启用 |
|------|------|------|
| 装饰星 | ⭐ ✨ | ✦ ✧ ❋ ✺ |
| 心 | ❤️ | ♡ ❥ |
| 几何 | 🔷 | ◈ ◇ ◆ |
| 太阳/光 | ☀️ | ☉ ❂ |
| 月亮 | 🌙 | ☾ ☽ |
| 数字标记 | 1️⃣ | ❶ Ⅰ ① |

### 6.2 自定义图标

- 线条粗细统一为 1.25px
- 24×24 viewBox，留 2px padding
- 端点使用 `stroke-linecap: round`
- 颜色继承父元素 `currentColor`

---

## 7. 动效语言 (Motion)

### 7.1 动效哲学

> *"动效应当被察觉，而非被注意。"*
>
> 动效服务于"揭示"——让信息从黑暗中显现。绝不为动而动。

### 7.2 缓动曲线

```css
:root {
  /* 标准过渡 */
  --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);

  /* 进入：从无到有，柔和 */
  --ease-enter:      cubic-bezier(0, 0, 0.2, 1);

  /* 离开：果断 */
  --ease-exit:       cubic-bezier(0.4, 0, 1, 1);

  /* 揭示：仪式感的"展开" */
  --ease-reveal:     cubic-bezier(0.32, 0.72, 0, 1);

  /* 时长 */
  --duration-instant: 100ms;
  --duration-fast:    200ms;
  --duration-normal:  300ms;
  --duration-slow:    500ms;
  --duration-ritual:  800ms;   /* 仅用于页面入场 */
}
```

### 7.3 关键动效场景

**A. 页面入场（仅首次访问）**

数字 Hero 入场分三幕：

```
0ms     → Eyebrow "Angel Number" 浮现 (opacity 0→1, y +8→0)
200ms   → 数字 444 浮现，伴随极弱的金色光晕扩散
600ms   → 短语 "Protection · Stability" 浮现
800ms   → 装饰分隔线由中心向两侧绘制 (scale-x: 0→1)
1000ms  → 段落正文淡入
```

实现：使用 CSS `animation-delay` 错峰，**绝不使用 JavaScript 动画**做静态内容。

**B. 数字打字动画（首页搜索框聚焦时）**

占位符以"打字"方式循环展示样例：
```
"Enter a number or word..."  →  "444"  →  "Jesus"  →  "11:11"  →  "Sarah"
```
速度：每字 80ms，词间停顿 1500ms。**绝不**使用闪烁光标，仅使用细的下划线作为光标。

**C. 数字数值切换（计算器实时计算）**

数字变化时使用**滚动数字**效果（类似机械里程表），200ms 完成。
不要使用 fade，会让用户感到延迟。

**D. 悬停态**

- 卡片悬停：边框颜色过渡 200ms，**不使用** transform: translateY 上浮（俗）
- 按钮悬停：背景色 alpha 200ms 缓出
- 链接悬停：下划线从左向右绘制（width: 0 → 100%, 250ms）

**E. 滚动揭示**

使用 `IntersectionObserver`，元素进入视口时：
- opacity: 0 → 1
- transform: translateY(16px) → translateY(0)
- 时长 600ms，缓动 `--ease-reveal`
- **关键**：每次滚动只揭示**一组**内容，不要全屏元素同时揭示

### 7.4 反对的动效

- ❌ 闪烁的星星 / 旋转的水晶球
- ❌ 鼠标跟随的拖尾效果
- ❌ 滚动视差（除非极克制，且仅在 Hero 区）
- ❌ 数字"摇摆"或"抖动"（破坏数学的庄严）
- ❌ 自动播放的视频背景

---

## 8. 视觉氛围与背景 (Atmosphere)

### 8.1 噪点纹理 (Grain)

整个产品在 `body` 层级叠加一层 **3% opacity 的有机噪点**，模拟旧纸或胶片质感。这是产品最重要的"氛围层"。

```css
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("/grain.svg");  /* 256x256 SVG noise */
  background-size: 256px 256px;
}
```

浅色模式下噪点依然保留，但从“深空胶片颗粒”切换为“纸张纤维”。混合模式用 `multiply`，透明度略高但颜色更暖，避免把页面压成灰色。

```css
.light .observatory-theme::after {
  opacity: 0.045;
  mix-blend-mode: multiply;
  background-image:
    radial-gradient(circle at 17px 23px, rgba(81, 64, 34, 0.24) 0 0.55px, transparent 0.8px),
    radial-gradient(circle at 71px 113px, rgba(176, 138, 58, 0.18) 0 0.45px, transparent 0.7px);
  background-size: 128px 128px, 192px 192px;
}
```

### 8.2 星图背景（仅首页 Hero）

首页顶部使用一张**极淡的星图 SVG**作为背景，颗粒状 0.5-1.5px 圆点，不规则分布，opacity 0.15-0.4 渐变。

浅色模式的星图不应模拟夜空，而应像古籍边注或天文学手稿上的细线：使用 `--stroke-hairline`、`--ink-whisper` 和极淡 `--vellum-700`，opacity 控制在 0.08-0.18。线条可见即可，不做发光。

绝对禁止：
- 视频星空（性能差，且俗气）
- 闪烁动画（廉价感）
- 流星划过特效
- 浅色模式下使用蓝紫渐变星空背景（会破坏古籍纸面气质）

### 8.3 分隔元素

抛弃 `<hr>` 的标准实现，使用三种装饰分隔：

**装饰分隔线 A — 仪式感分隔：**
```
─────── ✦ ───────
```

**装饰分隔线 B — 章节边界：**
```
·  ·  ·
```

**装饰分隔线 C — 卡片内分隔（细线）：**
```
─────────────────────
```
1px solid `--stroke-hairline`，两端 fade-out（使用 mask-image）

```css
.divider-fade {
  height: 1px;
  background: var(--stroke-default);
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 20%,
    black 80%,
    transparent 100%
  );
}
```

---

## 9. 内容呈现规范 (Content Patterns)

### 9.1 数字详情页内容序列

> 每个 angel number 详情页都遵循一个**仪式化的阅读节奏**：

```
1. ◈ Hero — 数字 + 一句话本质
   ↓ (96px gap)
2. ✦ Pull Quote — 一段编辑式引言（Cormorant italic）
   ↓ (64px gap)
3. Tabs — Love / Career / Money / Spiritual
   ↓ (64px gap)
4. [ GEMATRIA ] — 客观数值层
   ↓ (48px gap)
5. [ NUMEROLOGY ] — 视角层
   ↓ (48px gap)
6. [ AI READING ] — 召唤 CTA（金色描边）
   ↓ (64px gap)
7. [ BIBLICAL ] — 引用层
   ↓ (64px gap)
8. Related Numbers — 数字星座
   ↓ (48px gap)
9. FAQ
   ↓ (64px gap)
10. ❋ Affirmation — 闭合仪式（大字 italic）
```

### 9.2 文案语气 (Voice)

> *"像博物馆策展人，不像占卜师。"*

| ✅ 这样写 | ❌ 不这样写 |
|----------|-----------|
| "Number 444 has appeared in your path." | "OMG! 🎉 You're seeing 444! ✨✨✨" |
| "Three pillars of unseen scaffolding." | "Your guardian angels are SO close right now!!!" |
| "Across traditions, four signifies foundation." | "The universe wants you to know..." |
| "Some find resonance; others do not." | "This is 100% true for everyone!" |
| "Consider this perspective." | "Trust the signs!!!" |

**关键规则：**
- 不滥用感叹号（每页最多 1 个，且仅在 affirmation）
- 不使用 emoji 装饰文字
- 保留怀疑空间："Some traditions hold..." 而非 "It is known that..."
- 数字用阿拉伯数字（4），不用单词（four），呼应产品的"数字工具"定位

### 9.3 数字格式

```
✅ 444                     （数字本身）
✅ 444 · Protection        （数字 + 含义，用 · 而非 - 或 :）
✅ Mispar Hechrachi        （专有名词保留原文）
✅ 4 + 4 + 4 = 12 → 1 + 2 = 3   （计算用 → 表达递归）

❌ four hundred forty-four
❌ 444 (Protection)
❌ 4+4+4=12, 1+2=3
```

---

## 10. 响应式设计 (Responsive)

### 10.1 断点

```css
/* Mobile First */
--bp-sm:   640px;    /* 大手机横屏 */
--bp-md:   768px;    /* 平板竖屏 */
--bp-lg:   1024px;   /* 平板横屏 / 小桌面 */
--bp-xl:   1280px;   /* 标准桌面 */
--bp-2xl:  1536px;   /* 大桌面 */
```

### 10.2 移动端适配纪律

> 移动端不是桌面端的简化，是**重新构图**。

**关键调整：**

| 元素 | Desktop | Mobile |
|------|---------|--------|
| Hero 数字 | 192px | 128px |
| 章节标题 | 56px | 36px |
| 正文行长 | 680px | 全宽 |
| Tab 切换 | 完整展开 | 横向滚动，左右渐隐 |
| 数字网格 | 4 列 | 2 列 |
| 边距 | 64px | 20px |
| 卡片内距 | 32px | 20px |

**移动端额外纪律：**
- 触摸目标至少 44×44px
- 长文字段落两端对齐改为左对齐（避免移动端窗口过窄导致字距过大）
- 动效时长缩短 20%（移动端用户期望更快）

---

## 11. 可访问性 (Accessibility)

### 11.1 WCAG AA 合规

- 正文文字与背景对比度 ≥ 4.5:1
- 大字与背景对比度 ≥ 3:1
- 焦点态使用 2px solid `--vellum-500` outline，offset 2px
- 所有交互元素键盘可达，Tab 顺序逻辑

### 11.2 减弱动效偏好

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

仅保留必要的功能性动效（如 Tab 切换的下划线滑动），所有装饰性动效全部禁用。

### 11.3 屏幕阅读器

- 装饰性符号（✦ ◈）使用 `aria-hidden="true"`
- 数字 Hero 中的数字加 `aria-label="Angel Number 444"`
- 来源 Badge 使用 `<span role="note">`

---

## 12. 设计禁区清单 (Anti-Patterns)

> 以下是**绝对不允许**出现在产品中的设计元素：

### 12.1 配色禁区
- ❌ 紫色到粉色的渐变
- ❌ 任何霓虹色 (#FF00FF, #00FFFF 等)
- ❌ 彩虹色调
- ❌ 纯白 (#FFFFFF) 背景或文字（用 #F4F1E8 替代）
- ❌ 纯黑 (#000000)（用 #07070C 替代）

### 12.2 字体禁区
- ❌ Inter, Roboto, Arial, Helvetica（AI 默认）
- ❌ Comic Sans, Papyrus（恶俗）
- ❌ 所有手写体伪装的"魔法字体"
- ❌ 装饰性 Display 字体用作正文

### 12.3 元素禁区
- ❌ Emoji 用作 UI 图标（仅可在用户生成内容中出现）
- ❌ 水晶球 / 塔罗牌 / 占星符号的具象图形
- ❌ 闪烁、抖动、跳动的动画
- ❌ 自动播放的视频或音频
- ❌ 弹出式 cookie banner / chatbot 气泡（必要时也用极简形态）
- ❌ "Limited time offer!" 倒计时器
- ❌ 用户头像轮播（"15K people are reading"）

### 12.4 文案禁区
- ❌ "Unlock your destiny!"
- ❌ "The universe is sending you a sign!"
- ❌ "100% accurate readings!"
- ❌ "You won't believe what 444 means..."
- ❌ 任何 clickbait 风格

---

## 13. 设计验收清单 (Design QA)

每个页面上线前需通过以下检查：

### 13.1 第一眼检查
- [ ] 是否能在 3 秒内识别这是"Angel Number Decoder"而非通用 SaaS？
- [ ] 数字是否是视觉中心？
- [ ] 是否避开了所有"horoscope.com 美学"陷阱？

### 13.2 设计系统一致性
- [ ] 所有颜色都来自 CSS Variables，没有硬编码 hex？
- [ ] 字体只使用 Cormorant / IBM Plex / JetBrains Mono？
- [ ] 间距全部使用 `--space-*` token？
- [ ] 没有任何 emoji 用作 UI 图标？

### 13.3 内容诚信
- [ ] 每段解读都标注了来源体系（Gematria / Angel Number / Numerology / Biblical）？
- [ ] Gematria 的客观计算和 Angel Number 的主观解读视觉上有区分？
- [ ] 文案是否避开了占卜师腔调？

### 13.4 性能
- [ ] LCP < 1.5s？
- [ ] 字体加载无 FOUT？
- [ ] 动效尊重 `prefers-reduced-motion`？

### 13.5 移动端
- [ ] 在 375px 宽度下数字仍然是视觉主角？
- [ ] 触摸目标 ≥ 44×44px？
- [ ] 文字行长合理（不超过 75 字符）？

---

## 14. 设计语言总结

> 一句话定义产品的视觉灵魂：

> **"在数字的精确与仪式的诗意之间，建造一座深色的天文台。"**
>
> *"To build a dark observatory between the precision of numbers and the poetry of ritual."*

### 14.1 三条铁律

1. **数字是主角，一切设计为数字让路。**
   每一页的视觉重心永远是数字本身。颜色、字体、留白都在服务数字的"显灵"。

2. **客观与主观必须视觉可分。**
   Gematria 计算（客观）与 Angel Number 解读（主观）通过 Badge、色彩、容器明确区分。我们尊重用户的智识。

3. **克制即神秘。**
   真正的神秘感来自留白、暗色、节制的金光，而非堆砌符号。每多一个装饰元素，神秘感就减少一分。

### 14.2 与同行的对比定位

```
                    Refined ↑
                            │
                            │  ⊙ Linear
                            │  ⊙ Aesop
                  US ⊙─────┼─────⊙ Cypher Numerology
                            │
                            │
       Modern ←─────────────┼─────────────→ Classical
                            │
                            │  ⊙ Numerology blogs
                            │
                            │
                            │  ⊙ Gematrix.org
                            │  ⊙ Horoscope sites
                    Generic ↓
```

我们的目标坐标：**Refined × 略偏 Classical**，是同类产品中唯一占据这个象限的存在。

---

*文档版本: v1.0 · 创建日期: 2026-05-04*
*与产品设计方案 v2.0 配套使用*

---

> *"Numbers have a way of taking a man by the hand and leading him down the path of reason."*
> — Pythagoras
