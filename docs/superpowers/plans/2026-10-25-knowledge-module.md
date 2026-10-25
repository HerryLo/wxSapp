# 垃圾分类知识模块 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** `docs/superpowers/specs/2026-10-25-knowledge-module-design.md`

**Goal:** 在 wxSapp 中新增静态知识科普模块：12 篇文章、主题筛选、收藏、3 题小测、相关阅读，并接入首页与分类详情页。

**Architecture:** 内容以 TypeScript 结构化区块存放在 `src/content/knowledge`，列表页与详情页按区块渲染；收藏和小测最高分只写本地存储；不新增 tabBar、不依赖后端与网络请求。

**Tech Stack:** Taro 4.3、React 18、TypeScript、SCSS（粘土拟态 `src/styles/clay.scss`）。

## Global Constraints

- 小程序主体为个人：不得加入评论、投稿、UGC、视频、直播、付费、排行榜、时政/行业资讯。
- 不新增 tabBar 项；知识页从首页入口进入。
- 内容全部静态打包，不发起网络请求。
- 不使用外部图片和外链；图标用 emoji，来源用纯文本。
- 所有新样式复用 `src/styles/clay.scss` 的变量与 mixin。
- TypeScript 开启 `strictNullChecks`、`noUnusedLocals`、`noUnusedParameters`；新增代码必须通过 `npm run typecheck`。
- 所有面向用户的文案使用中文。
- 每个任务结束前运行 `npm run typecheck`，通过后提交一次。
- 项目没有测试框架：验证方式为 `npm run typecheck`、`npm run build:weapp` 和微信开发者工具手测。

---

### Task 1: 知识数据类型与主题元信息

**Files:**
- Create: `src/content/knowledge/types.ts`
- Create: `src/content/knowledge/topics.ts`

**Interfaces:**
- Produces:
  - `KnowledgeTopic = 'risk' | 'tech' | 'action'`
  - `KnowledgeBlock` 联合类型：`heading | paragraph | list | stats | tip`
  - `KnowledgeStat { label: string; value: string; note?: string }`
  - `KnowledgeQuestion { question: string; options: string[]; answer: number; explanation: string }`
  - `KnowledgeArticle { id; title; summary; takeaway; topic; emoji; readMinutes; featured?; blocks; quiz; relatedIds; sources }`
  - `TOPICS: Record<KnowledgeTopic, { label; emoji; className }>`
  - `TOPIC_ORDER: KnowledgeTopic[]`

- [ ] **Step 1: 创建类型文件**

`src/content/knowledge/types.ts`：

```ts
export type KnowledgeTopic = 'risk' | 'tech' | 'action'

export interface KnowledgeStat {
  label: string
  value: string
  note?: string
}

export type KnowledgeBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'stats'; items: KnowledgeStat[] }
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

- [ ] **Step 2: 创建主题元信息**

`src/content/knowledge/topics.ts`：

```ts
import type { KnowledgeTopic } from './types'

export interface TopicMeta {
  label: string
  emoji: string
  className: string
}

export const TOPICS: Record<KnowledgeTopic, TopicMeta> = {
  risk: { label: '环境风险', emoji: '⚠️', className: 'topic-risk' },
  tech: { label: '处理技术', emoji: '⚙️', className: 'topic-tech' },
  action: { label: '减量行动', emoji: '🌱', className: 'topic-action' }
}

export const TOPIC_ORDER: KnowledgeTopic[] = ['risk', 'tech', 'action']
```

- [ ] **Step 3: 运行类型检查**

Run: `npm run typecheck`
Expected: 通过，无错误。

- [ ] **Step 4: 提交**

```bash
git add src/content/knowledge/types.ts src/content/knowledge/topics.ts
git commit -m "feat: 新增知识模块类型与主题定义"
```

---

### Task 2: 环境风险文章（4 篇）与数据索引

**Files:**
- Create: `src/content/knowledge/articles/plastic-bottle.ts`
- Create: `src/content/knowledge/articles/landfill.ts`
- Create: `src/content/knowledge/articles/microplastics.ts`
- Create: `src/content/knowledge/articles/e-waste.ts`
- Create: `src/content/knowledge/index.ts`

**Interfaces:**
- Consumes: Task 1 的所有类型与 `TOPICS`
- Produces:
  - 文章导出：`plasticBottle`、`landfill`、`microplastics`、`eWaste`
  - `articles: KnowledgeArticle[]`
  - `articleMap: Record<string, KnowledgeArticle>`
  - `getArticle(id: string): KnowledgeArticle | undefined`
  - `getArticlesByTopic(topic?: KnowledgeTopic): KnowledgeArticle[]`
  - `getRelatedArticles(article: KnowledgeArticle): KnowledgeArticle[]`

- [ ] **Step 1: 核实数据并记录来源**

用 WebSearch 核实下面四篇的“必含数据”。若某个数值无法核实，改成定性描述，并在 `sources` 中保留能查到的机构与报告名。禁止编造数字。

每个文章文件顶部统一写：

```ts
import type { KnowledgeArticle } from '../types'
```

导出变量名：`plastic-bottle.ts` → `plasticBottle`；`landfill.ts` → `landfill`；`microplastics.ts` → `microplastics`；`e-waste.ts` → `eWaste`。

- [ ] **Step 2: 写 `plastic-bottle.ts`**

写作规范：4 个小节，每节 2–3 段，全文 800–1200 字；`blocks` 至少包含 4 个 `heading`、1 个 `list`、1 个 `stats`、1 个 `tip`。

- 元数据：id `plastic-bottle`，标题“一个塑料瓶的 450 年”，summary“从货架到海洋，一个 PET 瓶要经历什么？450 年不是精确数字，但足以说明塑料的持久性。”，takeaway“少用一个瓶子，比回收一个瓶子更直接。”，topic `risk`，emoji `🧴`，readMinutes 4，featured `true`，relatedIds `['microplastics', 'chemical-recycling']`
- 小节：`从货架到环境` / `450 年是怎么算出来的` / `碎裂之后：微塑料` / `回收为什么没跟上`
- 必含数据：全球塑料回收率约 9%（OECD 2022）；PET 瓶在自然环境中降解需要数百年；全球塑料产量自 1950 年代以来大幅增长
- tip：“自带水杯是最省事的减量方式。”
- sources：`经济合作与发展组织（OECD）：《Global Plastics Outlook》2022`、`联合国环境规划署（UNEP）：《Global Waste Management Outlook》`
- quiz（答案下标从 0 开始）：
  1. 一个 PET 塑料瓶在自然环境中完全降解通常需要多久？选项 `['1 年', '10 年', '约 450 年', '3 个月']`，answer `2`，解析“塑料化学性质稳定，自然降解通常以百年计；450 年是常见估算值，不是精确数字。”
  2. 塑料在环境中破碎后，最可能变成什么？选项 `['可被微生物完全吃掉', '微塑料', '无害气体', '肥料']`，answer `1`，解析“塑料不会凭空消失，而是碎裂成越来越小的微塑料。”
  3. 全球塑料垃圾的回收利用率大致是多少？选项 `['约 9%', '约 50%', '约 90%', '100%']`，answer `0`，解析“OECD 2022 年的估算约为 9%，大部分塑料最终被填埋、焚烧或进入环境。”

- [ ] **Step 3: 写 `landfill.ts`**

同样遵循写作规范。

- 元数据：id `landfill`，标题“填埋场的隐形代价：渗滤液与甲烷”，summary“填埋不是把垃圾藏起来。渗滤液和甲烷，是两笔长期账单。”，takeaway“填埋是末端处置，不是消失术。”，topic `risk`，emoji `⛰️`，readMinutes 4，relatedIds `['waste-to-energy', 'microplastics']`
- 小节：`埋了不等于消失` / `渗滤液：高浓度污染液` / `填埋气：甲烷与温室效应` / `封场之后还要管多久`
- 必含数据：填埋气中甲烷约占 50%–60%；渗滤液含高浓度有机物和氨氮；封场后仍需长期监测
- tip：“湿垃圾沥干再投放，能减少渗滤液产生。”
- sources：`生态环境部：《生活垃圾填埋场污染控制标准》（GB 16889-2008）`、`住房和城乡建设部：《中国城乡建设统计年鉴》`
- quiz：
  1. 填埋场产生的渗滤液主要风险是什么？选项 `['可直接饮用', '高浓度有机物和氨氮污染地下水', '只有异味', '可以当肥料']`，answer `1`
  2. 填埋气中主要的温室气体是？选项 `['二氧化碳', '甲烷', '氮气', '氧气']`，answer `1`
  3. 填埋场封场后是否立即无需管理？选项 `['是', '否，仍需长期监测渗滤液和填埋气', '只需种树', '不确定']`，answer `1`

- [ ] **Step 4: 写 `microplastics.ts`**

同样遵循写作规范。

- 元数据：id `microplastics`，标题“微塑料：从洗衣水到餐桌”，summary“小于 5 毫米的塑料颗粒，已经出现在水、空气和食物里。”，takeaway“减少一次性塑料和合成纤维排放，比事后清理更有效。”，topic `risk`，emoji `🔬`，readMinutes 4，relatedIds `['plastic-bottle', 'packaging']`
- 小节：`微塑料从哪来` / `一条洗衣废水里的纤维` / `它们去了哪` / `怎么减少暴露`
- 必含数据：微塑料通常指粒径小于 5 毫米的塑料颗粒；洗衣废水中的合成纤维是重要来源；污水处理能截留一部分，但污泥仍可能带回环境
- tip：“洗衣机加装过滤装置，能截留部分纤维。”
- sources：`世界卫生组织（WHO）：《Microplastics in drinking-water》2019`、`联合国环境规划署（UNEP）：塑料与微塑料相关报告`
- quiz：
  1. 微塑料通常指粒径小于多少的塑料颗粒？选项 `['5 毫米', '5 厘米', '5 米', '0.5 毫米']`，answer `0`
  2. 以下哪项是微塑料的重要来源？选项 `['洗衣废水中的合成纤维', '雨水', '阳光', '土壤矿物']`，answer `0`
  3. 减少微塑料暴露的可行做法是？选项 `['多喝瓶装水', '使用洗衣机过滤装置、减少一次性塑料', '焚烧塑料', '把塑料扔进海里']`，answer `1`

- [ ] **Step 5: 写 `e-waste.ts`**

同样遵循写作规范。

- 元数据：id `e-waste`，标题“电子垃圾：城市矿山还是毒源”，summary“电子垃圾既是‘城市矿山’，也可能是重金属污染源。”，takeaway“把旧电器交给正规回收渠道，是最稳妥的处理方式。”，topic `risk`，emoji `📱`，readMinutes 4，relatedIds `['waste-to-energy', 'chemical-recycling']`
- 小节：`电子垃圾为什么特殊` / `城市矿山：金属比矿石更富` / `非正规拆解的代价` / `正规回收怎么做`
- 必含数据：2022 年全球电子垃圾约 6200 万吨；正规回收率约 22.3%（Global E-waste Monitor 2024）；电子垃圾含金、铜等金属，也含重金属和阻燃剂
- tip：“丢弃前先清除个人数据，再交给正规回收点。”
- sources：`联合国：《Global E-waste Monitor 2024》`、`生态环境部：固体废物相关环境状况公报`
- quiz：
  1. 全球电子垃圾年产生量约为？选项 `['6200 万吨', '600 万吨', '6 亿吨', '6000 吨']`，answer `0`
  2. 电子垃圾被称为“城市矿山”是因为？选项 `['含可回收金属', '埋在城里', '颜色像矿', '可以种树']`，answer `0`
  3. 非正规拆解电子垃圾的主要风险？选项 `['重金属和持久性有机物污染', '只损失金属', '没有风险', '增加氧气']`，answer `0`

- [ ] **Step 6: 创建数据索引**

`src/content/knowledge/index.ts`：

```ts
import type { KnowledgeArticle, KnowledgeTopic } from './types'
import { plasticBottle } from './articles/plastic-bottle'
import { landfill } from './articles/landfill'
import { microplastics } from './articles/microplastics'
import { eWaste } from './articles/e-waste'

