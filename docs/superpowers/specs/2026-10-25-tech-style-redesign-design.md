# 简约科技风改版设计

- 日期：2026-10-25
- 项目：wxSapp（垃圾分类助手，Taro 4.3 + React 18 + TypeScript）
- 分支：`feat/tech-style`（基于已合并知识模块的 `master`）
- 状态：设计已确认，待实施

## 1. 背景与目标

现有全站使用粘土拟态（Claymorphism）：浅蓝底、大圆角、内外阴影、彩色光晕。首页只有搜索框、四类入口、知识入口和说明文字，内容偏少；首页底部还挂着横幅广告，第一屏观感较重。

本次改版目标：

- 全站视觉从粘土拟态切换为**浅色极简科技风**。
- 移除首页横幅广告，降低首屏负担。
- 首页新增今日一题、今日贴士、数据速览、热门搜索四个区块。
- 自定义 tabBar 改为**系统 tabBar**，减少自维护代码并恢复原生切换体验。
- 不改变查询、测验、天气、知识模块的功能逻辑。

## 2. 非目标

- 不做深色模式，不做主题切换。
- 不新增页面、不新增后端接口、不新增网络请求。
- 不修改垃圾分类数据、题库数据与 12 篇知识文章内容。
- 不新增权限、不新增本地存储 key。
- 不改动测验页横幅广告与天气页插屏广告。
- 不做复杂动效或自定义动画库。

## 3. 视觉系统

### 3.1 颜色令牌

| 令牌 | 值 | 用途 |
|---|---|---|
| `$tech-bg` | `#f5f7fb` | 页面底色 |
| `$tech-surface` | `#ffffff` | 卡片 |
| `$tech-surface-soft` | `#f0f4ff` | 次级卡片、输入框 |
| `$tech-border` | `#e4e7ec` | 1rpx 描边、分隔线 |
| `$tech-border-strong` | `#d0d5dd` | 强调描边 |
| `$tech-text` | `#101828` | 主文字 |
| `$tech-muted` | `#667085` | 次文字 |
| `$tech-primary` | `#2563eb` | 主色、选中态、按钮 |
| `$tech-primary-deep` | `#1d4ed8` | 按压态、深色强调 |
| `$tech-accent` | `#06b6d4` | 渐变、微标签 |
| `$tech-success` | `#12b76a` | 答对 |
| `$tech-danger` | `#f04438` | 答错 |

分类四色仍沿用官方图标的红/蓝/棕/黑语义，不在正文中用四色大面积铺底。

### 3.2 形状与层次

- 卡片圆角 20rpx；小图标容器 16rpx；标签与胶囊 999rpx。
- 卡片：白底 + 1rpx `$tech-border` + `0 8rpx 24rpx rgba(16, 24, 40, 0.06)`；**不再使用内阴影**。
- 按压态：透明度 0.92 + `transform: scale(0.98)`，150ms ease。
- 分隔线统一 1rpx `$tech-border`。

### 3.3 字体与科技感

- 中文正文 27–30rpx，行高 1.7；标题 32–44rpx，字重 700。
- 数字统一 `font-variant-numeric: tabular-nums`。
- 英文微标签（`SEARCH` / `TODAY` / `DATA` / `KNOWLEDGE`）：20rpx、字重 700、字距 2rpx、颜色 `$tech-accent`。
- 科技感来自细线、留白、等宽数字、微标签与局部网格，不使用发光、霓虹和大面积渐变。

### 3.4 样式层

新增 `src/styles/tech.scss`：

```scss
$tech-bg: #f5f7fb;
$tech-surface: #ffffff;
$tech-surface-soft: #f0f4ff;
$tech-border: #e4e7ec;
$tech-border-strong: #d0d5dd;
$tech-text: #101828;
$tech-muted: #667085;
$tech-primary: #2563eb;
$tech-primary-deep: #1d4ed8;
$tech-accent: #06b6d4;
$tech-success: #12b76a;
$tech-danger: #f04438;

@mixin tech-card($radius: 20rpx) {
  background: $tech-surface;
  border: 1rpx solid $tech-border;
  border-radius: $radius;
  box-shadow: 0 8rpx 24rpx rgba(16, 24, 40, 0.06);
}

@mixin tech-inset($radius: 16rpx) {
  background: #f9fafb;
  border: 1rpx solid $tech-border;
  border-radius: $radius;
}

@mixin tech-button($bg: $tech-primary, $glow: rgba(37, 99, 235, 0.22)) {
  background: $bg;
  border-radius: 999rpx;
  box-shadow: 0 8rpx 18rpx $glow;
}

@mixin tech-pressed($radius: 16rpx) {
  border-radius: $radius;
  background: #f2f4f7;
}
```

所有页面从 `@import '../../styles/clay.scss'` 切换为 `tech.scss`；全部迁移完成后删除 `src/styles/clay.scss`。

