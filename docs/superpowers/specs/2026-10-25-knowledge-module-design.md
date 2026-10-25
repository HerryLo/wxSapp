# 垃圾分类知识模块设计

- 日期：2026-10-25
- 项目：wxSapp（垃圾分类助手，Taro 4.3 + React 18 + TypeScript）
- 状态：已确认，待实施

## 1. 背景与现状

wxSapp 目前有三个 tab：首页搜索、测验、天气。首页通过第三方接口查询垃圾名称并展示分类结果，测验提供 10 题随机练习，天气与垃圾分类主题关联较弱。

现有能力解决的是“这是什么垃圾”，但没有回答“分完之后垃圾去了哪里、对环境有什么影响、现在用什么技术处理”。本项目新增一个知识科普模块，与查询、测验形成互补。

项目主体为**个人主体**微信小程序，新增功能必须遵守个人主体的类目与内容审核限制。

## 2. 目标与非目标

### 目标

- 提供 12 篇垃圾分类主题的静态科普文章，覆盖环境风险、处理技术、减量行动三个主题。
- 在首页提供入口，进入知识列表；列表支持主题筛选与收藏。
- 文章详情支持结构化正文、数据卡、提示卡、一句话总结、3 题小测、收藏、相关阅读、分享。
- 在现有四类垃圾详情页增加“延伸阅读”，把查询与知识内容连接起来。
- 全部内容本地静态打包，不依赖后端与第三方接口。

### 非目标

- 不做评论、点赞、用户投稿、社区、排行榜。
- 不做视频、直播、付费内容。
- 不做资讯流、时事新闻、行业动态。
- 不新增 tabBar 项。
- 不做知识库内搜索、目录导航、阅读进度、账号同步。
- 知识页面不接入广告。

## 3. 合规前提（个人主体）

- 保持小程序“工具—信息查询”的定位，知识内容作为工具内的辅助内容，不改变产品主体形态。
- 不出现发布日期、作者署名、“最新/资讯/热点”等资讯化措辞。
- 来源以“机构 + 报告/标准名称 + 年份”的纯文本呈现，不提供外链（个人主体不支持 web-view）。
- 技术描述保持中立，不出现厂商、设备品牌或产品推荐。
- 避免“最”“100%”“彻底”等绝对化表述。
- 列表页与详情页底部展示：“各地分类标准略有差异，具体以当地规定为准。”
- 不新增隐私权限，不采集用户信息；收藏与小测成绩仅存储在本地。
- 图片只使用 emoji 与 CSS，不引入外部图片，避免版权问题。

## 4. 信息架构

```
首页 pages/index
 ├─ 搜索 / 四大类入口（不变）
 └─ [知识科普] 入口卡片
      └─ 知识列表 pages/knowledge/index
           ├─ 主题筛选：全部 / 环境风险 / 处理技术 / 减量行动 / 收藏
           ├─ 推荐卡片 + 文章卡片
           └─ 文章详情 pages/knowledge/detail?id=xxx
                ├─ 正文区块
                ├─ 一句话总结
                ├─ 文末小测（3 题）
                ├─ 收藏
                ├─ 相关阅读
                └─ 分享

分类详情 pages/detail/detail
 └─ 延伸阅读 → 对应文章
```

不新增 tabBar 项。`app.config.ts` 的 `pages` 数组末尾追加：

- `pages/knowledge/index`
- `pages/knowledge/detail`

## 5. 页面设计

### 5.1 首页入口

- 位置：四类垃圾图标下方、工具说明上方。
- 仅在空闲态显示，条件为 `!focused && !search`；搜索聚焦或展示结果时不显示，避免干扰。
- 结构：左侧 emoji 图标块（📚），标题“垃圾去哪了？”，副标题“环境风险 · 处理技术 · 减量行动”，右侧箭头。
- 样式：复用 `clay-surface` 卡片风格，整卡可点击。
- 点击：`Taro.navigateTo({ url: '/pages/knowledge/index' })`。
- 从知识页返回时，首页保持原有状态。

### 5.2 知识列表页