export type {
  KnowledgeArticle,
  KnowledgeBlock,
  KnowledgeQuestion,
  KnowledgeStat,
  KnowledgeTopic
} from './types'
export { TOPICS, TOPIC_ORDER } from './topics'

export const articles: KnowledgeArticle[] = [
  plasticBottle,
  landfill,
  microplastics,
  eWaste
]

export const articleMap: Record<string, KnowledgeArticle> = articles.reduce(
  (map, article) => {
    map[article.id] = article
    return map
  },
  {} as Record<string, KnowledgeArticle>
)

export const getArticle = (id: string): KnowledgeArticle | undefined =>
  articleMap[id]

export const getArticlesByTopic = (
  topic?: KnowledgeTopic
): KnowledgeArticle[] =>
  topic ? articles.filter(item => item.topic === topic) : articles

export const getRelatedArticles = (
  article: KnowledgeArticle
): KnowledgeArticle[] =>
  article.relatedIds
    .map(id => articleMap[id])
    .filter((item): item is KnowledgeArticle => Boolean(item))
    .slice(0, 2)
```

- [ ] **Step 7: 运行类型检查**

Run: `npm run typecheck`
Expected: 通过。若报“找不到模块”，检查四个文章文件是否都导出了对应的小驼峰变量。

- [ ] **Step 8: 提交**

```bash
git add src/content/knowledge
git commit -m "feat: 新增环境风险知识文章与数据索引"
```

---

### Task 3: 处理技术文章（5 篇）

**Files:**
- Create: `src/content/knowledge/articles/waste-to-energy.ts`
- Create: `src/content/knowledge/articles/kitchen-waste.ts`
- Create: `src/content/knowledge/articles/chemical-recycling.ts`
- Create: `src/content/knowledge/articles/ai-sorting.ts`
- Create: `src/content/knowledge/articles/biodegradable.ts`
- Modify: `src/content/knowledge/index.ts`

**Interfaces:**
- Consumes: Task 1 类型、Task 2 的 `articles` 索引结构
- Produces: 新增 5 个文章导出，`articles` 数组扩充到 9 篇

- [ ] **Step 1: 核实数据**

用 WebSearch 核实五篇的“必含数据”；无法核实的数字改成定性表述，不编造。

每个文件顶部写 `import type { KnowledgeArticle } from '../types'`。导出变量名：`waste-to-energy.ts` → `wasteToEnergy`；`kitchen-waste.ts` → `kitchenWaste`；`chemical-recycling.ts` → `chemicalRecycling`；`ai-sorting.ts` → `aiSorting`；`biodegradable.ts` → `biodegradable`。

- [ ] **Step 2: 写 `waste-to-energy.ts`**

遵循 Task 2 的写作规范。

- 元数据：id `waste-to-energy`，标题“焚烧发电：一吨垃圾能发多少度电”，summary“一吨垃圾能发多少电？焚烧之后，炉渣和飞灰又去了哪？”，takeaway“焚烧能减容和回收能量，但前提是烟气与飞灰被严格处理。”，topic `tech`，emoji `🔥`，readMinutes 5，relatedIds `['landfill', 'e-waste']`
- 小节：`垃圾怎么烧` / `一吨垃圾能发多少电` / `烟气净化与飞灰` / `焚烧不是万能`
- 必含数据：1 吨生活垃圾焚烧约发电 300–500 度；飞灰约占垃圾量的 3%–5%；850℃ 以上停留 2 秒是控制二噁英的关键条件之一
- tip：“焚烧前分出湿垃圾和有害垃圾，能提高效率、降低排放。”
- sources：`住房和城乡建设部：《中国城乡建设统计年鉴》`、`生态环境部：《生活垃圾焚烧污染控制标准》（GB 18484-2020）`
- quiz：
  1. 一吨生活垃圾焚烧大约可发电多少度？选项 `['30–50 度', '300–500 度', '3000–5000 度', '0 度']`，answer `1`
  2. 焚烧产生的飞灰通常如何处理？选项 `['直接填埋', '固化/稳定化后安全填埋或资源化', '撒到农田', '倒入河流']`，answer `1`
  3. 控制二噁英的关键条件之一是？选项 `['低温慢烧', '850℃ 以上停留 2 秒', '不通风', '加水']`，answer `1`

- [ ] **Step 3: 写 `kitchen-waste.ts`**

遵循写作规范。

- 元数据：id `kitchen-waste`，标题“厨余垃圾的两种归宿：厌氧消化与堆肥”，summary“厨余垃圾一半是水。厌氧消化和好氧堆肥，是两条不同的归路。”，takeaway“厨余分出来，才有机会变成能源和肥料。”，topic `tech`，emoji `🥬`，readMinutes 4，relatedIds `['three-r', 'packaging']`
- 小节：`厨余为什么不能混` / `厌氧消化：产沼气` / `好氧堆肥：变土壤改良剂` / `两种技术怎么选`
- 必含数据：厨余约占城市生活垃圾的一半；沼气中甲烷约占 60%；堆肥需要通风、适宜碳氮比和温度
- tip：“厨余沥干水分、去掉塑料袋，能明显提高处理效率。”
- sources：`住房和城乡建设部：《中国城乡建设统计年鉴》`、`中国城市环境卫生协会：厨余垃圾处理技术资料`
- quiz：
  1. 厌氧消化处理厨余的主要产物是？选项 `['沼气和沼渣沼液', '汽油', '塑料', '玻璃']`，answer `0`
  2. 好氧堆肥需要的关键条件包括？选项 `['缺氧', '通风、适宜碳氮比和温度', '高温焚烧', '加水泥']`，answer `1`
  3. 厨余垃圾混入塑料的主要影响？选项 `['提高堆肥质量', '增加后续分选和处理难度', '没有影响', '让沼气更多']`，answer `1`

- [ ] **Step 4: 写 `chemical-recycling.ts`**

遵循写作规范。

- 元数据：id `chemical-recycling`，标题“塑料化学回收：解聚、热解、气化”，summary“当物理回收遇到混合、污染的塑料，化学回收提供了另一条路径。”，takeaway“化学回收是补充，不是万能解；减量和重复使用仍优先。”，topic `tech`，emoji `♻️`，readMinutes 4，relatedIds `['plastic-bottle', 'biodegradable']`
- 小节：`物理回收的天花板` / `解聚：变回单体` / `热解与气化：变油和气` / `现实中的限制`
- 必含数据：物理回收受混合、污染和多次循环降质限制；解聚适合 PET、PLA 等特定塑料；热解更适合混合聚烯烃；化学回收能耗较高
- tip：“可回收物保持清洁干燥，能提高物理回收成功率。”
- sources：`经济合作与发展组织（OECD）：《Global Plastics Outlook》2022`、`艾伦·麦克阿瑟基金会：《The New Plastics Economy》`
- quiz：
  1. 塑料化学回收与物理回收的主要区别？选项 `['化学回收把塑料分解为单体/油/气', '化学回收只是清洗', '物理回收用酸', '没有区别']`，answer `0`
  2. 热解更适合处理哪类塑料？选项 `['单一洁净 PET 瓶', '混合、受污染的聚烯烃塑料', '玻璃', '金属']`，answer `1`
  3. 化学回收的主要限制之一是？选项 `['能耗和原料适配性', '完全无污染', '成本为零', '可处理所有垃圾']`，answer `0`

- [ ] **Step 5: 写 `ai-sorting.ts`**

遵循写作规范。

- 元数据：id `ai-sorting`，标题“AI 智能分拣与光学分选”，summary“近红外识别材质、AI 视觉识别形状，机器人正在替代部分人工分拣。”，takeaway“AI 分拣提升效率，但前端分类和清洁投放仍然不可替代。”，topic `tech`，emoji `🤖`，readMinutes 3，relatedIds `['chemical-recycling', 'e-waste']`
- 小节：`为什么人工分拣难` / `光学分选：近红外识别材质` / `AI 视觉与机器人抓取` / `技术边界`
- 必含数据：近红外（NIR）可识别常见塑料材质；黑色塑料、严重污染和物料堆叠仍是难点；自动分拣前通常需要预处理
- tip：“投放前简单冲洗、压扁，能提高自动分拣识别率。”
- sources：`中国城市环境卫生协会：生活垃圾分选技术资料`、`相关学术综述：生活垃圾智能分选技术研究进展`
- quiz：
  1. 近红外（NIR）分选主要用来识别什么？选项 `['塑料材质', '垃圾重量', '颜色', '温度']`，answer `0`
  2. AI 分拣机器人的关键组成不包括？选项 `['视觉识别', '机械抓取', '算法', '焚烧炉']`，answer `3`
  3. 当前 AI 分拣的主要限制？选项 `['黑色塑料、污染和复杂堆叠', '完全不需要人工', '零成本', '只能分金属']`，answer `0`

- [ ] **Step 6: 写 `biodegradable.ts`**

遵循写作规范。

- 元数据：id `biodegradable`，标题“可降解塑料：PLA/PBAT 的真相”，summary“‘可降解’不等于‘扔哪都能降解’。PLA 和 PBAT 需要合适的处置条件。”，takeaway“可降解塑料不是乱扔许可证，优先减量和重复使用。”，topic `tech`，emoji `🌽`，readMinutes 4，relatedIds `['plastic-bottle', 'chemical-recycling']`
- 小节：`可降解不等于随处降解` / `PLA、PBAT 是什么` / `需要工业堆肥条件` / `怎么正确使用`
- 必含数据：PLA 在工业堆肥条件下通常需要 50–60℃ 和特定湿度；GB/T 28206 与 EN 13432 规定可堆肥塑料要求；自然土壤或填埋环境中降解可能很慢
- tip：“看清标识，按当地要求投放，不要混入普通塑料回收。”
- sources：`国家标准 GB/T 28206-2011《可堆肥塑料技术要求》`、`欧洲标准 EN 13432`
- quiz：
  1. PLA 塑料在自然土壤中通常？选项 `['很快完全降解', '可能需要工业堆肥条件才能较快降解', '立即消失', '变成肥料']`，answer `1`
  2. “可降解塑料”最可靠的处置方式是？选项 `['扔进普通垃圾桶', '进入工业堆肥设施', '埋在后院', '扔进河里']`，answer `1`
  3. 可降解塑料不能解决所有塑料污染，主要因为？选项 `['需要合适的处置条件且可能与传统塑料混淆', '它太贵', '它不能做成袋子', '它有毒']`，answer `0`

- [ ] **Step 7: 更新索引**

在 `src/content/knowledge/index.ts` 顶部的 import 区加入：

```ts
import { wasteToEnergy } from './articles/waste-to-energy'
import { kitchenWaste } from './articles/kitchen-waste'
import { chemicalRecycling } from './articles/chemical-recycling'
import { aiSorting } from './articles/ai-sorting'
import { biodegradable } from './articles/biodegradable'
```

并把 `articles` 数组改成：

```ts
export const articles: KnowledgeArticle[] = [
  plasticBottle,
  landfill,
  microplastics,
  eWaste,
  wasteToEnergy,
  kitchenWaste,
  chemicalRecycling,
  aiSorting,
  biodegradable
]
```

- [ ] **Step 8: 运行类型检查**

Run: `npm run typecheck`
Expected: 通过。

- [ ] **Step 9: 提交**

```bash
git add src/content/knowledge
git commit -m "feat: 新增处理技术知识文章"
```

---

### Task 4: 减量行动文章（3 篇）

**Files:**
- Create: `src/content/knowledge/articles/three-r.ts`
- Create: `src/content/knowledge/articles/packaging.ts`
- Create: `src/content/knowledge/articles/old-clothes.ts`
- Modify: `src/content/knowledge/index.ts`

**Interfaces:**
- Consumes: Task 1 类型、Task 3 的 9 篇索引
- Produces: `articles` 数组扩充到 12 篇

- [ ] **Step 1: 核实数据**

用 WebSearch 核实三篇的“必含数据”；无法核实的数字改成定性表述。

每个文件顶部写 `import type { KnowledgeArticle } from '../types'`。导出变量名：`three-r.ts` → `threeR`；`packaging.ts` → `packaging`；`old-clothes.ts` → `oldClothes`。

- [ ] **Step 2: 写 `three-r.ts`**

遵循 Task 2 的写作规范。

- 元数据：id `three-r`，标题“3R 原则：Reduce / Reuse / Recycle”，summary“Reduce、Reuse、Recycle 不是并列选项，而是有先后的顺序。”，takeaway“最好的垃圾，是没有产生的垃圾。”，topic `action`，emoji `🌍`，readMinutes 3，relatedIds `['packaging', 'old-clothes']`
- 小节：`Reduce：先少产生` / `Reuse：再用一次` / `Recycle：最后才回收` / `顺序不能反`
- 必含数据：回收过程也有能耗和材料损耗；源头减量的环境收益通常高于末端回收
- tip：“下一次购物前，先问自己‘真的需要吗’。”
- sources：`欧盟废弃物框架指令 2008/98/EC`、`联合国环境规划署（UNEP）：《Global Waste Management Outlook》`
- quiz：
  1. 3R 原则的正确优先级是？选项 `['Reduce > Reuse > Recycle', 'Recycle > Reuse > Reduce', 'Reuse > Recycle > Reduce', '三者相同']`，answer `0`
  2. 以下哪项属于 Reuse？选项 `['自带水杯重复使用', '把塑料瓶扔进可回收桶', '焚烧垃圾', '填埋']`，answer `0`
  3. 为什么 Reduce 优先于 Recycle？选项 `['回收也有能耗和损耗', '回收完全无污染', 'Reduce 更贵', '没有区别']`，answer `0`

- [ ] **Step 3: 写 `packaging.ts`**

遵循写作规范。

- 元数据：id `packaging`，标题“外卖与快递包装怎么减”，summary“外卖和快递包装，是城市生活垃圾里增长最快的一部分。”，takeaway“少要一份餐具、拆净胶带，都是立刻能做的减量。”，topic `action`，emoji `📦`，readMinutes 3，relatedIds `['three-r', 'microplastics']`
- 小节：`包装垃圾去了哪` / `哪些包装可回收` / `点外卖时的减量选择` / `快递箱的循环`
- 必含数据：快递纸箱可回收，但胶带和填充物会降低回收价值；外卖餐盒油污会影响回收；选择“无需餐具”可直接减少一次性用品
- tip：“拆快递后把纸箱压扁、去掉胶带，再单独投放。”
- sources：`国家邮政局：快递包装绿色治理相关报告`、`住房和城乡建设部：《中国城乡建设统计年鉴》`
- quiz：
  1. 外卖餐盒回收难的主要原因是？选项 `['油污污染', '太大', '太贵', '没有回收价值']`，answer `0`
  2. 快递纸箱回收时最需要去掉什么？选项 `['胶带和填充物', '纸板', '文字', '颜色']`，answer `0`
  3. 点外卖时最直接的减量做法？选项 `['选择无需餐具', '多要包装', '多点一份', '扔掉']`，answer `0`

- [ ] **Step 4: 写 `old-clothes.ts`**

遵循写作规范。

- 元数据：id `old-clothes`，标题“旧衣回收后去了哪”，summary“旧衣不是垃圾。复用、再生、能源化，是三条不同的去向。”，takeaway“先捐赠和重复使用，再考虑回收再生。”，topic `action`，emoji `👕`，readMinutes 3，relatedIds `['three-r', 'chemical-recycling']`
- 小节：`旧衣不是垃圾` / `回收后的几条路径` / `再生纤维的难点` / `怎么处理旧衣`
- 必含数据：旧衣可二手复用、做再生纤维或擦拭布；混纺纤维难分离是再生难点；合成纤维洗涤会释放微塑料
- tip：“清洗干净、打包投放，能提高旧衣复用率。”
- sources：`中国循环经济协会：《中国废旧纺织品综合利用年度报告》`、`联合国环境规划署（UNEP）：纺织业环境影响相关报告`
- quiz：
  1. 旧衣回收后最常见的去向不包括？选项 `['二手流通', '再生纤维', '擦拭布', '全部直接填埋']`，answer `3`
  2. 混纺旧衣再生难的主要原因是？选项 `['纤维种类混合难分离', '颜色太深', '太旧', '没有市场']`，answer `0`
  3. 处理旧衣更优先的做法是？选项 `['先捐赠/重复使用，再回收', '直接扔掉', '焚烧', '剪碎埋土里']`，answer `0`

- [ ] **Step 5: 更新索引**

在 `src/content/knowledge/index.ts` 的 import 区加入：

```ts
import { threeR } from './articles/three-r'
import { packaging } from './articles/packaging'
import { oldClothes } from './articles/old-clothes'
```

把 `articles` 数组改成：

```ts
export const articles: KnowledgeArticle[] = [
  plasticBottle,
  landfill,
  microplastics,
  eWaste,
  wasteToEnergy,
  kitchenWaste,
  chemicalRecycling,
  aiSorting,
  biodegradable,
  threeR,
  packaging,
  oldClothes
]
```

- [ ] **Step 6: 运行类型检查**

Run: `npm run typecheck`
Expected: 通过。

- [ ] **Step 7: 提交**

```bash
git add src/content/knowledge
git commit -m "feat: 新增减量行动知识文章"
```

---

### Task 5: 文章卡片与知识列表页

**Files:**
- Create: `src/components/knowledge/ArticleCard.tsx`
- Create: `src/components/knowledge/ArticleCard.scss`
- Create: `src/pages/knowledge/index.tsx`
- Create: `src/pages/knowledge/index.config.ts`
- Create: `src/pages/knowledge/index.scss`
- Modify: `src/app.config.ts`（pages 数组追加 `pages/knowledge/index`）

**Interfaces:**
- Consumes: `articles`、`getArticlesByTopic`、`TOPICS`、`TOPIC_ORDER`、`KnowledgeTopic`
- Produces:
  - `ArticleCard` 默认导出，props：`{ article: KnowledgeArticle; favorited: boolean; onToggleFavorite: (id: string) => void; onOpen: (id: string) => void; featured?: boolean }`
  - 知识列表路由 `/pages/knowledge/index`

- [ ] **Step 1: 创建文章卡片组件**

`src/components/knowledge/ArticleCard.tsx`：

```tsx
import { View, Text } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'
import type { KnowledgeArticle } from '../../content/knowledge/types'
import { TOPICS } from '../../content/knowledge/topics'

