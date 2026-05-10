# Block Out! 攻略站 — On-Page SEO 规范

> 基于 Ahrefs On-Page SEO Guide 的最佳实践
> https://ahrefs.com/blog/on-page-seo/

## Ahrefs 核心原则

### 1. Title Tag（最重要的排名因素）
- **长度**：不超过 70 字符（65 最佳）
- **格式**：目标关键词靠前 | 价值主张 | 品牌
- **每页唯一**，不重复
- **匹配搜索意图**：用户搜什么就提供什么
- **ABC 公式**：Adjective（形容词）+ Benefit（利益点）+ Confidence（可信度）
- **示例**：
  - ✅ `Block Out! Level 42 通关攻略 | 3分钟速通技巧`
  - ✅ `Block Out! Level 42 Solution Walkthrough - Easy Guide`
  - ❌ `Level 42`（太短，无描述）

### 2. Meta Description
- **长度**：不超过 160 字符
- **功能**：非排名因素，但影响点击率（Google 37% 场景会用）
- **写法**：扩展 Title，主动语态，包含关键词（Google 会加粗），匹配意图
- **示例**：
  - ✅ `Stuck on Block Out! Level 42? Watch the video solution + get 3 expert tips. Color sorting puzzle made easy.`

### 3. URL 结构
- 短而描述性：`/en/level/42/` ✅
- 包含关键词
- 连字符分隔，不用下划线
- 尾部斜杠保持一致

### 4. 内容结构（H1 → H2 → H3）
- **每页一个 H1**（= Title 的同义表达）
- **H2 用于主要论点**（每个大章节）
- **H3+ 用于支撑细节**（例子、具体技巧）
- 关键词出现在部分 H2/H3 中（不是全部）

### 5. 关键词放置位置（必须出现）
| 位置 | 说明 |
|------|------|
| Title Tag | 尽量靠前 |
| URL | 关键部分 |
| H1 | 必须包含 |
| Intro 段落 | 前 100 字以内 |
| 部分 H2/H3 | 自然融入 |
| 图片 Alt | 描述性，含关键词变体 |
| 内链锚文本 | 链接到相关页面 |

### 6. 搜索意图匹配
- 用户搜 `block out level 42 solution` → 给视频 + 图文步骤 ✅
- 用户搜 `block out tips` → 给攻略文章 ✅
- 用户搜 `block out game` → 给首页 + 游戏介绍 ✅
- **不匹配** = 排名差，不管优化多好

### 7. 内容深度（EEAT 信号）
- 覆盖话题的**全面性**（不只一个关键词，而是相关概念）
- LLM/AI 搜索（ChatGPT, Perplexity）优先引用**内容全面的页面**
- 每关至少 300 字内容（视频+描述+技巧+步骤）
- 相关问题和答案覆盖

### 8. 图片 SEO
- AVIF 格式（R2 CDN）
- 每个 `<img>` 有 `alt` 文本
- Alt 文本描述性：`Block Out! Level 42 puzzle starting position`
- 懒加载：`loading="lazy"`
- 响应式：`srcset` + `sizes`

### 9. 内部链接策略
- 每个页面链接到 3-5 个相关页面
- 关卡页：前 3 关 + 后 3 关 + 攻略首页
- 博客：文中自然嵌入相关关卡链接
- 用描述性锚文本，不用"点击这里"

### 10. AI 搜索可见性
ChatGPT/Perplexity 选择引用来源时看:
1. URL
2. Title
3. Snippet（通常 = Meta Description）
4. 排名位置
5. 元数据（发布日期）
→ 以上 5 项 4 项是 on-page SEO → **依然重要**

## 每页 SEO 检查清单
- [ ] 唯一 Title（≤70字符）
- [ ] Meta Description（≤160字符）
- [ ] 一个 H1 标签
- [ ] 关键词在 URL 中
- [ ] 关键词在 Intro 段
- [ ] 关键词在部分 H2 中
- [ ] Canonical URL
- [ ] hreflang 多语言
- [ ] OG/Twitter 标签
- [ ] Schema markup（HowTo/Article）
- [ ] 图片 Alt 文本
- [ ] 内链 3-5 个
- [ ] 内容 ≥300 字
- [ ] 面包屑导航
- [ ] 移动端友好
- [ ] 页面加载速度

---

## 针对关卡页的 Title 公式（来自 seo-geo-claude-skills）

参考 `.claude/skills/meta-tags-optimizer/references/meta-tag-formulas.md`