- 顶部标题“垃圾分类知识”，副标题“分完之后，垃圾去了哪里”。
- 横向主题 chips，单选：
  - 全部
  - 环境风险
  - 处理技术
  - 减量行动
  - 收藏（显示数量）
- 文章顺序：按 `articles` 数组顺序展示；`featured: true` 的文章在“全部”筛选下置顶。
- 推荐卡片：仅“全部”筛选下展示 `featured: true` 的文章，使用更大的卡片。
- 普通文章卡片包含：
  - 主题色 emoji 图标块
  - 标题（最多两行）
  - 摘要（最多两行）
  - 元信息：主题标签 · 阅读时长 · 3 题小测
  - 右上角收藏按钮
- 收藏按钮点击时阻止冒泡，切换收藏状态并 toast“已收藏”/“已取消收藏”；在“收藏”筛选下取消收藏后立即从列表移除。
- 空状态：
  - 收藏为空：“还没有收藏，读一篇试试”
  - 筛选结果为空：“这个主题还没有文章”
- 分享：标题“垃圾分类知识”。
- 底部提示：“各地分类标准略有差异，具体以当地规定为准。”

### 5.3 文章详情页

- 顶部：主题标签、标题、阅读时长。
- 正文按区块顺序渲染：
  - `heading`：小节标题
  - `paragraph`：正文段落
  - `list`：无序列表
  - `stats`：2–3 个数据卡横排，自动换行
  - `tip`：主题色浅底提示卡
- 正文之后依次展示：
  1. 一句话总结（独立卡片）
  2. 3 题小测
  3. 相关阅读（2 篇）
  4. 资料来源
  5. 免责提示
- 收藏按钮固定在右下角，位置与首页分享按钮一致；文章底部预留安全区高度。
- 相关阅读点击使用 `Taro.redirectTo`，替换当前页，避免页面栈持续增长。
- 分享：标题为文章标题，路径为 `/pages/knowledge/detail?id=xxx`。
- `id` 无效或文章不存在时，展示“文章不存在”和返回按钮，不渲染其余内容。

#### 小测交互

- 一次展示一题，共 3 题。
- 点击选项后锁定该题选项：
  - 正确选项标绿
  - 错误选择标红
  - 展示解析
  - 出现“下一题”按钮
- 未选择选项时“下一题”不可点。
- 第 3 题结束后展示：
  - 得分 `x/3`
  - 最高分
  - “再测一次”
- 只持久化最高分，不保存答题明细。
- 小测不进入主测验页的错题本。

### 5.4 分类详情页延伸阅读

在现有投放要求之后新增“延伸阅读”区块，每个类别展示 2 篇文章：

| 分类 | 延伸文章 |
|---|---|
| 湿垃圾 | 厨余垃圾的两种归宿、3R 原则 |
| 干垃圾 | 焚烧发电、填埋场的隐形代价 |
| 可回收物 | 塑料化学回收、旧衣回收后去了哪 |
| 有害垃圾 | 电子垃圾、焚烧发电 |

点击跳转 `/pages/knowledge/detail?id=xxx`。

### 5.5 页面配置

| 页面 | navigationBarTitleText | 背景色 | 文字色 |
|---|---|---|---|
| `pages/knowledge/index` | 垃圾分类知识 | `#e8edf7` | black |
| `pages/knowledge/detail` | 知识科普 | `#e8edf7` | black |

两个页面都通过 `useShareAppMessage` 开启分享；详情页分享路径必须带 `id`。

## 6. 数据模型

```ts
// src/content/knowledge/types.ts
export type KnowledgeTopic = 'risk' | 'tech' | 'action'

export type KnowledgeBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'stats'; items: Array<{ label: string; value: string; note?: string }> }
  | { type: 'tip'; title?: string; text: string }

export interface KnowledgeQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface KnowledgeArticle {
  id: string
  title: string
  summary: string
  takeaway: string
  topic: KnowledgeTopic
  emoji: string
  readMinutes: number
  featured?: boolean
  blocks: KnowledgeBlock[]
  quiz: KnowledgeQuestion[]
  relatedIds: string[]
  sources: string[]
}
```

主题元信息 `topics.ts`：