## 4. 页面结构

### 4.1 首页（`pages/index`）

空闲态自上而下：

1. **品牌头**：`垃圾分类助手` + `上海标准` 胶囊 + 当前日期（`M月D日 周X`）。
2. **搜索框**：白底、1rpx 描边、左侧放大镜、右侧清除；聚焦逻辑不变。
3. **四大分类**：2×2 白卡。左侧 96rpx 官方分类图标（沿用 `ico-1..4`），右侧名称 + 英文小标（`WET / DRY / RECYCLE / HAZARDOUS`）+ 箭头；点击进入分类详情。
4. **今日一题**：`TODAY` 微标签 + 题目 + 四个分类选项；点选后正确项变绿、错误项变红并显示解析；提供“再来一题”；底部“去测验”跳转 `pages/test/test`。
5. **今日贴士**：`TODAY` 微标签 + 知识文章 `takeaway` + 主题标签 + “阅读全文 ›”，跳转对应知识详情。
6. **数据速览**：三格等宽数字条 `分类数据 N 条` / `科普文章 12 篇` / `分类标准 4 类`；数字动态统计。
7. **热门搜索**：6 个 chips，点击直接查询。
8. **知识入口**：白卡 + 蓝色渐变图标 + `KNOWLEDGE` 微标签 + “垃圾去哪了？” + 副标题 + 箭头。
9. **工具说明**：保留原文案，改为细线卡片。
10. **分享按钮**：右下角圆形固定按钮，样式改为科技风。

搜索聚焦、有搜索结果、分类结果弹窗时，第 3–9 项全部隐藏；搜索、历史、热门搜索交互逻辑不变。

**移除**首页 `<Ad>` 组件、`.ad-wrap` 样式与 `Ad` 导入。

### 4.2 分类详情（`pages/detail`）

- 顶部：官方分类图标 120rpx + 分类名 + 简短描述。
- “主要内容”“投放要求”改为白卡 + 左侧 4rpx 主题色竖线。
- “延伸阅读”保留两篇，改为细线列表卡。
- 导航栏底色改为 `#f5f7fb`。

### 4.3 测验（`pages/test`）

- 题卡：白底、细描边；四类选项为细边框卡片，选中态蓝色描边。
- 结果单：细分隔线；对错用 `$tech-success` / `$tech-danger`。
- 首页按钮、分享按钮、错题弹层同步换色。
- 交互、错题本、连续天数逻辑完全不变；**保留测验横幅广告**。

### 4.4 天气（`pages/forecast`）

- Hero 改为浅蓝到浅青的渐变玻璃卡（`#eef4ff → #e6fbff`），去掉粘土阴影。
- 小时预报、当前指标、7 天预报保留现有结构，改为白卡 + 细线。
- **保留插屏广告**及其现有触发逻辑。

### 4.5 知识列表 / 知识详情（`pages/knowledge`）

- 列表：筛选 chips 改为描边胶囊，选中蓝底白字；文章卡改为白底细线，主题标签用浅色底。
- 详情：标题、小节标题使用左侧 4rpx 蓝色竖线；数据卡白底；提示卡用主题色 8% 透明度底。
- 收藏、小测、相关阅读、分享逻辑不变。

### 4.6 系统 tabBar

- `src/app.config.ts` 的 `tabBar` 去掉 `custom: true`，改为系统 tabBar：

```ts
tabBar: {
  color: '#667085',
  selectedColor: '#2563eb',
  backgroundColor: '#ffffff',
  borderStyle: 'white',
  list: [/* 首页 / 测验 / 预报，沿用现有图标 */]
}
```

- 删除 `src/custom-tab-bar/` 目录（`index.tsx`、`index.scss`）。
- 删除首页 `useDidShow` 中的 `Taro.eventCenter.trigger('sync-tabbar')`，并移除不再使用的 `useDidShow` 导入。
- 页面底部间距按系统 tabBar 收紧（系统 tabBar 不占页面视口）：
  - 首页容器 padding-bottom：`200rpx → 120rpx`。
  - 首页分享按钮 bottom：`190rpx → 60rpx`。
  - 测验容器 padding-bottom：`168rpx → 80rpx`。
  - 测验分享按钮 bottom：`360rpx → 60rpx`。
  - 知识详情容器 padding-bottom：`180rpx → 160rpx`（仍为固定收藏按钮留空间）。
  - 以上均保留 `env(safe-area-inset-bottom)`。

## 5. 首页新组件与数据流

### 5.1 组件

| 组件 | Props | 职责 |
|---|---|---|
| `DailyQuiz` | 无 | 抽题、判对错、显示解析、再来一题、去测验 |
| `DailyTip` | `article: KnowledgeArticle; onOpen: (id: string) => void` | 展示 takeaway 与主题，点击打开文章 |
| `DataStrip` | `stats: Array<{ label: string; value: string }>` | 三格数字条 |
| `HotSearches` | `words: string[]; onPick: (word: string) => void` | 热门搜索 chips |