| 页面类型 | 公式 | 示例 |
|---------|------|------|
| 普通关卡 | `Block Out! Level [N] Solution - [Difficulty] Guide` | `Block Out! Level 42 Solution - Medium Difficulty Guide` |
| 新手关卡 | `How to Beat Block Out! Level [N] (Easy Steps)` | `How to Beat Block Out! Level 11 (Easy Steps)` |
| Super Hard | `Block Out! Super Hard Level [N] Walkthrough [Year]` | `Block Out! Super Hard Level 19 Walkthrough 2026` |
| 合集页 | `Block Out! Levels [A]-[B] Walkthrough Collection` | `Block Out! Levels 41-50 Walkthrough Collection` |
| 中文关卡 | `Block Out! 第[N]关通关攻略 | [难度]图解` | `Block Out! 第42关通关攻略 | 中等难度图解` |

### Meta Description 模板

| 类型 | 模板 |
|------|------|
| 普通关卡 | `Stuck on Block Out! Level [N]? Watch the video solution + get [N] expert tips. [Difficulty] color sorting puzzle.` |
| 新手关卡 | `New to Block Out!? Level [N] is easy with our guide. [N] simple steps to clear all blocks.` |
| 合集 | `Complete walkthrough for Block Out! Levels [A]-[B]. Video solutions for each level + tips and strategies.` |

### Schema 决策树（参考 .claude/skills/schema-markup-generator）

| 页面类型 | 主要 Schema | 附加 |
|---------|------------|------|
| 关卡页 | HowTo + VideoObject + BreadcrumbList | FAQ |
| 首页 | WebSite + SearchAction + Organization | BreadcrumbList |
| 博客 | Article + BreadcrumbList | FAQ, HowTo |
| FAQ 页 | FAQPage | Article |

### 关卡页内容结构（SEO Content Writer 模板）

每个关卡页必须按此结构组织内容：

```
H1: Block Out! Level [N] Solution
  ├─ H2: Level [N] Overview（含关键词）
  │   ├─ 关卡截图
  │   ├─ 难度评级
  │   └─ 关卡描述（30-50字）
  ├─ H2: Video Walkthrough
  │   └─ YouTube 16:9 嵌入
  ├─ H2: Step-by-Step Guide
  │   ├─ Step 1: ...
  │   ├─ Step 2: ...
  │   └─ Step 3: ...
  ├─ H2: Pro Tips（3-5条）
  ├─ H2: Common Mistakes to Avoid
  └─ H2: Related Levels
      ├─ ← Level [N-1]
      └─ Level [N+1] →
```

### CTR 优化技巧

| 元素 | 提升效果 | 应用 |
|------|---------|------|
| Title 加数字 | +15-25% CTR | `Level 42` → `Level 42 - 3 Easy Steps` |
| 加年份 | +10-15% CTR | `2026 Walkthrough` |
| 加括号 | +10-38% CTR | `(Easy Guide)` |
| 加 power word | +5-12% CTR | `Master`, `Pro`, `Easy`, `Ultimate` |

## 2. 每个页面必须有的 SEO 元素

### 首页 (/)
```html
<title>Block Out! - Color Sort Puzzle 攻略指南 | 全部关卡通关视频</title>
<meta name="description" content="Block Out! (Grand Games) 全关卡攻略视频合集。包含 Levels 1-500+ 的通关解法、技巧提示、关卡难度评级。每日更新最新关卡攻略。">
<link rel="canonical" href="https://blockout.cc/en/" />
<meta property="og:title" content="Block Out! - Color Sort Puzzle Walkthrough Guide">
<meta property="og:description" content="Complete walkthrough for all Block Out! levels. Video solutions, tips, and strategies.">
<meta property="og:image" content="https://images.blockout.cc/hero-bg.avif">
<meta property="og:url" content="https://blockout.cc/">
<meta name="twitter:card" content="summary_large_image">
```

### 关卡页 (/level/42/)
```html
<title>Block Out! Level 42 通关攻略 | 颜色分类解谜技巧</title>
<meta name="description" content="Block Out! Level 42 通关攻略：视频解法 + 3个实用技巧。难度：中等。适合初学者的颜色方块排序攻略。">
<link rel="canonical" href="https://blockout.cc/en/level/42/" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Block Out! Level 42 Solution",
  "description": "Step-by-step guide to solve Block Out! Level 42",
  "totalTime": "PT5M",
  "difficulty": "Medium",
  "video": {
    "@type": "VideoObject",
    "name": "Block Out! Level 42 Walkthrough",
    "description": "Video solution for Block Out! Level 42",
    "embedUrl": "https://www.youtube.com/embed/VIDEO_ID",
    "uploadDate": "2026-04-15"
  }
}
</script>
```