import './ArticleCard.scss'

interface ArticleCardProps {
  article: KnowledgeArticle
  favorited: boolean
  onToggleFavorite: (id: string) => void
  onOpen: (id: string) => void
  featured?: boolean
}

function ArticleCard({
  article,
  favorited,
  onToggleFavorite,
  onOpen,
  featured = false
}: ArticleCardProps) {
  const topic = TOPICS[article.topic]

  return (
    <View
      className={'article-card' + (featured ? ' article-card--featured' : '')}
      onClick={() => onOpen(article.id)}
    >
      <View className={'article-card__icon ' + topic.className}>
        {article.emoji}
      </View>
      <View className='article-card__body'>
        <View className='article-card__top'>
          <Text className={'article-card__tag ' + topic.className}>
            {topic.label}
          </Text>
          <View
            className={'article-card__bookmark' + (favorited ? ' is-active' : '')}
            onClick={(event: ITouchEvent) => {
              event.stopPropagation()
              onToggleFavorite(article.id)
            }}
          >
            {favorited ? '★' : '☆'}
          </View>
        </View>
        <View className='article-card__title'>{article.title}</View>
        <View className='article-card__summary'>{article.summary}</View>
        <View className='article-card__meta'>
          {article.readMinutes} 分钟 · {article.quiz.length} 题小测
        </View>
      </View>
    </View>
  )
}