文件位于 `src/components/home/`，每个组件配套同目录 `.scss`。

### 5.2 数据来源

新增 `src/model/home/homeData.ts`：

- `getDayKey(date): string`：本地日期 `YYYY-MM-DD`。
- `getDayHash(key): number`：字符滚动哈希，纯函数。
- `getDailyTipKey(date): string`：`getDayHash % articles.length` 取文章 id。
- `getQuizItems(): Array<{ name: string; category: string }>`：展平 `src/static/result.tsx` 的 `result.data`。
- `getDailyQuiz(date, offset = 0)`：`(dayHash + offset) % items.length` 取题。
- `getQuizCount(): number`：题库总数。

题目结构：

```ts
interface DailyQuizItem {
  name: string
  options: string[]   // 湿垃圾 / 干垃圾 / 可回收物 / 有害垃圾
  answer: number      // 0-3，由 category 映射
  explanation: string // `${name} 属于${answerLabel}。`
}
```

- 全部纯本地计算，不发起网络请求。
- “再来一题”通过组件内 `offset` 状态递增取下一题，不持久化。
- 日期异常时 `getDayHash` 返回 0，回退到第 0 条。
- 题库为空时 `DailyQuiz` 与 `DataStrip` 隐藏；知识文章为空时 `DailyTip` 隐藏。

### 5.3 首页集成

首页空闲态渲染新增区块，数据在组件内或页面内一次性计算；不新增存储、不改动搜索请求逻辑。

## 6. 合规与约束

- 个人主体：无评论、投稿、UGC、视频、直播、付费、排行榜、时政/行业资讯。
- 不新增外部图片与外链；分类图标沿用现有本地资源。
- 首页移除广告；测验与天气广告保留，位置与触发方式不变。
- 不新增权限；不采集用户信息。
- 所有面向用户文案使用中文；英文仅作微标签。

## 7. 错误处理

- 题库或知识数据为空：隐藏对应区块，页面其余部分正常。
- 日期解析失败：回退到索引 0。
- 题库条目分类字段异常：`answer` 回退为 0。
- 搜索、天气、测验、知识模块原有错误处理保持不变。

## 8. 文件结构

```
src/styles/tech.scss                新增
src/styles/clay.scss                全部迁移后删除

src/components/home/
  DailyQuiz.tsx / DailyQuiz.scss    新增
  DailyTip.tsx / DailyTip.scss      新增
  DataStrip.tsx / DataStrip.scss    新增
  HotSearches.tsx / HotSearches.scss 新增

src/model/home/homeData.ts          新增

src/pages/index/index.tsx           改：首页结构、移除广告与 sync-tabbar
src/pages/index/index.scss          改：科技风 + 新组件样式引用
src/pages/detail/detail.*           改：科技风
src/pages/test/test.*               改：科技风、底部间距
src/pages/forecast/forecast.*       改：科技风
src/pages/knowledge/index.*         改：科技风
src/pages/knowledge/detail.*        改：科技风、底部间距
src/custom-tab-bar/                 删除
src/app.config.ts                   改：系统 tabBar、导航栏配色
src/pages/*/**.config.ts            改：导航栏底色
```

## 9. 验收清单

- [ ] 首页空闲态显示品牌头、搜索、四类入口、今日一题、今日贴士、数据速览、热门搜索、知识入口、工具说明。
- [ ] 搜索聚焦、有结果或分类弹窗时，新增区块全部隐藏且无布局跳动。
- [ ] 今日一题答对/答错反馈与解析正确，“再来一题”换题，“去测验”跳转正确。
- [ ] 今日贴士点击进入对应知识文章。
- [ ] 数据速览的分类数据数量与题库实际条数一致。
- [ ] 热门搜索点击后直接查询。
- [ ] 首页不再出现广告组件；测验横幅与天气插屏仍正常。
- [ ] 系统 tabBar 显示首页/测验/预报三项，选中蓝色，切换正常，页面底部无遮挡。
- [ ] 全站无粘土样式残留，无 `clay.scss` 引用。
- [ ] `npm run typecheck` 通过，`npm run build:weapp` 成功。
- [ ] 无新增外链、外部图片、网络请求、权限与存储 key。

## 10. 已知取舍

- 系统 tabBar 放弃自定义毛玻璃与异形布局，换取原生切换体验和更少维护代码。
- 首页移除广告会减少一处广告收入，换取更轻的首屏。
- 今日一题与今日贴士按日期确定性轮换，同一天内内容稳定，不做个性化。
- 新旧样式并存迁移期间保留 `clay.scss`，全部页面迁移完成后删除。