### 博文章 (/blog/guide/)
```html
<title>Block Out! 新手攻略 | 10个必知技巧助你通关 | BlockOut.cc</title>
<meta name="description" content="Block Out! 新手完整攻略：从基础操作到高级技巧。学会颜色方块排序的核心策略，轻松通关所有关卡。">
```

## 2. 页面类型与 SEO 策略

| 页面类型 | 目标关键词 | Title 结构 | H1 |
|---------|-----------|-----------|-----|
| 首页 | block out, color sort puzzle | 「游戏名 + 关键词 + 品牌」 | Block Out! 全关卡攻略 |
| 关卡页 | block out level N, 关卡N | 「Block Out! Level N 攻略 + 描述」 | Block Out! Level N 通关解法 |
| 合集页 | block out levels 11-20 | 「Block Out! Levels 11-20 合集攻略」 | Block Out! Levels 11-20 通关合集 |
| 博客 | block out tips, 新手攻略 | 「攻略主题 + Block Out! + 品牌」 | 文章主标题 |
| 分类页 | block out solutions | 「Block Out! 关卡攻略大全 | 品牌」 | 所有关卡攻略 |

## 3. 结构化数据 (Schema.org)

### 首页 + 全站
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Block Out! Walkthrough Guide",
  "url": "https://blockout.cc",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://blockout.cc/en/level/{search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 关卡页 (HowTo Schema)
每个关卡页必须包含 HowTo Schema：
- name: "Block Out! Level {N} Solution"
- description: 关卡描述
- step: 通关步骤（至少3步）
- supply: 游戏名称
- tool: YouTube 视频
- video: 关联的 VideoObject

### 博文章 (Article Schema)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "标题",
  "description": "摘要",
  "author": { "@type": "Organization", "name": "BlockOut.cc" },
  "datePublished": "2026-05-10",
  "image": "https://images.blockout.cc/article-hero.avif"
}
```

### 面包屑导航 (BreadcrumbList)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://blockout.cc/en/" },
    { "@type": "ListItem", "position": 2, "name": "Level 42", "item": "https://blockout.cc/en/level/42/" }
  ]
}
```

## 4. 技术 SEO

### URL 规范
- 全部小写，连字符分隔
- `/en/level/42/` (尾部斜杠 + 语言前缀)
- 禁止动态参数：`?id=42` ❌
- 多语言：`/en/`, `/zh/`, `/ja/`

### 多语言 hreflang
```html
<link rel="alternate" hreflang="en" href="https://blockout.cc/en/level/42/" />
<link rel="alternate" hreflang="zh" href="https://blockout.cc/zh/level/42/" />
<link rel="alternate" hreflang="x-default" href="https://blockout.cc/en/level/42/" />
```

### 图片 SEO
- 所有 img 标签必须有 alt 属性
- Alt 文本要描述性：`Block Out! Level 42 初始布局 - 红蓝绿方块待排序`
- 使用 AVIF 格式（R2 CDN 加速）
- 图片懒加载：`loading="lazy"`
- 响应式图片：`srcset` + `sizes`

### 内链策略
- 关卡页底部：关联关卡推荐（前3关/后3关）
- 首页：最新攻略 + 热门关卡
- 博客文内：相关关卡链接（自然嵌入）
- 面包屑导航：每个页面都有

### 页面速度
- 所有图片 AVIF + CDN (images.blockout.cc)
- 字体预加载：`<link rel="preload" ...>`
- YouTube 视频懒加载（点击后才加载 iframe）
- critical CSS 内联

## 5. 内容深度要求（过 Google AdSense 审核）

每个关卡页**不能只有视频**，必须包含：

```
1. ✅ 关卡编号 + 标题
2. ✅ YouTube 攻略视频（16:9）
3. ✅ 关卡截图 3-5 张
4. ✅ 难度评级（Easy/Medium/Hard/Super Hard）
5. ✅ 关卡描述（30-50字，包含关键词）
6. ✅ 过关技巧 3-5 条（每条15-30字）
7. ✅ 详细通关步骤（分步说明）
8. ✅ 相关关卡推荐（上下关）
9. ✅ 游戏基本信息
10. ✅ 用户评论区（或 FAQ）
```

页面内容不得少于 300 字（含描述+技巧+步骤）。

## 6. 检查清单

- [ ] 每个页面有唯一 Title + Meta Description
- [ ] 每个页面有 H1 标签
- [ ] 结构化数据 (HowTo/Article/Breadcrumb)
- [ ] Canonical URL
- [ ] hreflang 多语言标签
- [ ] Open Graph 标签
- [ ] Twitter Card 标签
- [ ] 图片 alt 文本
- [ ] 面包屑导航
- [ ] 内部链接（相关关卡）
- [ ] YouTube iframe 懒加载
- [ ] HTML 语义化标签