export default ArticleCard
```

- [ ] **Step 2: 创建卡片样式**

`src/components/knowledge/ArticleCard.scss`：

```scss
@import '../../styles/clay.scss';

.article-card {
  display: flex;
  padding: 28rpx;
  margin-bottom: 24rpx;
  @include clay-surface($clay-surface, 40rpx);
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
}

.article-card__icon {
  width: 104rpx;
  height: 104rpx;
  flex-shrink: 0;
  margin-right: 24rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  box-shadow: inset 0 6rpx 12rpx rgba(255, 255, 255, 0.65);
}

.article-card__body {
  flex: 1;
  min-width: 0;
}

.article-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.article-card__tag {
  padding: 4rpx 16rpx;
  font-size: 22rpx;
  font-weight: 600;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.55);
  color: $clay-text;
}

.article-card__bookmark {
  width: 56rpx;
  height: 56rpx;
  line-height: 56rpx;
  text-align: center;
  font-size: 34rpx;
  color: $clay-muted;
}

.article-card__bookmark.is-active {
  color: $clay-primary;
}

.article-card__title {
  margin-top: 8rpx;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.45;
  color: $clay-text;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.article-card__summary {
  margin-top: 8rpx;
  font-size: 25rpx;
  line-height: 1.6;
  color: $clay-muted;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.article-card__meta {
  margin-top: 12rpx;
  font-size: 22rpx;
  color: $clay-muted;
}

.article-card--featured {
  flex-direction: column;
  padding: 32rpx;
}

.article-card--featured .article-card__icon {
  width: 140rpx;
  height: 140rpx;
  margin-right: 0;
  margin-bottom: 20rpx;
  font-size: 64rpx;
}

.article-card--featured .article-card__title {
  font-size: 38rpx;
}

.topic-risk {
  background: linear-gradient(140deg, #ffbe8a, #ff9eb5);
}

.topic-tech {
  background: linear-gradient(140deg, #c9d9ff, #e3d8ff);
}

.topic-action {
  background: linear-gradient(140deg, #86d9c4, #c9f0e4);
}
```

- [ ] **Step 3: 创建列表页**

`src/pages/knowledge/index.tsx`：

```tsx
import { useMemo, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import ArticleCard from '../../components/knowledge/ArticleCard'
import { articles, getArticlesByTopic } from '../../content/knowledge'
import { TOPICS, TOPIC_ORDER } from '../../content/knowledge/topics'
import type { KnowledgeTopic } from '../../content/knowledge/types'
import { readStorage, writeStorage } from '../../utils/storage'

import './index.scss'

type Filter = 'all' | 'favorites' | KnowledgeTopic

const FAVORITES_KEY = 'knowledge_favorites'

function KnowledgeList() {
  const [filter, setFilter] = useState<Filter>('all')
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = readStorage<string[]>(FAVORITES_KEY, [])
    return Array.isArray(saved) ? saved : []
  })

  useShareAppMessage(() => ({
    title: '垃圾分类知识',
    path: '/pages/knowledge/index'
  }))

  const list = useMemo(() => {
    if (filter === 'all') {
      return articles
    }
    if (filter === 'favorites') {
      return articles.filter(item => favorites.indexOf(item.id) !== -1)
    }
    return getArticlesByTopic(filter)
  }, [filter, favorites])

  const featured = filter === 'all' ? list.find(item => item.featured) : undefined
  const rest = featured ? list.filter(item => item.id !== featured.id) : list

  const filters: Array<{ key: Filter; label: string; count?: number }> = [
    { key: 'all', label: '全部' },
    ...TOPIC_ORDER.map<{ key: Filter; label: string }>(topic => ({
      key: topic,
      label: TOPICS[topic].label
    })),
    { key: 'favorites', label: '收藏', count: favorites.length }
  ]

  const toggleFavorite = (id: string) => {
    const exists = favorites.indexOf(id) !== -1
    const next = exists
      ? favorites.filter(item => item !== id)
      : favorites.concat(id)
    setFavorites(next)
    writeStorage(FAVORITES_KEY, next)
    Taro.showToast({
      title: exists ? '已取消收藏' : '已收藏',
      icon: 'none'
    })
  }

  const openArticle = (id: string) => {
    Taro.navigateTo({ url: `/pages/knowledge/detail?id=${id}` })
  }

  return (
    <View className='knowledge-page'>
      <View className='knowledge-head'>
        <View className='knowledge-title'>垃圾分类知识</View>
        <View className='knowledge-subtitle'>分完之后，垃圾去了哪里</View>
      </View>

      <ScrollView className='knowledge-filters' scrollX>
        {filters.map(item => (
          <View
            key={item.key}
            className={
              'knowledge-filter' + (filter === item.key ? ' is-active' : '')
            }
            onClick={() => setFilter(item.key)}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <Text className='knowledge-filter__count'>{item.count}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View className='knowledge-list'>
        {featured && (
          <ArticleCard
            article={featured}
            featured
            favorited={favorites.indexOf(featured.id) !== -1}
            onToggleFavorite={toggleFavorite}
            onOpen={openArticle}
          />
        )}
        {rest.map(item => (
          <ArticleCard
            key={item.id}
            article={item}
            favorited={favorites.indexOf(item.id) !== -1}
            onToggleFavorite={toggleFavorite}
            onOpen={openArticle}
          />
        ))}
      </View>

      {list.length === 0 && (
        <View className='knowledge-empty'>
          {filter === 'favorites' ? '还没有收藏，读一篇试试' : '这个主题还没有文章'}
        </View>
      )}

      <View className='knowledge-note'>各地分类标准略有差异，具体以当地规定为准。</View>
    </View>
  )
}

export default KnowledgeList
```

- [ ] **Step 4: 创建页面配置**

`src/pages/knowledge/index.config.ts`：

```ts
export default definePageConfig({
  navigationBarTitleText: '垃圾分类知识',
  navigationBarTextStyle: 'black',
  navigationBarBackgroundColor: '#e8edf7'
})
```

- [ ] **Step 5: 创建列表页样式**

`src/pages/knowledge/index.scss`：

```scss
@import '../../styles/clay.scss';

page {
  background: $clay-bg;
}

.knowledge-page {
  min-height: 100vh;
  padding: 48rpx 36rpx calc(60rpx + env(safe-area-inset-bottom));
  color: $clay-text;
}

.knowledge-head {
  padding: 8rpx 4rpx 32rpx;
}

.knowledge-title {
  font-size: 52rpx;
  font-weight: 800;
  color: $clay-text;
}

.knowledge-subtitle {
  margin-top: 10rpx;
  font-size: 27rpx;
  color: $clay-muted;
}

.knowledge-filters {
  width: 100%;
  margin-bottom: 26rpx;
  white-space: nowrap;
}

.knowledge-filter {
  display: inline-flex;
  align-items: center;
  margin-right: 16rpx;
  padding: 14rpx 28rpx;
  font-size: 25rpx;
  font-weight: 600;
  color: $clay-muted;
  border-radius: 999rpx;
  background: $clay-surface;
  box-shadow:
    0 6rpx 12rpx rgba(106, 126, 168, 0.14),
    inset 0 4rpx 8rpx rgba(255, 255, 255, 0.8);

  &.is-active {
    color: #ffffff;
    background: $clay-primary;
    box-shadow:
      0 8rpx 16rpx rgba(79, 124, 255, 0.28),
      inset 0 -6rpx 12rpx rgba(0, 0, 0, 0.12),
      inset 0 6rpx 12rpx rgba(255, 255, 255, 0.3);
  }
}

.knowledge-filter__count {
  margin-left: 8rpx;
  font-size: 22rpx;
  opacity: 0.8;
}

.knowledge-empty {
  margin-top: 40rpx;
  padding: 72rpx 24rpx;
  text-align: center;
  font-size: 27rpx;
  color: $clay-muted;
  @include clay-surface($clay-surface-soft, 36rpx);
}

.knowledge-note {
  margin-top: 40rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: $clay-muted;
  text-align: center;
}
```

- [ ] **Step 6: 注册列表页**

修改 `src/app.config.ts`，在 `pages` 数组末尾加入：

```ts
'pages/knowledge/index'
```

详情页在 Task 6 创建后再注册 `pages/knowledge/detail`。

- [ ] **Step 7: 运行类型检查与构建**

Run: `npm run typecheck`
Expected: 通过。

Run: `npm run build:weapp`
Expected: 构建成功，输出到 `dist`。

- [ ] **Step 8: 提交**

```bash
git add src/components/knowledge src/pages/knowledge src/app.config.ts
git commit -m "feat: 新增知识列表页与文章卡片"
```

---

### Task 6: 区块渲染器与文章详情页

**Files:**
- Create: `src/components/knowledge/BlockRenderer.tsx`
- Create: `src/components/knowledge/BlockRenderer.scss`
- Create: `src/pages/knowledge/detail.tsx`
- Create: `src/pages/knowledge/detail.config.ts`
- Create: `src/pages/knowledge/detail.scss`
- Modify: `src/app.config.ts`（若 Task 5 只注册了列表页，这里补 `pages/knowledge/detail`）

**Interfaces:**
- Consumes: `KnowledgeBlock`、`getArticle`、`getRelatedArticles`、`TOPICS`
- Produces: `BlockRenderer` 默认导出，props `{ blocks: KnowledgeBlock[]; topic: KnowledgeTopic }`；详情路由 `/pages/knowledge/detail?id=xxx`

- [ ] **Step 1: 创建区块渲染器**

`src/components/knowledge/BlockRenderer.tsx`：

```tsx
import { View, Text } from '@tarojs/components'
import type {
  KnowledgeBlock,
  KnowledgeTopic
} from '../../content/knowledge/types'

import './BlockRenderer.scss'

interface BlockRendererProps {
  blocks: KnowledgeBlock[]
  topic: KnowledgeTopic
}

function BlockRenderer({ blocks, topic }: BlockRendererProps) {
  return (
    <View className='block-list'>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <View className='block-heading' key={index}>
              {block.text}
            </View>
          )
        }

        if (block.type === 'paragraph') {
          return (
            <View className='block-paragraph' key={index}>
              {block.text}
            </View>
          )
        }

        if (block.type === 'list') {
          return (
            <View className='block-list-items' key={index}>
              {block.items.map((item, itemIndex) => (
                <View className='block-list-item' key={itemIndex}>
                  <View className='block-list-dot' />
                  <Text className='block-list-text'>{item}</Text>
                </View>
              ))}
            </View>
          )
        }

        if (block.type === 'stats') {
          return (
            <View className='block-stats' key={index}>
              {block.items.map(item => (
                <View className='block-stat' key={item.label}>
                  <View className={'block-stat__value block-stat__value--' + topic}>
                    {item.value}
                  </View>
                  <View className='block-stat__label'>{item.label}</View>
                  {item.note && (
                    <View className='block-stat__note'>{item.note}</View>
                  )}
                </View>
              ))}
            </View>
          )
        }

        return (
          <View className={'block-tip block-tip--' + topic} key={index}>
            {block.title && <View className='block-tip__title'>{block.title}</View>}
            <View className='block-tip__text'>{block.text}</View>
          </View>
        )
      })}
    </View>
  )
}

export default BlockRenderer
```

- [ ] **Step 2: 创建区块样式**

`src/components/knowledge/BlockRenderer.scss`：

```scss
@import '../../styles/clay.scss';

.block-list {
  margin-top: 8rpx;
}

.block-heading {
  margin: 40rpx 0 16rpx;
  font-size: 32rpx;
  font-weight: 800;
  line-height: 1.5;
  color: $clay-text;
}

.block-paragraph {
  margin-bottom: 20rpx;
  font-size: 28rpx;
  line-height: 1.8;
  color: $clay-muted;
}

.block-list-items {
  margin: 8rpx 0 24rpx;
  padding: 24rpx 28rpx;
  @include clay-surface($clay-surface-soft, 32rpx);
}

.block-list-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 14rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.block-list-dot {
  width: 12rpx;
  height: 12rpx;
  margin: 14rpx 16rpx 0 0;
  flex-shrink: 0;
  border-radius: 50%;
  background: $clay-primary;
}

.block-list-text {
  flex: 1;
  font-size: 27rpx;
  line-height: 1.75;
  color: $clay-muted;
}

.block-stats {
  display: flex;
  flex-wrap: wrap;
  margin: 16rpx 0 28rpx;
}

.block-stat {
  flex: 1 1 40%;
  min-width: 40%;
  margin: 0 12rpx 16rpx 0;
  padding: 24rpx 22rpx;
  @include clay-surface($clay-surface, 32rpx);

  &:nth-child(2n) {
    margin-right: 0;
  }
}

.block-stat__value {
  font-size: 40rpx;
  font-weight: 800;
  line-height: 1.3;
}

.block-stat__value--risk {
  color: #c06a3c;
}

.block-stat__value--tech {
  color: $clay-primary-deep;
}

.block-stat__value--action {
  color: #2f8a7b;
}

.block-stat__label {
  margin-top: 8rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: $clay-text;
}

.block-stat__note {
  margin-top: 6rpx;
  font-size: 21rpx;
  line-height: 1.5;
  color: $clay-muted;
}

.block-tip {
  margin: 20rpx 0 28rpx;
  padding: 26rpx 30rpx;
  border-radius: 32rpx;
}

.block-tip--risk {
  background: rgba(255, 190, 138, 0.2);
  box-shadow:
    inset 0 6rpx 14rpx rgba(255, 190, 138, 0.22),
    inset 0 -6rpx 12rpx rgba(255, 255, 255, 0.7);
}

.block-tip--tech {
  background: rgba(79, 124, 255, 0.12);
  box-shadow:
    inset 0 6rpx 14rpx rgba(79, 124, 255, 0.12),
    inset 0 -6rpx 12rpx rgba(255, 255, 255, 0.7);
}

.block-tip--action {
  background: rgba(134, 217, 196, 0.22);
  box-shadow:
    inset 0 6rpx 14rpx rgba(134, 217, 196, 0.2),
    inset 0 -6rpx 12rpx rgba(255, 255, 255, 0.7);
}

.block-tip__title {
  margin-bottom: 8rpx;
  font-size: 25rpx;
  font-weight: 700;
  color: $clay-primary-deep;
}

.block-tip__text {
  font-size: 26rpx;
  line-height: 1.7;
  color: $clay-muted;
}
```

- [ ] **Step 3: 创建详情页**

`src/pages/knowledge/detail.tsx`：

```tsx
import { useState } from 'react'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import BlockRenderer from '../../components/knowledge/BlockRenderer'
import { getArticle, getRelatedArticles } from '../../content/knowledge'
import { TOPICS } from '../../content/knowledge/topics'
import { readStorage, writeStorage } from '../../utils/storage'

import './detail.scss'

const FAVORITES_KEY = 'knowledge_favorites'
const QUIZ_KEY = 'knowledge_quiz_best'

function KnowledgeDetail() {
  const router = useRouter()
  const id = router.params.id || ''
  const article = getArticle(id)

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = readStorage<string[]>(FAVORITES_KEY, [])
    return Array.isArray(saved) ? saved : []
  })
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [best, setBest] = useState(() => {
    const saved = readStorage<Record<string, number>>(QUIZ_KEY, {})
    const value = saved && typeof saved === 'object' ? saved[id] : 0
    return typeof value === 'number' ? value : 0
  })

  useShareAppMessage(() => ({
    title: article ? article.title : '垃圾分类知识',
    path: `/pages/knowledge/detail?id=${id}`
  }))

  if (!article) {
    return (
      <View className='knowledge-detail knowledge-detail--missing'>
        <View className='detail-missing'>文章不存在</View>
        <View className='detail-back' onClick={() => Taro.navigateBack()}>
          返回
        </View>
      </View>
    )
  }

  const favorited = favorites.indexOf(id) !== -1
  const related = getRelatedArticles(article)
  const currentQuestion = article.quiz[questionIndex]
  const isLast = questionIndex === article.quiz.length - 1

  const toggleFavorite = () => {
    const next = favorited
      ? favorites.filter(item => item !== id)
      : favorites.concat(id)
    setFavorites(next)
    writeStorage(FAVORITES_KEY, next)
    Taro.showToast({
      title: favorited ? '已取消收藏' : '已收藏',
      icon: 'none'
    })
  }

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) {
      return
    }
    setSelected(optionIndex)
  }

  const handleNext = () => {
    if (selected === null) {
      return
    }
    const nextScore = score + (selected === currentQuestion.answer ? 1 : 0)
    setScore(nextScore)

    if (isLast) {
      setFinished(true)
      if (nextScore > best) {
        setBest(nextScore)
        const saved = readStorage<Record<string, number>>(QUIZ_KEY, {})
        writeStorage(QUIZ_KEY, { ...saved, [id]: nextScore })
      }
      return
    }

    setQuestionIndex(questionIndex + 1)
    setSelected(null)
  }

  const resetQuiz = () => {
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  const optionClass = (optionIndex: number) => {
    if (selected === null) {
      return 'quiz-option'
    }
    if (optionIndex === currentQuestion.answer) {
      return 'quiz-option is-correct'
    }
    if (optionIndex === selected) {
      return 'quiz-option is-wrong'
    }
    return 'quiz-option is-muted'
  }

  const openRelated = (relatedId: string) => {
    Taro.redirectTo({ url: `/pages/knowledge/detail?id=${relatedId}` })
  }

  return (
    <View className='knowledge-detail'>
      <View className='detail-head'>
        <View className={'detail-topic ' + TOPICS[article.topic].className}>
          {TOPICS[article.topic].label}
        </View>
        <View className='detail-title'>{article.title}</View>
        <View className='detail-meta'>
          {article.readMinutes} 分钟阅读 · {article.quiz.length} 题小测
        </View>
      </View>

      <BlockRenderer blocks={article.blocks} topic={article.topic} />

      <View className='detail-takeaway'>
        <View className='detail-takeaway__label'>一句话总结</View>
        <View className='detail-takeaway__text'>{article.takeaway}</View>
      </View>

      {article.quiz.length > 0 && (
        <View className='detail-section'>
          <View className='detail-section__title'>文末小测</View>
          {!finished ? (
            <View className='quiz'>
              <View className='quiz__progress'>
                第 {questionIndex + 1} / {article.quiz.length} 题
              </View>
              <View className='quiz__question'>{currentQuestion.question}</View>
              {currentQuestion.options.map((option, optionIndex) => (
                <View
                  key={option}
                  className={optionClass(optionIndex)}
                  onClick={() => handleSelect(optionIndex)}
                >
                  {option}
                </View>
              ))}
              {selected !== null && (
                <View className='quiz__explain'>{currentQuestion.explanation}</View>
              )}
              <View
                className={'quiz__next' + (selected === null ? ' is-disabled' : '')}
                onClick={handleNext}
              >
                {isLast ? '查看结果' : '下一题'}
              </View>
            </View>
          ) : (
            <View className='quiz-result'>
              <View className='quiz-result__score'>
                {score}/{article.quiz.length}
              </View>
              <View className='quiz-result__text'>
                {score === article.quiz.length
                  ? '全部答对，厉害！'
                  : '看看解析，下次会更好'}
              </View>
              <View className='quiz-result__best'>
                最高分 {best}/{article.quiz.length}
              </View>
              <View className='quiz-result__again' onClick={resetQuiz}>
                再测一次
              </View>
            </View>
          )}
        </View>
      )}

      <View className='detail-section'>
        <View className='detail-section__title'>相关阅读</View>
        {related.map(item => (
          <View
            className='related-item'
            key={item.id}
            onClick={() => openRelated(item.id)}
          >
            <View className='related-item__emoji'>{item.emoji}</View>
            <View className='related-item__body'>
              <View className='related-item__title'>{item.title}</View>
              <View className='related-item__meta'>
                {TOPICS[item.topic].label} · {item.readMinutes} 分钟
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className='detail-section'>
        <View className='detail-section__title'>资料来源</View>
        {article.sources.map(source => (
          <View className='detail-source' key={source}>
            {source}
          </View>
        ))}
      </View>

      <View className='detail-note'>各地分类标准略有差异，具体以当地规定为准。</View>

      <Button className='detail-share' openType='share'>
        分享这篇文章
      </Button>

      <View className='detail-fav' onClick={toggleFavorite}>
        {favorited ? '★ 已收藏' : '☆ 收藏'}
      </View>
    </View>
  )
}

export default KnowledgeDetail
```

- [ ] **Step 4: 创建详情页配置**

`src/pages/knowledge/detail.config.ts`：

```ts
export default definePageConfig({
  navigationBarTitleText: '知识科普',
  navigationBarTextStyle: 'black',
  navigationBarBackgroundColor: '#e8edf7'
})
```

- [ ] **Step 5: 创建详情页样式**

`src/pages/knowledge/detail.scss`：

```scss
@import '../../styles/clay.scss';

page {
  background: $clay-bg;
}

.knowledge-detail {
  min-height: 100vh;
  padding: 40rpx 36rpx calc(180rpx + env(safe-area-inset-bottom));
  color: $clay-text;
}

.detail-head {
  margin-bottom: 24rpx;
}

.detail-topic {
  display: inline-block;
  padding: 8rpx 22rpx;
  font-size: 23rpx;
  font-weight: 600;
  border-radius: 999rpx;
  color: $clay-text;
}

.detail-title {
  margin-top: 18rpx;
  font-size: 44rpx;
  font-weight: 800;
  line-height: 1.4;
  color: $clay-text;
}

.detail-meta {
  margin-top: 12rpx;
  font-size: 23rpx;
  color: $clay-muted;
}

.detail-takeaway {
  margin: 36rpx 0 20rpx;
  padding: 28rpx 30rpx;
  @include clay-surface($clay-surface, 36rpx);
}

.detail-takeaway__label {
  font-size: 23rpx;
  font-weight: 700;
  color: $clay-primary-deep;
}

.detail-takeaway__text {
  margin-top: 10rpx;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.7;
  color: $clay-text;
}

.detail-section {
  margin-top: 40rpx;
}

.detail-section__title {
  margin-bottom: 20rpx;
  font-size: 30rpx;
  font-weight: 800;
  color: $clay-text;
}

.quiz {
  padding: 28rpx;
  @include clay-surface($clay-surface, 36rpx);
}

.quiz__progress {
  font-size: 23rpx;
  color: $clay-muted;
}

.quiz__question {
  margin: 14rpx 0 22rpx;
  font-size: 29rpx;
  font-weight: 700;
  line-height: 1.6;
  color: $clay-text;
}

.quiz-option {
  margin-bottom: 16rpx;
  padding: 22rpx 26rpx;
  font-size: 27rpx;
  line-height: 1.5;
  color: $clay-text;
  border-radius: 999rpx;
  background: $clay-surface-soft;
  box-shadow:
    0 6rpx 12rpx rgba(106, 126, 168, 0.12),
    inset 0 4rpx 8rpx rgba(255, 255, 255, 0.8);

  &:active {
    @include clay-pressed(999rpx);
  }
}

.quiz-option.is-correct {
  color: #2f8a7b;
  background: rgba(72, 209, 204, 0.2);
  box-shadow: inset 0 6rpx 14rpx rgba(72, 209, 204, 0.24);
}

.quiz-option.is-wrong {
  color: #d84b58;
  background: rgba(239, 95, 107, 0.16);
  box-shadow: inset 0 6rpx 14rpx rgba(239, 95, 107, 0.2);
}

.quiz-option.is-muted {
  color: $clay-muted;
  opacity: 0.7;
}

.quiz__explain {
  margin: 8rpx 0 20rpx;
  padding: 22rpx 26rpx;
  font-size: 25rpx;
  line-height: 1.7;
  color: $clay-muted;
  border-radius: 28rpx;
  background: rgba(79, 124, 255, 0.1);
}

.quiz__next {
  height: 84rpx;
  line-height: 84rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
  @include clay-button();

  &.is-disabled {
    opacity: 0.45;
  }
}

.quiz-result {
  padding: 36rpx 28rpx;
  text-align: center;
  @include clay-surface($clay-surface, 36rpx);
}

.quiz-result__score {
  font-size: 64rpx;
  font-weight: 800;
  color: $clay-primary-deep;
}

.quiz-result__text {
  margin-top: 10rpx;
  font-size: 27rpx;
  color: $clay-muted;
}

.quiz-result__best {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: $clay-muted;
}

.quiz-result__again {
  margin-top: 26rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 27rpx;
  font-weight: 700;
  color: #ffffff;
  @include clay-button();
}

.related-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  padding: 22rpx 26rpx;
  @include clay-surface($clay-surface-soft, 32rpx);

  &:active {
    @include clay-pressed(32rpx);
  }
}

.related-item__emoji {
  width: 76rpx;
  height: 76rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  background: linear-gradient(140deg, #c9d9ff, #e3d8ff);
}

.related-item__body {
  flex: 1;
  min-width: 0;
}

.related-item__title {
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.5;
  color: $clay-text;
}

.related-item__meta {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: $clay-muted;
}

.detail-source {
  margin-bottom: 10rpx;
  font-size: 23rpx;
  line-height: 1.6;
  color: $clay-muted;
}

.detail-note {
  margin-top: 36rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: $clay-muted;
  text-align: center;
}

.detail-share {
  height: 92rpx;
  margin-top: 36rpx;
  line-height: 92rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
  @include clay-button();
}

.detail-fav {
  position: fixed;
  right: 40rpx;
  bottom: calc(60rpx + env(safe-area-inset-bottom));
  z-index: 100;
  height: 88rpx;
  padding: 0 30rpx;
  line-height: 88rpx;
  font-size: 25rpx;
  font-weight: 700;
  color: #ffffff;
  @include clay-button();
}

.knowledge-detail--missing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.detail-missing {
  font-size: 32rpx;
  font-weight: 700;
  color: $clay-text;
}

.detail-back {
  margin-top: 28rpx;
  padding: 16rpx 56rpx;
  font-size: 27rpx;
  color: #ffffff;
  @include clay-button();
}
```

- [ ] **Step 6: 补注册详情页**

在 `src/app.config.ts` 的 `pages` 数组末尾补加（Task 5 已加入列表页）：

```ts
'pages/knowledge/detail'
```

- [ ] **Step 7: 运行类型检查与构建**

Run: `npm run typecheck`
Expected: 通过。

Run: `npm run build:weapp`
Expected: 构建成功。

- [ ] **Step 8: 提交**

```bash
git add src/components/knowledge src/pages/knowledge src/app.config.ts
git commit -m "feat: 新增文章详情页与小测区块渲染"
```

---

### Task 7: 首页入口与分类详情延伸阅读

**Files:**
- Modify: `src/pages/index/index.tsx`
- Modify: `src/pages/index/index.scss`
- Modify: `src/pages/detail/detail.tsx`
- Modify: `src/pages/detail/detail.scss`

**Interfaces:**
- Consumes: `getArticle`、`TOPICS`
- Produces: 首页入口 `/pages/knowledge/index`；分类详情页到文章详情的跳转

- [ ] **Step 1: 首页添加入口逻辑**

在 `src/pages/index/index.tsx` 的 `routeGo` 函数后面加入：

```tsx
const goKnowledge = () => {
  Taro.navigateTo({ url: '/pages/knowledge/index' })
}
```

- [ ] **Step 2: 首页添加入口 JSX**

在首页 JSX 中，找到 `img-container` 对应的 `{ ... }` 块（渲染四个分类图片的那段），在它之后、`.desc` 块之前插入：

```tsx
{
  garbageList.length === 0 && !search && !focused &&
    <View className='knowledge-entry' onClick={goKnowledge}>
      <View className='knowledge-entry__icon'>📚</View>
      <View className='knowledge-entry__body'>
        <View className='knowledge-entry__title'>垃圾去哪了？</View>
        <View className='knowledge-entry__desc'>环境风险 · 处理技术 · 减量行动</View>
      </View>
      <View className='knowledge-entry__arrow'>›</View>
    </View>
}
```

- [ ] **Step 3: 首页入口样式**

在 `src/pages/index/index.scss` 的 `.index-container` 内部追加：

```scss
.knowledge-entry {
  display: flex;
  align-items: center;
  margin-top: 28rpx;
  padding: 26rpx 28rpx;
  @include clay-surface($clay-surface, 40rpx);
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }

  &__icon {
    width: 88rpx;
    height: 88rpx;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 42rpx;
    border-radius: 28rpx;
    background: linear-gradient(140deg, #c9d9ff, #e3d8ff);
    box-shadow: inset 0 6rpx 12rpx rgba(255, 255, 255, 0.7);
  }

  &__body {
    flex: 1;
    margin-left: 22rpx;
    min-width: 0;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 800;
    color: $clay-text;
  }

  &__desc {
    margin-top: 6rpx;
    font-size: 23rpx;
    color: $clay-muted;
  }

  &__arrow {
    font-size: 40rpx;
    color: $clay-muted;
    padding-left: 12rpx;
  }
}
```

- [ ] **Step 4: 分类详情页引入文章查询**

在 `src/pages/detail/detail.tsx` 顶部加入：

```tsx
import { getArticle } from '../../content/knowledge'
import { TOPICS } from '../../content/knowledge/topics'
```

在文件顶部常量区加入：

```ts
const RELATED: string[][] = [
  ['kitchen-waste', 'three-r'],
  ['waste-to-energy', 'landfill'],
  ['chemical-recycling', 'old-clothes'],
  ['e-waste', 'waste-to-energy']
]
```

- [ ] **Step 5: 分类详情页渲染延伸阅读**

在 `Detail` 组件的 `return` 中，找到最后一个 `requireDesc` 对应的 `</View>`（投放要求内容之后），在它后面、`.container` 结束前插入：

```tsx
{(RELATED[index] || []).length > 0 && (
  <View className='require'>延伸阅读</View>
)}
{(RELATED[index] || []).map(articleId => {
  const item = getArticle(articleId)
  if (!item) {
    return null
  }
  return (
    <View
      className='related'
      key={item.id}
      onClick={() => {
        Taro.navigateTo({ url: `/pages/knowledge/detail?id=${item.id}` })
      }}
    >
      <View className='related__emoji'>{item.emoji}</View>
      <View className='related__body'>
        <View className='related__title'>{item.title}</View>
        <View className='related__meta'>
          {TOPICS[item.topic].label} · {item.readMinutes} 分钟
        </View>
      </View>
    </View>
  )
})}
```

- [ ] **Step 6: 分类详情页延伸阅读样式**

在 `src/pages/detail/detail.scss` 的 `.container` 内部追加：

```scss
.related {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
  padding: 22rpx 26rpx;
  @include clay-surface($clay-surface-soft, 30rpx);

  &:active {
    @include clay-pressed(30rpx);
  }

  &__emoji {
    width: 72rpx;
    height: 72rpx;
    flex-shrink: 0;
    margin-right: 18rpx;
    border-radius: 22rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    background: linear-gradient(140deg, #c9d9ff, #e3d8ff);
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 27rpx;
    font-weight: 700;
    line-height: 1.5;
    color: $clay-text;
  }

  &__meta {
    margin-top: 6rpx;
    font-size: 22rpx;
    color: $clay-muted;
  }
}
```

- [ ] **Step 7: 运行类型检查与构建**

Run: `npm run typecheck`
Expected: 通过。

Run: `npm run build:weapp`
Expected: 构建成功。

- [ ] **Step 8: 提交**

```bash
git add src/pages/index/index.tsx src/pages/index/index.scss src/pages/detail/detail.tsx src/pages/detail/detail.scss
git commit -m "feat: 首页接入知识入口并串联分类详情延伸阅读"
```

---

### Task 8: 集成验收

**Files:**
- Modify: 如有问题，回到对应文件修复
- Test: 微信开发者工具手测

**Interfaces:**
- Consumes: 前 7 个任务的全部产物
- Produces: 可发布的完整知识模块

- [ ] **Step 1: 全量类型检查**

Run: `npm run typecheck`
Expected: 通过，无错误。

- [ ] **Step 2: 生产构建**

Run: `npm run build:weapp`
Expected: 构建成功，`dist` 生成知识模块页面。

- [ ] **Step 3: 微信开发者工具手测**

打开微信开发者工具，导入 `dist`，逐项验证：

- [ ] 首页空闲态显示“垃圾去哪了？”入口。
- [ ] 搜索框聚焦或出现搜索结果时，入口隐藏。
- [ ] 点击入口进入知识列表，tabBar 仍只有首页/测验/预报三项。
- [ ] 列表显示 12 篇文章，环境风险 4 篇、处理技术 5 篇、减量行动 3 篇。
- [ ] “全部”下推荐卡片置顶且只出现一次。
- [ ] 四个主题筛选结果正确。
- [ ] 卡片右上角收藏/取消收藏即时生效并 toast。
- [ ] 重启小程序后收藏仍保留；“收藏”筛选数量正确。
- [ ] 清空收藏后显示空状态。
- [ ] 打开文章详情，heading、paragraph、list、stats、tip 五种区块都能正常显示。
- [ ] 一句话总结、资料来源、免责提示正常显示。
- [ ] 小测答对显示绿色、答错显示红色，解析正确。
- [ ] 未选选项时“下一题”不可用。
- [ ] 完成 3 题后显示得分与最高分；重进文章最高分保留。
- [ ] 点击相关阅读后页面替换，不产生多层返回。
- [ ] 点击“分享这篇文章”或右上角菜单分享，标题为文章标题，路径带 `id`。
- [ ] 手动访问 `pages/knowledge/detail?id=not-exist` 显示“文章不存在”。
- [ ] 四个分类详情页底部的延伸阅读链接均能打开对应文章。
- [ ] 页面没有评论、点赞、投稿、视频、付费入口。
- [ ] 页面没有外部图片和外链。

- [ ] **Step 4: 修复手测问题**

对每个失败项：定位文件 → 修复 → 重新运行 `npm run typecheck` 与 `npm run build:weapp` → 重新手测该项。

- [ ] **Step 5: 提交验收修复**

```bash
git add -A
git commit -m "fix: 知识模块集成验收修复"
```

若手测无问题，跳过本步骤。