```ts
export const TOPICS: Record<
  KnowledgeTopic,
  { label: string; emoji: string; className: string }
> = {
  risk: { label: '环境风险', emoji: '⚠️', className: 'topic-risk' },
  tech: { label: '处理技术', emoji: '⚙️', className: 'topic-tech' },
  action: { label: '减量行动', emoji: '🌱', className: 'topic-action' }
}
```

## 7. 首期内容

共 12 篇，每篇正文约 600 字（550–700 字，不含来源与小测），固定 3 道小测题。

| 主题 | id | 标题 |
|---|---|---|
| 环境风险 | `plastic-bottle` | 一个塑料瓶的 450 年 |
| 环境风险 | `landfill` | 填埋场的隐形代价：渗滤液与甲烷 |
| 环境风险 | `microplastics` | 微塑料：从洗衣水到餐桌 |
| 环境风险 | `e-waste` | 电子垃圾：城市矿山还是毒源 |
| 处理技术 | `waste-to-energy` | 焚烧发电：一吨垃圾能发多少度电 |
| 处理技术 | `kitchen-waste` | 厨余垃圾的两种归宿：厌氧消化与堆肥 |
| 处理技术 | `chemical-recycling` | 塑料化学回收：解聚、热解、气化 |
| 处理技术 | `ai-sorting` | AI 智能分拣与光学分选 |
| 处理技术 | `biodegradable` | 可降解塑料：PLA/PBAT 的真相 |
| 减量行动 | `three-r` | 3R 原则：Reduce / Reuse / Recycle |
| 减量行动 | `packaging` | 外卖与快递包装怎么减 |
| 减量行动 | `old-clothes` | 旧衣回收后去了哪 |

`plastic-bottle` 设为 `featured: true`。

### 文章结构要求

- 3–5 个 `heading` 小节。
- 至少 1 个 `stats` 区块、1 个 `tip` 区块。
- 结尾有 `takeaway`。
- 3 道单选题，每题 3–4 个选项，附解析。
- 1–3 条来源，格式为“机构 + 报告/标准名称 + 年份”。

### 内容生产规范

- 所有数字必须能追溯到所列来源，禁止编造数据。
- 无法确证的数字使用区间或定性描述。
- 涉及地区差异时注明“以上海为例”或“各地标准略有差异”。
- 不推荐任何厂商、设备或产品。
- 语言面向普通居民，避免堆砌术语；必要术语首次出现时用一句话解释。

### 相关阅读映射

| 文章 | relatedIds |
|---|---|
| plastic-bottle | microplastics, chemical-recycling |
| landfill | waste-to-energy, microplastics |
| microplastics | plastic-bottle, packaging |
| e-waste | waste-to-energy, chemical-recycling |
| waste-to-energy | landfill, e-waste |
| kitchen-waste | three-r, packaging |
| chemical-recycling | plastic-bottle, biodegradable |
| ai-sorting | chemical-recycling, e-waste |
| biodegradable | plastic-bottle, chemical-recycling |
| three-r | packaging, old-clothes |
| packaging | three-r, microplastics |
| old-clothes | three-r, chemical-recycling |

## 8. 文件结构

```
src/content/knowledge/
  types.ts
  topics.ts
  index.ts
  articles/
    plastic-bottle.ts
    landfill.ts
    microplastics.ts
    e-waste.ts
    waste-to-energy.ts
    kitchen-waste.ts
    chemical-recycling.ts
    ai-sorting.ts
    biodegradable.ts
    three-r.ts
    packaging.ts
    old-clothes.ts

src/components/knowledge/
  ArticleCard.tsx
  ArticleCard.scss
  BlockRenderer.tsx
  BlockRenderer.scss

src/pages/knowledge/
  index.tsx
  index.config.ts
  index.scss
  detail.tsx
  detail.config.ts
  detail.scss
```

`src/content/knowledge/index.ts` 导出：

```ts
export const articles: KnowledgeArticle[]
export const articleMap: Record<string, KnowledgeArticle>
export const getArticle: (id: string) => KnowledgeArticle | undefined
export const getArticlesByTopic: (topic?: KnowledgeTopic) => KnowledgeArticle[]
export const getRelatedArticles: (article: KnowledgeArticle) => KnowledgeArticle[]
```

## 9. 本地存储

复用 `src/utils/storage.ts` 的 `readStorage` / `writeStorage`：

| Key | 类型 | 说明 |
|---|---|---|
| `knowledge_favorites` | `string[]` | 收藏的文章 id |
| `knowledge_quiz_best` | `Record<string, number>` | 每篇文章小测最高分 |

收藏与成绩只存本地，不做云端同步。

## 10. 视觉规范

- 页面背景：`$clay-bg`。
- 卡片：`@include clay-surface($clay-surface, 36rpx~44rpx)`。
- 主题色：
  - `topic-risk`：陶土橙 → 粉，`#ffbe8a` → `#ff9eb5`
  - `topic-tech`：蓝 → 紫，`#c9d9ff` → `#e3d8ff`
  - `topic-action`：薄荷绿，`#86d9c4` → `#c9f0e4`
- 正文：28–30rpx，行高 1.8，颜色 `$clay-muted`。
- 小节标题：32rpx，加粗，`$clay-text`。
- 文章标题：44rpx，加粗，`$clay-text`。
- 数据卡数值：40rpx，加粗，主题色。
- 收藏按钮：沿用首页 `.button` 的圆形粘土按钮样式，右下角固定。
- 底部为 tabBar 与安全区预留空间；详情页底部 padding 至少 `160rpx + env(safe-area-inset-bottom)`。

## 11. 错误处理与边界

- `id` 不存在：展示兜底页，不渲染小测与相关阅读。
- 收藏数据损坏或类型不符：回退为 `[]`。
- 小测最高分数据损坏：回退为 `{}`。
- 小测未选择选项：“下一题”不可点。
- 超长标题与摘要：最多两行，超出省略。
- 相关阅读不足 2 篇时按实际数量展示。
- 文章 `quiz` 为空时隐藏小测区块（类型上要求 3 题，此分支仅作防御）。
- 无网络依赖，不需要加载态与网络错误态。

## 12. 测试与验收

项目当前没有测试框架，沿用 `npm run typecheck` + 微信开发者工具手测。

### 验收清单

- [ ] 首页空闲态显示知识入口；搜索聚焦或出结果时隐藏。
- [ ] 点击入口进入知识列表，不新增 tabBar 项。
- [ ] 列表展示 12 篇文章，推荐卡片仅在“全部”下出现。
- [ ] 四个主题筛选结果正确。
- [ ] 收藏/取消收藏即时生效，重启小程序后仍保留。
- [ ] “收藏”筛选显示数量，空收藏有空状态。
- [ ] 详情页正确渲染 heading、paragraph、list、stats、tip 五种区块。
- [ ] 一句话总结、来源、免责提示正确展示。
- [ ] 小测 3 题可完成，答对答错反馈与解析正确。
- [ ] 最高分持久化，重进文章可看到最佳成绩。
- [ ] 相关阅读使用 `redirectTo`，返回不堆叠页面栈。
- [ ] 分享标题为文章标题，路径带正确 `id`。
- [ ] 无效 `id` 展示“文章不存在”。
- [ ] 四类垃圾详情页的延伸阅读链接正确。
- [ ] `npm run typecheck` 通过。
- [ ] 页面无外部图片、无外链、无评论/UGC 入口。

## 13. 开发顺序

1. 类型、主题元信息、12 篇文章内容与 36 道小测。
2. 知识列表页与 `ArticleCard` 组件。
3. 文章详情页、`BlockRenderer`、小测、收藏。
4. 首页入口、分类详情页延伸阅读、`app.config.ts` 页面注册。
5. 样式打磨与手测验收。

## 14. 已知取舍

- 内容静态打包，更新文章需要重新发布小程序；换取了零后端、零审核风险。
- 首期不做知识库搜索、目录、阅读进度与账号同步。
- 知识页面不接广告，保持阅读体验并降低“资讯 + 广告”的审核观感风险。
- 小测只存最高分，不保存答题记录，也不进入主测验错题本。
- 不做数据埋点，后续如需评估阅读效果需另加统计方案。
