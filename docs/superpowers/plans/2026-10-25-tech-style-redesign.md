# 简约科技风改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** `docs/superpowers/specs/2026-10-25-tech-style-redesign-design.md`

**Goal:** 将 wxSapp 全站从粘土拟态改为浅色极简科技风，移除首页广告，首页新增今日一题/今日贴士/数据速览/热门搜索，并把自定义 tabBar 换成系统 tabBar。

**Architecture:** 新建 `src/styles/tech.scss` 作为唯一设计令牌层；各页面逐页从 clay mixin 迁移到 tech mixin。首页新增 4 个纯展示组件，数据由 `src/model/home/homeData.ts` 从现有题库与知识文章纯本地计算。系统 tabBar 由 `app.config.ts` 原生配置，删除自定义 tabBar 组件及其事件同步。

**Tech Stack:** Taro 4.3、React 18、TypeScript、SCSS、微信小程序原生 tabBar。

## Global Constraints

- 个人主体：不得加入评论、投稿、UGC、视频、直播、付费、排行榜、时政/行业资讯。
- 不新增页面、不新增后端接口、不新增网络请求、不新增权限、不新增本地存储 key。
- 不新增外部图片与外链；分类图标沿用 `src/static/image/` 现有资源。
- 首页移除 `<Ad>`；测验横幅与天气插屏广告保持现状。
- TypeScript 开启 `strictNullChecks`、`noUnusedLocals`、`noUnusedParameters`；每个任务结束必须 `npm run typecheck` 通过。
- 所有面向用户文案使用中文；英文仅作微标签（SEARCH / TODAY / DATA / KNOWLEDGE / TRENDING）。
- 项目没有测试框架：验证方式为 `npm run typecheck`、`npm run build:weapp` 和微信开发者工具手测。
- 颜色、圆角、阴影只从 `src/styles/tech.scss` 取，不在页面里另造令牌。
- 全部页面迁移完成前保留 `src/styles/clay.scss`；Task 8 才删除。

### 全局样式迁移规则（适用于 Task 4–7）

逐页把旧声明机械替换为：

| 旧 | 新 |
|---|---|
| `@import '../../styles/clay.scss'` | `@import '../../styles/tech.scss'` |
| `$clay-bg` | `$tech-bg` |
| `$clay-surface` | `$tech-surface` |
| `$clay-surface-soft` | `$tech-surface-soft` |
| `$clay-text` | `$tech-text` |
| `$clay-muted` | `$tech-muted` |
| `$clay-primary` | `$tech-primary` |
| `$clay-primary-deep` | `$tech-primary-deep` |
| `@include clay-surface($bg, $r)` | 卡片用 `@include tech-card($r)`；输入/浅底区域用 `@include tech-inset($r)` |
| `@include clay-button(...)` | `@include tech-button()` |
| `@include clay-pressed($r)` | `@include tech-pressed($r)` |
| `@include clay-inset($r)` | `@include tech-inset($r)` |
| 所有 `inset 0 ... rgba(...)` 内阴影 | 删除 |
| `rgba(79, 124, 255, 0.16)` 类蓝色浅底 | `#eff4ff` |
| `rgba(239, 95, 107, .16)` 类红色浅底 | `#fef3f2` |
| `rgba(72, 209, 204, .22)` 类绿色浅底 | `#ecfdf3` |
| `#4c5a78` / `rgba(76, 90, 120, .45)` 遮罩 | `rgba(16, 24, 40, 0.45)` |

替换完成后，页面内不得再出现 `clay` 字样。

---

### Task 1: 科技风令牌层与系统 tabBar

**Files:**
- Create: `src/styles/tech.scss`
- Modify: `src/app.config.ts`
- Delete: `src/custom-tab-bar/index.tsx`
- Delete: `src/custom-tab-bar/index.scss`
- Modify: `src/pages/index/index.tsx`（仅移除 `sync-tabbar`）
- Modify: `src/pages/index/index.scss`（仅底部间距与 import 暂不变）
- Modify: `src/pages/test/test.scss`（仅底部间距）
- Modify: `src/pages/knowledge/detail.scss`（仅底部间距）
- Modify: `src/pages/index/index.config.ts`、`src/pages/test/test.config.ts`、`src/pages/forecast/forecast.config.ts`、`src/pages/detail/detail.config.ts`、`src/pages/knowledge/index.config.ts`、`src/pages/knowledge/detail.config.ts`（导航栏底色）

**Interfaces:**
- Produces: `$tech-*` 令牌与 `tech-card` / `tech-inset` / `tech-button` / `tech-pressed` / `tech-label` mixin。

- [ ] **Step 1: 创建 `src/styles/tech.scss`**

```scss
// 简约科技风共享变量与混入
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

@mixin tech-label {
  font-size: 20rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  color: $tech-accent;
}

.tech-label {
  @include tech-label;
}

.topic-risk {
  background: #fff4ed;
  color: #b54708;
}

.topic-tech {
  background: #eff4ff;
  color: $tech-primary-deep;
}

.topic-action {
  background: #ecfdf3;
  color: #067647;
}
```

- [ ] **Step 2: `src/app.config.ts` 改为系统 tabBar**

将 `window` 的 `navigationBarBackgroundColor` 改为 `#f5f7fb`；将 `tabBar` 改为：

```ts
  tabBar: {
    color: '#667085',
    selectedColor: '#2563eb',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        text: '首页',
        iconPath: 'static/image/outline_home_black_18.png',
        selectedIconPath: 'static/image/round_home_black_18.png',
        pagePath: 'pages/index/index'
      },
      {
        text: '测验',
        iconPath: 'static/image/outline_visibility_black_18.png',
        selectedIconPath: 'static/image/round_visibility_black_18.png',
        pagePath: 'pages/test/test'
      },
      {
        text: '预报',
        iconPath: 'static/image/outline_cloud_black_18.png',
        selectedIconPath: 'static/image/round_cloud_black_18.png',
        pagePath: 'pages/forecast/forecast'
      }
    ]
  },
```

删除 `custom: true`。`pages`、`permission`、`requiredPrivateInfos` 不动。

- [ ] **Step 3: 删除自定义 tabBar**

```bash
git rm src/custom-tab-bar/index.tsx src/custom-tab-bar/index.scss
```

- [ ] **Step 4: 移除首页 `sync-tabbar`**

`src/pages/index/index.tsx`：

```tsx
// 删除 useDidShow 导入中的 useDidShow
import Taro, { useDidHide, useShareAppMessage } from '@tarojs/taro'
```

删除整段：

```tsx
  useDidShow(() => {
    Taro.eventCenter.trigger('sync-tabbar')
  })
```

- [ ] **Step 5: 收紧底部间距**

`src/pages/index/index.scss`：

```scss
  padding: 36rpx 36rpx calc(120rpx + env(safe-area-inset-bottom));
```

```scss
    bottom: calc(60rpx + env(safe-area-inset-bottom));
```

`src/pages/test/test.scss`：

```scss
  padding-bottom: calc(80rpx + env(safe-area-inset-bottom));
```

```scss
  bottom: calc(60rpx + env(safe-area-inset-bottom));
```

`src/pages/knowledge/detail.scss`：

```scss
  padding: 40rpx 36rpx calc(160rpx + env(safe-area-inset-bottom));
```

- [ ] **Step 6: 页面导航栏底色**

把以下页面配置中的 `navigationBarBackgroundColor` 改为 `#f5f7fb`：
`pages/index/index.config.ts`、`pages/test/test.config.ts`、`pages/forecast/forecast.config.ts`、`pages/detail/detail.config.ts`、`pages/knowledge/index.config.ts`、`pages/knowledge/detail.config.ts`。

- [ ] **Step 7: 验证并提交**

```bash
npm run typecheck
npm run build:weapp
git add src/styles/tech.scss src/app.config.ts src/pages/index/index.tsx src/pages/index/index.scss src/pages/test/test.scss src/pages/knowledge/detail.scss src/pages/*/*.config.ts
git commit -m "feat: 新增科技风令牌层并切换系统 tabBar"
```

---

### Task 2: 首页数据与四个新组件

**Files:**
- Create: `src/model/home/homeData.ts`
- Create: `src/components/home/DailyQuiz.tsx` + `DailyQuiz.scss`
- Create: `src/components/home/DailyTip.tsx` + `DailyTip.scss`
- Create: `src/components/home/DataStrip.tsx` + `DataStrip.scss`
- Create: `src/components/home/HotSearches.tsx` + `HotSearches.scss`

**Interfaces:**
- Consumes: `articles`（`src/content/knowledge`）、`result`（`src/static/result`）、`TOPICS`。
- Produces:
  - `CATEGORY_NAMES: string[]`
  - `DailyQuizItem { name; options; answer; explanation }`
  - `getDayKey(date: Date): string`
  - `getDayHash(key: string): number`
  - `getDailyTip(date: Date): KnowledgeArticle | undefined`
  - `getDailyQuiz(date: Date, offset?: number): DailyQuizItem | undefined`
  - `getQuizCount(): number`
  - `DailyQuiz`、`DailyTip`、`DataStrip`、`HotSearches` 默认导出。

- [ ] **Step 1: 创建 `src/model/home/homeData.ts`**

```ts
import { articles } from '../../content/knowledge'
import type { KnowledgeArticle } from '../../content/knowledge/types'
import { result } from '../../static/result'

export const CATEGORY_NAMES = ['湿垃圾', '干垃圾', '可回收物', '有害垃圾']

export interface DailyQuizItem {
  name: string
  options: string[]
  answer: number
  explanation: string
}

interface RawQuizItem {
  n: string
  c: string
}

const getQuizItems = (): RawQuizItem[] =>
  Object.values(result.data).reduce<RawQuizItem[]>(
    (list, group) => list.concat(group),
    []
  )

export const getQuizCount = (): number => getQuizItems().length

export const getDayKey = (date: Date): string => {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export const getDayHash = (key: string): number => {
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return hash
}

export const getDailyTip = (date: Date): KnowledgeArticle | undefined => {
  if (articles.length === 0) {
    return undefined
  }
  return articles[getDayHash(getDayKey(date)) % articles.length]
}

export const getDailyQuiz = (
  date: Date,
  offset = 0
): DailyQuizItem | undefined => {
  const items = getQuizItems()
  if (items.length === 0) {
    return undefined
  }
  const item = items[(getDayHash(getDayKey(date)) + offset) % items.length]
  const answer = Math.max(
    0,
    Math.min(CATEGORY_NAMES.length - 1, Number(item.c) - 1)
  )
  return {
    name: item.n,
    options: CATEGORY_NAMES.slice(),
    answer,
    explanation: `${item.n}属于${CATEGORY_NAMES[answer]}。`
  }
}
```

- [ ] **Step 2: 创建 `DailyQuiz`**

`src/components/home/DailyQuiz.tsx`：

```tsx
import { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { getDailyQuiz } from '../../model/home/homeData'

import './DailyQuiz.scss'

function DailyQuiz() {
  const [offset, setOffset] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const item = useMemo(() => getDailyQuiz(new Date(), offset), [offset])

  if (!item) {
    return null
  }

  const next = () => {
    setOffset(value => value + 1)
    setSelected(null)
  }

  const goTest = () => {
    Taro.switchTab({ url: '/pages/test/test' })
  }

  const optionClass = (index: number) => {
    if (selected === null) {
      return 'daily-quiz__option'
    }
    if (index === item.answer) {
      return 'daily-quiz__option is-correct'
    }
    if (index === selected) {
      return 'daily-quiz__option is-wrong'
    }
    return 'daily-quiz__option is-muted'
  }

  return (
    <View className='daily-quiz'>
      <View className='daily-quiz__head'>
        <Text className='tech-label'>TODAY</Text>
        <Text className='daily-quiz__hint'>这道垃圾属于哪类？</Text>
      </View>
      <View className='daily-quiz__name'>{item.name}</View>
      <View className='daily-quiz__options'>
        {item.options.map((option, index) => (
          <View
            key={option}
            className={optionClass(index)}
            onClick={() => {
              if (selected === null) {
                setSelected(index)
              }
            }}
          >
            {option}
          </View>
        ))}
      </View>
      {selected !== null && (
        <View className='daily-quiz__explain'>{item.explanation}</View>
      )}
      <View className='daily-quiz__foot'>
        <Text className='daily-quiz__again' onClick={next}>
          再来一题
        </Text>
        <Text className='daily-quiz__link' onClick={goTest}>
          去测验 ›
        </Text>
      </View>
    </View>
  )
}

export default DailyQuiz
```

`src/components/home/DailyQuiz.scss`：

```scss
@import '../../styles/tech.scss';

.daily-quiz {
  margin-top: 24rpx;
  padding: 28rpx;
  @include tech-card(24rpx);
}

.daily-quiz__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.daily-quiz__hint {
  font-size: 22rpx;
  color: $tech-muted;
}

.daily-quiz__name {
  margin-top: 14rpx;
  font-size: 34rpx;
  font-weight: 700;
  color: $tech-text;
}

.daily-quiz__options {
  display: flex;
  flex-wrap: wrap;
  margin-top: 18rpx;
}

.daily-quiz__option {
  width: calc(50% - 8rpx);
  margin: 0 16rpx 12rpx 0;
  padding: 18rpx 16rpx;
  font-size: 25rpx;
  text-align: center;
  color: $tech-text;
  @include tech-inset(14rpx);

  &:nth-child(2n) {
    margin-right: 0;
  }

  &:active {
    @include tech-pressed(14rpx);
  }
}

.daily-quiz__option.is-correct {
  color: #067647;
  background: #ecfdf3;
  border-color: #abefc6;
}

.daily-quiz__option.is-wrong {
  color: #b42318;
  background: #fef3f2;
  border-color: #fecdca;
}

.daily-quiz__option.is-muted {
  color: $tech-muted;
  opacity: 0.6;
}

.daily-quiz__explain {
  margin-top: 4rpx;
  padding: 18rpx 20rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: $tech-muted;
  background: #f9fafb;
  border-radius: 14rpx;
}

.daily-quiz__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
}

.daily-quiz__again {
  font-size: 24rpx;
  font-weight: 600;
  color: $tech-primary;
}

.daily-quiz__link {
  font-size: 24rpx;
  color: $tech-muted;
}
```

- [ ] **Step 3: 创建 `DailyTip`**

`src/components/home/DailyTip.tsx`：

```tsx
import { View, Text } from '@tarojs/components'
import type { KnowledgeArticle } from '../../content/knowledge/types'
import { TOPICS } from '../../content/knowledge/topics'

import './DailyTip.scss'

interface DailyTipProps {
  article: KnowledgeArticle
  onOpen: (id: string) => void
}

function DailyTip({ article, onOpen }: DailyTipProps) {
  const topic = TOPICS[article.topic]

  return (
    <View className='daily-tip' onClick={() => onOpen(article.id)}>
      <View className='daily-tip__head'>
        <Text className='tech-label'>TODAY</Text>
        <Text className={'daily-tip__tag ' + topic.className}>
          {topic.label}
        </Text>
      </View>
      <View className='daily-tip__text'>{article.takeaway}</View>
      <View className='daily-tip__foot'>
        <Text className='daily-tip__title'>{article.title}</Text>
        <Text className='daily-tip__link'>阅读全文 ›</Text>
      </View>
    </View>
  )
}

export default DailyTip
```

`src/components/home/DailyTip.scss`：

```scss
@import '../../styles/tech.scss';

.daily-tip {
  margin-top: 24rpx;
  padding: 28rpx;
  @include tech-card(24rpx);
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.99);
  }
}

.daily-tip__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.daily-tip__tag {
  padding: 4rpx 14rpx;
  font-size: 21rpx;
  font-weight: 600;
  border-radius: 999rpx;
}

.daily-tip__text {
  margin-top: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.65;
  color: $tech-text;
}

.daily-tip__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid $tech-border;
}

.daily-tip__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 23rpx;
  color: $tech-muted;
}

.daily-tip__link {
  flex-shrink: 0;
  margin-left: 16rpx;
  font-size: 23rpx;
  color: $tech-primary;
}
```

- [ ] **Step 4: 创建 `DataStrip`**

`src/components/home/DataStrip.tsx`：

```tsx
import { View } from '@tarojs/components'

import './DataStrip.scss'

interface DataStripProps {
  stats: Array<{ label: string; value: string }>
}

function DataStrip({ stats }: DataStripProps) {
  return (
    <View className='data-strip'>
      {stats.map(item => (
        <View className='data-strip__item' key={item.label}>
          <View className='data-strip__value'>{item.value}</View>
          <View className='data-strip__label'>{item.label}</View>
        </View>
      ))}
    </View>
  )
}

export default DataStrip
```

`src/components/home/DataStrip.scss`：

```scss
@import '../../styles/tech.scss';

.data-strip {
  display: flex;
  margin-top: 24rpx;
  padding: 24rpx 12rpx;
  @include tech-card(20rpx);
}

.data-strip__item {
  flex: 1;
  text-align: center;
  border-right: 1rpx solid $tech-border;

  &:last-child {
    border-right: 0;
  }
}

.data-strip__value {
  font-size: 30rpx;
  font-weight: 700;
  color: $tech-text;
  font-variant-numeric: tabular-nums;
}

.data-strip__label {
  margin-top: 6rpx;
  font-size: 21rpx;
  color: $tech-muted;
}
```

- [ ] **Step 5: 创建 `HotSearches`**

`src/components/home/HotSearches.tsx`：

```tsx
import { View, Text } from '@tarojs/components'

import './HotSearches.scss'

interface HotSearchesProps {
  words: string[]
  onPick: (word: string) => void
}

function HotSearches({ words, onPick }: HotSearchesProps) {
  return (
    <View className='hot-searches'>
      <View className='hot-searches__head'>
        <Text className='tech-label'>TRENDING</Text>
        <Text className='hot-searches__title'>热门搜索</Text>
      </View>
      <View className='hot-searches__chips'>
        {words.map(word => (
          <View
            className='hot-searches__chip'
            key={word}
            onClick={() => onPick(word)}
          >
            {word}
          </View>
        ))}
      </View>
    </View>
  )
}

export default HotSearches
```

`src/components/home/HotSearches.scss`：

```scss
@import '../../styles/tech.scss';

.hot-searches {
  margin-top: 24rpx;
  padding: 24rpx 26rpx 16rpx;
  @include tech-card(20rpx);
}

.hot-searches__head {
  display: flex;
  align-items: center;
}

.hot-searches__title {
  margin-left: 12rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: $tech-text;
}

.hot-searches__chips {
  display: flex;
  flex-wrap: wrap;
  margin-top: 14rpx;
}

.hot-searches__chip {
  margin: 0 14rpx 14rpx 0;
  padding: 10rpx 22rpx;
  font-size: 24rpx;
  color: $tech-text;
  background: #f9fafb;
  border: 1rpx solid $tech-border;
  border-radius: 999rpx;

  &:active {
    background: #eff4ff;
    border-color: #b2ccff;
  }
}
```

- [ ] **Step 6: 验证并提交**

```bash
npm run typecheck
git add src/model/home src/components/home
git commit -m "feat: 新增首页今日一题、贴士、数据与热门搜索组件"
```

---

### Task 3: 首页改版与广告移除

**Files:**
- Modify: `src/pages/index/index.tsx`
- Rewrite: `src/pages/index/index.scss`

**Interfaces:**
- Consumes: `DailyQuiz`、`DailyTip`、`DataStrip`、`HotSearches`；`getDailyTip`、`getQuizCount`；`articles`。
- Produces: 科技风首页，无首页广告。

- [ ] **Step 1: 重写 `src/pages/index/index.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'
import Taro, { useDidHide, useShareAppMessage } from '@tarojs/taro'
import { View, Icon, Input, Button, Text } from '@tarojs/components'
import { SearchGarbage } from '../../api/index'
import IndexModel from '../../model/index/index'
import { GarbageItem, SelectedSort } from '../../type/index'
import { readStorage, writeStorage } from '../../utils/storage'
import { articles } from '../../content/knowledge'
import { getDailyTip, getQuizCount } from '../../model/home/homeData'
import DailyQuiz from '../../components/home/DailyQuiz'
import DailyTip from '../../components/home/DailyTip'
import DataStrip from '../../components/home/DataStrip'
import HotSearches from '../../components/home/HotSearches'
import { ITouchEvent } from '@tarojs/components/types/common'

import './index.scss'

const CATEGORIES = [
  { name: '湿垃圾', en: 'WET', icon: 'ico-3', desc: '易腐有机物', index: 0 },
  { name: '干垃圾', en: 'DRY', icon: 'ico-4', desc: '其他生活废弃物', index: 1 },
  { name: '可回收物', en: 'RECYCLE', icon: 'ico-2', desc: '玻金塑纸衣', index: 2 },
  { name: '有害垃圾', en: 'HAZARDOUS', icon: 'ico-1', desc: '电池药品灯管', index: 3 }
]
const HOT_SEARCHES = ['电池', '塑料瓶', '剩菜剩饭', '快递纸箱', '口罩', '旧衣服']
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const HISTORY_KEY = 'garbage_search_history'
const HISTORY_MAX = 10

const categoryTone = (category: string) => {
  if (category === '湿垃圾') return 'wet'
  if (category === '干垃圾') return 'dry'
  if (category === '可回收物') return 'recycle'
  if (category === '有害垃圾') return 'harmful'
  return 'other'
}

function Index() {
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const [garbageList, setGarbageList] = useState<GarbageItem[]>([])
  const [selectedSort, setSelectedSort] = useState<SelectedSort | null>(null)
  const [history, setHistory] = useState<string[]>(() =>
    readStorage<string[]>(HISTORY_KEY, [])
  )
  const requestId = useRef(0)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const now = new Date()
  const dateLabel = `${now.getMonth() + 1}月${now.getDate()}日 周${
    WEEKDAYS[now.getDay()]
  }`
  const dailyTip = getDailyTip(now)
  const quizCount = getQuizCount()
  const stats = [
    { label: '分类数据', value: `${quizCount} 条` },
    { label: '科普文章', value: `${articles.length} 篇` },
    { label: '分类标准', value: '4 类' }
  ]

  useShareAppMessage(() => ({ title: '垃圾分类助手' }))

  useEffect(() => () => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
    }
  }, [])

  const handleFocus = () => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
    setFocused(true)
  }

  // 延迟隐藏，避免点击「最近搜索」时先触发 blur 导致列表被移除
  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setFocused(false), 150)
  }

  // 点击输入框以外区域时主动收起搜索面板
  const closeSearchPanel = () => {
    if (!focused) {
      return
    }
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
    setFocused(false)
    Taro.hideKeyboard()
  }

  useDidHide(() => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
    setFocused(false)
  })

  const clear = () => {
    requestId.current += 1
    setGarbageList([])
    setSearch('')
  }

  const pushHistory = (word: string) => {
    const next = [word, ...history.filter(item => item !== word)].slice(
      0,
      HISTORY_MAX
    )
    setHistory(next)
    writeStorage(HISTORY_KEY, next)
  }

  const clearHistory = () => {
    setHistory([])
    writeStorage(HISTORY_KEY, [])
  }

  const runSearch = async (raw: string, record = false) => {
    const str = raw.trim()
    setSearch(raw)
    if (!str) {
      clear()
      return
    }
    if (record) {
      pushHistory(str)
    }
    const currentId = ++requestId.current
    try {
      const list = await SearchGarbage(str)
      if (currentId === requestId.current) {
        setGarbageList(list)
      }
    } catch (err) {
      if (currentId === requestId.current) {
        setGarbageList([])
        Taro.showToast({
          title: err instanceof Error ? err.message : '查询失败',
          icon: 'none'
        })
      }
    }
  }

  const seach = (e: any) => {
    runSearch(e.detail.value)
  }

  const confirmSearch = () => {
    runSearch(search, true)
  }

  const searchSort = (e: ITouchEvent) => {
    const name = e.currentTarget.dataset.name as string
    const data = garbageList.find(item => item.name === name)
    if (!data) {
      return
    }
    pushHistory(data.name)
    const index = IndexModel.handleCategory(data.category)
    if (index === undefined) {
      Taro.showToast({ title: '暂不支持该垃圾类型', icon: 'none' })
      return
    }
    setSelectedSort(IndexModel.getSort(index))
  }

  const dismiss = () => {
    setSelectedSort(null)
  }

  const routeGo = (index: number) => {
    Taro.navigateTo({ url: `/pages/detail/detail?index=${index}` })
  }

  const goKnowledge = () => {
    Taro.navigateTo({ url: '/pages/knowledge/index' })
  }

  const openArticle = (id: string) => {
    Taro.navigateTo({ url: `/pages/knowledge/detail?id=${id}` })
  }

  const idle = garbageList.length === 0 && !search && !focused

  return (
    <View className='index-container' onClick={closeSearchPanel}>
      <View className='home-head'>
        <View>
          <View className='home-brand'>垃圾分类助手</View>
          <View className='home-sub'>上海生活垃圾分类查询</View>
        </View>
        <View className='home-meta'>
          <Text className='home-tag'>上海标准</Text>
          <Text className='home-date'>{dateLabel}</Text>
        </View>
      </View>

      <View className='searchFiled' onClick={e => e.stopPropagation()}>
        <Icon type='search' color='#667085' />
        <Input
          className='input'
          placeholder='输入垃圾名称'
          confirmType='search'
          onInput={seach}
          onConfirm={confirmSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={search}
        />
        <View onClick={clear} className='icon'>
          <Icon type='cancel' color='#98a2b3' />
        </View>
      </View>

      {!search && focused && history.length > 0 && (
        <View className='search-history'>
          <View className='chip-head'>
            <Text className='chip-title'>最近搜索</Text>
            <Text className='chip-clear' onClick={clearHistory}>
              清除
            </Text>
          </View>
          <View className='chip-wrap'>
            {history.map(word => (
              <View
                className='chip'
                key={word}
                onClick={() => runSearch(word, true)}
              >
                {word}
              </View>
            ))}
          </View>
        </View>
      )}

      {!search && focused && (
        <View className='search-history'>
          <View className='chip-head'>
            <Text className='chip-title'>热门搜索</Text>
          </View>
          <View className='chip-wrap'>
            {HOT_SEARCHES.map(word => (
              <View
                className='chip'
                key={word}
                onClick={() => runSearch(word, true)}
              >
                {word}
              </View>
            ))}
          </View>
        </View>
      )}

      {garbageList.length > 0 && (
        <View className='searchResults'>
          {garbageList.map((item, index) => (
            <View className='searchList' key={`${item.name}-${index}`}>
              <View
                className='searchCell'
                onClick={searchSort}
                data-name={item.name}
              >
                <Text className='search-name'>{item.name}</Text>
                <Text className={'tag tag-' + categoryTone(item.category)}>
                  {item.category}
                </Text>
              </View>
              <View className='line'></View>
            </View>
          ))}
        </View>
      )}

      {search && garbageList.length === 0 && (
        <View className='desc'>未找到相关垃圾分类信息</View>
      )}

      {idle && (
        <>
          <View className='section-head'>
            <Text className='section-title'>分类查询</Text>
            <Text className='section-note'>SELECT</Text>
          </View>
          <View className='category-grid'>
            {CATEGORIES.map(item => (
              <View
                className='category-card'
                key={item.name}
                onClick={() => routeGo(item.index)}
              >
                <View className={'category-card__icon ' + item.icon} />
                <View className='category-card__body'>
                  <View className='category-card__name'>{item.name}</View>
                  <View className='category-card__en'>{item.en}</View>
                  <View className='category-card__desc'>{item.desc}</View>
                </View>
                <View className='category-card__arrow'>›</View>
              </View>
            ))}
          </View>

          <DailyQuiz />

          {dailyTip && <DailyTip article={dailyTip} onOpen={openArticle} />}

          {quizCount > 0 && <DataStrip stats={stats} />}

          <HotSearches words={HOT_SEARCHES} onPick={word => runSearch(word, true)} />

          <View className='knowledge-entry' onClick={goKnowledge}>
            <View className='knowledge-entry__icon'>📚</View>
            <View className='knowledge-entry__body'>
              <Text className='knowledge-entry__label'>KNOWLEDGE</Text>
              <View className='knowledge-entry__title'>垃圾去哪了？</View>
              <View className='knowledge-entry__desc'>
                环境风险 · 处理技术 · 减量行动
              </View>
            </View>
            <View className='knowledge-entry__arrow'>›</View>
          </View>

          <View className='desc'>
            工具说明: 上海垃圾分类查询小工具，2019年7月1日,《上海市生活垃圾管理条例》正式实施，生活垃圾按照
            <Text>"可回收物"、"有害垃圾"、"湿垃圾"、"干垃圾"</Text>
            的分类标准。
          </View>
        </>
      )}

      {selectedSort !== null && (
        <View className='resultback' onClick={dismiss}>
          <View className='resultView'>
            <View className='resultHead'>{selectedSort.name}</View>
            <View className='desView'>
              <View
                className={'bigIcon ' + selectedSort.iconClass}
                style={{ backgroundColor: selectedSort.color }}
              ></View>
              {selectedSort.des}
            </View>
            {selectedSort.inc && (
              <View className='title'>{selectedSort.name}主要包括</View>
            )}
            <View className='des'>{selectedSort.inc}</View>
            {selectedSort.req && (
              <View className='title'>{selectedSort.name}投放要求</View>
            )}
            <View className='des'>{selectedSort.req}</View>
          </View>
        </View>
      )}

      {!focused && (
        <Button className='button' openType='share'>
          分享
        </Button>
      )}
    </View>
  )
}

export default Index
```

- [ ] **Step 2: 重写 `src/pages/index/index.scss`**

```scss
@import '../../styles/tech.scss';

page {
  background: $tech-bg;
}

.index-container {
  min-height: 100vh;
  padding: 32rpx 32rpx calc(120rpx + env(safe-area-inset-bottom));
  color: $tech-text;
}

.home-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8rpx 4rpx 24rpx;
}

.home-brand {
  font-size: 40rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
  color: $tech-text;
}

.home-sub {
  margin-top: 6rpx;
  font-size: 23rpx;
  color: $tech-muted;
}

.home-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.home-tag {
  padding: 4rpx 14rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: $tech-primary-deep;
  background: #eff4ff;
  border: 1rpx solid #b2ccff;
  border-radius: 999rpx;
}

.home-date {
  margin-top: 8rpx;
  font-size: 21rpx;
  color: $tech-muted;
  font-variant-numeric: tabular-nums;
}

.searchFiled {
  height: 96rpx;
  padding: 0 18rpx 0 28rpx;
  display: flex;
  align-items: center;
  background: $tech-surface;
  border: 1rpx solid $tech-border;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(16, 24, 40, 0.05);

  .input {
    flex: 1;
    padding: 0 20rpx;
    background: transparent;
    color: $tech-text;
    font-size: 28rpx;
    text-align: left;
  }

  .icon {
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f9fafb;
  }
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32rpx 4rpx 16rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: $tech-text;
}

.section-note {
  @include tech-label;
  color: $tech-muted;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.category-card {
  display: flex;
  align-items: center;
  width: calc(50% - 8rpx);
  margin-bottom: 16rpx;
  padding: 20rpx;
  @include tech-card(20rpx);
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
}

.category-card__icon {
  width: 88rpx;
  height: 88rpx;
  flex-shrink: 0;
  border-radius: 18rpx;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.ico-3 {
  background-image: url('../../static/image/ico-3.jpg');
}

.ico-4 {
  background-image: url('../../static/image/ico-4.jpg');
}

.ico-2 {
  background-image: url('../../static/image/ico-2.jpg');
}

.ico-1 {
  background-image: url('../../static/image/ico-1.jpg');
}

.category-card__body {
  flex: 1;
  min-width: 0;
  margin-left: 16rpx;
}

.category-card__name {
  font-size: 27rpx;
  font-weight: 700;
  color: $tech-text;
}

.category-card__en {
  @include tech-label;
  margin-top: 2rpx;
  font-size: 18rpx;
  color: $tech-muted;
}

.category-card__desc {
  margin-top: 4rpx;
  font-size: 21rpx;
  color: $tech-muted;
}

.category-card__arrow {
  flex-shrink: 0;
  font-size: 32rpx;
  color: $tech-border-strong;
}

.knowledge-entry {
  display: flex;
  align-items: center;
  margin-top: 24rpx;
  padding: 26rpx;
  @include tech-card(24rpx);
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.99);
  }
}

.knowledge-entry__icon {
  width: 80rpx;
  height: 80rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  border-radius: 18rpx;
  background: linear-gradient(135deg, #eff4ff, #e6fbff);
}

.knowledge-entry__body {
  flex: 1;
  min-width: 0;
  margin-left: 18rpx;
}

.knowledge-entry__label {
  @include tech-label;
  font-size: 18rpx;
}

.knowledge-entry__title {
  margin-top: 4rpx;
  font-size: 29rpx;
  font-weight: 700;
  color: $tech-text;
}

.knowledge-entry__desc {
  margin-top: 4rpx;
  font-size: 22rpx;
  color: $tech-muted;
}

.knowledge-entry__arrow {
  flex-shrink: 0;
  font-size: 34rpx;
  color: $tech-border-strong;
}

.desc {
  margin-top: 24rpx;
  padding: 24rpx 26rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: $tech-muted;
  @include tech-inset(18rpx);

  text {
    color: $tech-primary-deep;
    font-weight: 600;
  }
}

.searchResults {
  margin-top: 24rpx;
  padding: 4rpx 24rpx;
  @include tech-card(20rpx);
}

.searchCell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 92rpx;
  font-size: 28rpx;
  color: $tech-text;

  &:active {
    color: $tech-primary;
  }
}

.search-name {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.line {
  height: 1rpx;
  background: $tech-border;
}

.searchList:last-child .line {
  display: none;
}

.tag {
  flex-shrink: 0;
  margin-left: 16rpx;
  padding: 5rpx 18rpx;
  font-size: 22rpx;
  font-weight: 600;
  border-radius: 999rpx;
}

.tag-wet {
  color: #067647;
  background: #ecfdf3;
}

.tag-dry {
  color: #b54708;
  background: #fffaeb;
}

.tag-recycle {
  color: $tech-primary-deep;
  background: #eff4ff;
}

.tag-harmful {
  color: #b42318;
  background: #fef3f2;
}

.tag-other {
  color: $tech-muted;
  background: #f2f4f7;
}

.search-history {
  margin-top: 20rpx;
  padding: 22rpx 24rpx 18rpx;
  @include tech-card(20rpx);
}

.chip-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chip-title {
  font-size: 25rpx;
  font-weight: 700;
  color: $tech-text;
}

.chip-clear {
  font-size: 22rpx;
  color: $tech-muted;
}

.chip-wrap {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12rpx;
}

.chip {
  margin: 8rpx 14rpx 0 0;
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  color: $tech-text;
  background: #f9fafb;
  border: 1rpx solid $tech-border;
  border-radius: 999rpx;

  &:active {
    background: #eff4ff;
    border-color: #b2ccff;
  }
}

.resultback {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 24, 40, 0.45);
}

.resultView {
  width: 84%;
  max-height: 82vh;
  overflow: hidden;
  color: $tech-text;
  @include tech-card(24rpx);
}

.resultHead {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 132rpx;
  font-size: 44rpx;
  font-weight: 800;
  background: linear-gradient(135deg, #eff4ff, #e6fbff);
  border-bottom: 1rpx solid $tech-border;
}

.desView {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  word-break: break-all;
  font-size: 27rpx;
  line-height: 1.6;
  color: $tech-muted;
}

.bigIcon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
  border-radius: 18rpx;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.title {
  margin: 8rpx 28rpx;
  height: 56rpx;
  line-height: 56rpx;
  padding-left: 20rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: $tech-primary-deep;
  background: #eff4ff;
  border-radius: 12rpx;
}

.des {
  margin: 16rpx 32rpx 28rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: $tech-muted;
}

.button {
  @include tech-button();
  position: fixed;
  right: 36rpx;
  bottom: calc(60rpx + env(safe-area-inset-bottom));
  width: 96rpx;
  height: 96rpx;
  line-height: 96rpx;
  padding: 0;
  font-size: 22rpx;
  color: #ffffff;
  border: 0;
  z-index: 100;
}
```

- [ ] **Step 3: 验证并提交**

```bash
npm run typecheck
npm run build:weapp
git add src/pages/index/index.tsx src/pages/index/index.scss
git commit -m "feat: 首页改为科技风并移除广告"
```

---

### Task 4: 分类详情页科技风

**Files:**
- Modify: `src/pages/detail/detail.scss`
- Modify: `src/pages/detail/detail.tsx`（仅补充结构类名）

**Interfaces:**
- Consumes: `tech.scss`、现有 `RELATED` 映射。
- Produces: 科技风分类详情。

- [ ] **Step 1: 更新 `detail.tsx` 结构**

保持全部逻辑与 `RELATED` 映射不变，把 `container` 内改为：

```tsx
      <View className='container'>
        <View className='detail-hero'>
          <View className={ICON_CLASS[index] + ' detail-hero__icon'}></View>
          <View className='detail-hero__body'>
            <View className='detail-hero__name'>{NAMES[index]}</View>
            <View className='detail-hero__desc'>{DES[index]}</View>
          </View>
        </View>
        <View className='detail-block'>
          <View className='detail-block__label'>主要内容</View>
          <View className='detail-block__text'>{INCS[index]}</View>
        </View>
        <View className='detail-block'>
          <View className='detail-block__label'>投放要求</View>
          <View className='detail-block__text'>{REQS[index]}</View>
        </View>
        {(RELATED[index] || []).length > 0 && (
          <View className='detail-related-title'>延伸阅读</View>
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
                Taro.navigateTo({
                  url: `/pages/knowledge/detail?id=${item.id}`
                })
              }}
            >
              <View className='related__emoji'>{item.emoji}</View>
              <View className='related__body'>
                <View className='related__title'>{item.title}</View>
                <View className='related__meta'>
                  {TOPICS[item.topic].label} · {item.readMinutes} 分钟
                </View>
              </View>
              <View className='related__arrow'>›</View>
            </View>
          )
        })}
      </View>
```

- [ ] **Step 2: 重写 `src/pages/detail/detail.scss`**

```scss
@import '../../styles/tech.scss';

page {
  background: $tech-bg;
}

.container {
  min-height: 100vh;
  padding: 32rpx 32rpx calc(60rpx + env(safe-area-inset-bottom));
  color: $tech-text;
}

.detail-hero {
  display: flex;
  align-items: center;
  padding: 28rpx;
  @include tech-card(24rpx);
}

.detail-hero__icon {
  width: 120rpx;
  height: 120rpx;
  flex-shrink: 0;
  border-radius: 22rpx;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.detail-hero__body {
  flex: 1;
  min-width: 0;
  margin-left: 24rpx;
}

.detail-hero__name {
  font-size: 38rpx;
  font-weight: 800;
  color: $tech-text;
}

.detail-hero__desc {
  margin-top: 8rpx;
  font-size: 25rpx;
  line-height: 1.6;
  color: $tech-muted;
}

.detail-block {
  margin-top: 20rpx;
  padding: 24rpx 26rpx;
  border-left: 6rpx solid $tech-primary;
  @include tech-card(18rpx);
}

.detail-block__label {
  font-size: 24rpx;
  font-weight: 700;
  color: $tech-primary-deep;
}

.detail-block__text {
  margin-top: 10rpx;
  font-size: 26rpx;
  line-height: 1.75;
  color: $tech-muted;
}

.detail-related-title {
  margin: 32rpx 4rpx 14rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: $tech-text;
}

.related {
  display: flex;
  align-items: center;
  margin-bottom: 14rpx;
  padding: 20rpx 24rpx;
  @include tech-card(18rpx);

  &:active {
    @include tech-pressed(18rpx);
  }
}

.related__emoji {
  width: 64rpx;
  height: 64rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #eff4ff, #e6fbff);
}

.related__body {
  flex: 1;
  min-width: 0;
  margin-left: 18rpx;
}

.related__title {
  font-size: 26rpx;
  font-weight: 600;
  line-height: 1.5;
  color: $tech-text;
}

.related__meta {
  margin-top: 4rpx;
  font-size: 21rpx;
  color: $tech-muted;
}

.related__arrow {
  flex-shrink: 0;
  font-size: 30rpx;
  color: $tech-border-strong;
}
```

- [ ] **Step 3: 验证并提交**

```bash
npm run typecheck
npm run build:weapp
git add src/pages/detail/detail.tsx src/pages/detail/detail.scss
git commit -m "feat: 分类详情页改为科技风"
```

---

### Task 5: 测验页科技风

**Files:**
- Rewrite: `src/pages/test/test.scss`

**Interfaces:**
- Consumes: `tech.scss`；保留 `Ad` 横幅与全部测验逻辑。
- Produces: 科技风测验页。

- [ ] **Step 1: 重写 `src/pages/test/test.scss`**

```scss
@import '../../styles/tech.scss';

page {
  width: 100%;
  height: 100%;
  background: $tech-bg;
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: calc(80rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;

  & .title {
    padding: 48rpx 0 8rpx;
    font-size: 44rpx;
    font-weight: 800;
    color: $tech-text;
    text-align: center;
  }

  & .icon_Swiper {
    display: flex;
    flex: 1;
    min-height: 0;
    height: auto;
    width: calc(100vw * 11);
    overflow-x: hidden;
  }

  & .icon_list {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    width: calc(100vw);
    height: 640rpx;
    padding: 0 70rpx;
    box-sizing: border-box;

    & .number {
      position: absolute;
      top: 12rpx;
      left: 32rpx;
      padding: 6rpx 20rpx;
      font-size: 24rpx;
      font-weight: 600;
      color: $tech-muted;
      @include tech-inset(999rpx);

      text {
        color: $tech-primary-deep;
        font-variant-numeric: tabular-nums;
      }
    }

    & .inconImage {
      width: 78rpx;
      height: 78rpx;
      border-radius: 50%;
    }

    & .ico-3,
    & .ico-4,
    & .ico-2,
    & .ico-1 {
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 46rpx 46rpx;
    }

    & .ico-3 { background-color: #a8f06a; background-image: url('../../static/image/3.png'); }
    & .ico-4 { background-color: #f05a4b; background-image: url('../../static/image/4.png'); }
    & .ico-2 { background-color: #9a6136; background-image: url('../../static/image/2.png'); }
    & .ico-1 { background-color: #7fd6d2; background-image: url('../../static/image/1.png'); }
  }

  & .card_Info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 230rpx;
    height: 210rpx;
    margin: 14rpx 8rpx;
    @include tech-card(20rpx);
    transition: transform 0.15s ease;

    & .name {
      padding-top: 14rpx;
      font-size: 25rpx;
      font-weight: 600;
      color: $tech-text;
    }
  }

  & .card_Info.active {
    border-color: $tech-primary;
    background: #eff4ff;
    box-shadow: 0 10rpx 26rpx rgba(37, 99, 235, 0.18);
  }

  & .resultList {
    width: calc(100vw);
    padding: 16rpx 32rpx 32rpx;
    box-sizing: border-box;

    & .resultList-title {
      margin: 8rpx 0 22rpx;
      font-size: 38rpx;
      font-weight: 800;
      color: $tech-text;
      text-align: center;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14rpx 20rpx;
      font-size: 25rpx;
      color: $tech-text;
      border-radius: 12rpx;

      .name {
        padding-left: 8rpx;
      }

      .typeResult {
        width: 300rpx;
        display: flex;
        justify-content: space-between;

        .type,
        .result {
          width: 140rpx;
          text-align: center;
        }

        .result {
          padding-right: 6rpx;
          color: $tech-primary-deep;

          & text {
            color: $tech-danger;
          }
        }
      }
    }

    .result-item:nth-child(2n) {
      background: #f9fafb;
    }

    & .btnList {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 36rpx;
      padding: 0 48rpx;

      & .btn1,
      & .btn2 {
        width: 236rpx;
        height: 80rpx;
        line-height: 80rpx;
        padding: 0;
        margin: 0;
        font-size: 28rpx;
        text-align: center;
        border: 0;
        border-radius: 999rpx;
      }

      & .btn1 {
        color: $tech-text;
        @include tech-inset(999rpx);

        &:active {
          @include tech-pressed(999rpx);
        }
      }

      & .btn2 {
        font-weight: 600;
        color: #ffffff;
        @include tech-button();
      }
    }

    & .foot {
      margin-top: 30rpx;
      font-size: 26rpx;
      color: $tech-muted;
      text-align: center;
    }

    .grade {
      margin-top: 22rpx;
      padding-right: 32rpx;
      font-size: 32rpx;
      font-weight: 800;
      color: $tech-primary-deep;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
  }
}

.button {
  @include tech-button();
  position: fixed;
  right: 36rpx;
  bottom: calc(60rpx + env(safe-area-inset-bottom));
  width: 96rpx;
  height: 96rpx;
  line-height: 96rpx;
  padding: 0;
  font-size: 22rpx;
  color: #ffffff;
  border: 0;
  border-radius: 50%;
  z-index: 100;
}

.ad-bar {
  flex-shrink: 0;
  width: calc(100% - 48rpx);
  margin: 0 24rpx;
  border: 1rpx solid $tech-border;
  border-radius: 16rpx;
  overflow: hidden;
  background: #ffffff;
}

.wrong-entry {
  position: absolute;
  top: 20rpx;
  right: 28rpx;
  z-index: 20;
  padding: 6rpx 20rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: $tech-muted;
  @include tech-inset(999rpx);

  text {
    color: $tech-primary-deep;
    font-weight: 800;
  }

  &:active {
    @include tech-pressed(999rpx);
  }
}

.studyBar {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;

  .studyItem {
    margin: 0 10rpx;
    padding: 10rpx 24rpx;
    font-size: 23rpx;
    font-weight: 600;
    color: $tech-text;
    @include tech-inset(999rpx);

    text {
      color: $tech-primary-deep;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }

    &:active {
      @include tech-pressed(999rpx);
    }
  }
}

.wrong-back {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 24, 40, 0.45);
}

.wrong-panel {
  width: 84%;
  max-height: 76vh;
  overflow-y: auto;
  padding: 28rpx 28rpx 32rpx;
  @include tech-card(24rpx);
}

.wrong-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30rpx;
  font-weight: 800;
  color: $tech-text;
}

.wrong-clear {
  font-size: 22rpx;
  font-weight: 500;
  color: $tech-muted;
}

.wrong-sub {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: $tech-muted;
}

.wrong-empty {
  padding: 46rpx 0;
  font-size: 24rpx;
  color: $tech-muted;
  text-align: center;
}

.wrong-item {
  padding: 20rpx 8rpx;
  border-bottom: 1rpx solid $tech-border;

  .wrong-name {
    font-size: 27rpx;
    font-weight: 600;
    color: $tech-text;
  }

  .wrong-answer {
    display: flex;
    justify-content: space-between;
    margin-top: 8rpx;
    font-size: 23rpx;
  }

  .wrong-mine {
    color: $tech-danger;
  }

  .wrong-right {
    color: $tech-primary-deep;
  }
}

.wrong-close {
  margin-top: 26rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 27rpx;
  font-weight: 600;
  color: #ffffff;
  @include tech-button();
}
```

- [ ] **Step 2: 保持广告与逻辑不变**

确认 `src/pages/test/test.tsx` 中 `<View className='ad-bar'><Ad ... /></View>` 保留；不要删除导入。

- [ ] **Step 3: 验证并提交**

```bash
npm run typecheck
npm run build:weapp
git add src/pages/test/test.scss
git commit -m "feat: 测验页改为科技风"
```

---

### Task 6: 天气页科技风

**Files:**
- Modify: `src/pages/forecast/forecast.scss`

**Interfaces:**
- Consumes: `tech.scss`；保留插屏广告与全部天气逻辑。
- Produces: 科技风天气页。

- [ ] **Step 1: 按迁移规则替换全局声明**

- 导入改为 `@import '../../styles/tech.scss';`。
- `page` / `.forecast` 背景改为 `$tech-bg`。
- `.error-tip` 改为白底细线 + `$tech-danger` 文本。
- `.state-card` 改为 `@include tech-card(20rpx)`。
- `.section-title` 颜色 `$tech-text`，左侧竖线改 `$tech-primary`。
- `.hourly`、`.metrics`、`.daily`、`.overview`、`.city-panel` 中所有 `clay-surface` 改 `tech-card`，`clay-inset` 改 `tech-inset`，删除内阴影。
- `.metric-card`、`.hour-item`、`.day-row`、`.overview-item` 改为白卡/细线底（`#f9fafb` + `1rpx solid $tech-border`）。
- `.share-btn` 改为 `@include tech-button()`。
- 所有 `$clay-*` 替换为对应 `$tech-*`。

- [ ] **Step 2: Hero 改为浅色玻璃卡**

```scss
.hero {
  position: relative;
  overflow: hidden;
  padding: 28rpx;
  border: 1rpx solid $tech-border;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #eef4ff, #e6fbff);
  box-shadow: 0 8rpx 24rpx rgba(16, 24, 40, 0.06);
}

.hero::before,
.hero::after {
  display: none;
}

.hero-clear,
.hero-cloudy,
.hero-rain,
.hero-snow,
.hero-night {
  background: linear-gradient(135deg, #eef4ff, #e6fbff);
  color: $tech-text;
}

.hero-top,
.hero-foot,
.hero-date,
.hero-main,
.condition,
.feels,
.range,
.city,
.location-pin,
.location-arrow {
  color: $tech-text;
}

.hero-date,
.hero-foot,
.feels,
.range {
  color: $tech-muted;
}

.temp {
  font-size: 108rpx;
  font-weight: 800;
  color: $tech-text;
  font-variant-numeric: tabular-nums;
}

.degree {
  color: $tech-primary;
}
```

- [ ] **Step 3: 城市选择弹层**

`.city-back` 遮罩改为 `rgba(16, 24, 40, 0.45)`；`.city-panel` 用 `@include tech-card(24rpx)`；`.city-chip`、`.city-input` 用 `@include tech-inset(999rpx)`；`.city-item` 选中态用 `#eff4ff` + `$tech-primary`。

- [ ] **Step 4: 验证并提交**

```bash
npm run typecheck
npm run build:weapp
git add src/pages/forecast/forecast.scss
git commit -m "feat: 天气页改为科技风"
```

---

### Task 7: 知识列表与详情科技风

**Files:**
- Modify: `src/components/knowledge/ArticleCard.scss`
- Modify: `src/components/knowledge/BlockRenderer.scss`
- Modify: `src/pages/knowledge/index.scss`
- Modify: `src/pages/knowledge/detail.scss`

**Interfaces:**
- Consumes: `tech.scss`；保留收藏、小测、相关阅读逻辑。
- Produces: 科技风知识页。

- [ ] **Step 1: `ArticleCard.scss`**

- 导入 `tech.scss`。
- `.article-card`：`padding: 24rpx; margin-bottom: 16rpx; @include tech-card(20rpx);`，删除缩放 0.98 以外的粘土阴影。
- `.article-card__icon`：`width: 88rpx; height: 88rpx; border-radius: 18rpx; font-size: 40rpx;`，删除内阴影；背景由 `.topic-*` 提供。
- `.article-card__tag`：`padding: 3rpx 12rpx; font-size: 20rpx; border-radius: 999rpx;`，背景透明，颜色继承 `.topic-*`。
- `.article-card__bookmark.is-active` 颜色 `$tech-primary`。
- `.article-card__title` 颜色 `$tech-text`；`.article-card__summary/meta` 颜色 `$tech-muted`。
- `.article-card--featured`：`padding: 28rpx;`，图标 `112rpx`，标题 `34rpx`。
- 删除文件末尾三个 `.topic-*` 渐变定义（改为 `tech.scss` 的浅色定义）。

- [ ] **Step 2: `BlockRenderer.scss`**

- 导入 `tech.scss`。
- `.block-heading`：左侧 `6rpx solid $tech-primary`、`padding-left: 16rpx`，颜色 `$tech-text`。
- `.block-paragraph` 颜色 `$tech-muted`。
- `.block-list-items` 改 `@include tech-inset(16rpx)`。
- `.block-list-dot` 背景 `$tech-primary`。
- `.block-stat` 改 `@include tech-card(16rpx)`；`.block-stat__value` 颜色：risk `#b54708`、tech `$tech-primary-deep`、action `#067647`。
- `.block-tip`：`border-radius: 16rpx; border: 1rpx solid $tech-border;`，三主题浅底分别为 `#fff4ed` / `#eff4ff` / `#ecfdf3`，删除内阴影。
- `.block-tip__title` 颜色 `$tech-primary-deep`；`.block-tip__text` 颜色 `$tech-muted`。

- [ ] **Step 3: 知识列表页 `index.scss`**

- 导入 `tech.scss`；背景 `$tech-bg`。
- `.knowledge-title` 颜色 `$tech-text`；`.knowledge-subtitle` `$tech-muted`。
- `.knowledge-filter`：`@include tech-inset(999rpx)`，颜色 `$tech-muted`；`.is-active` 用 `$tech-primary` 背景 + 白色文字，删除内阴影。
- `.knowledge-empty` 改 `@include tech-card(20rpx)`。
- `.knowledge-note` 颜色 `$tech-muted`。

- [ ] **Step 4: 知识详情页 `detail.scss`**

- 导入 `tech.scss`；背景 `$tech-bg`。
- `.detail-topic` 使用 `tech.scss` 的 `.topic-*` 浅色背景，圆角 999rpx。
- `.detail-title` 颜色 `$tech-text`；`.detail-meta` `$tech-muted`。
- `.detail-takeaway` 改 `@include tech-card(20rpx)`；label `$tech-primary-deep`，text `$tech-text`。
- `.detail-section__title` 左侧 `6rpx solid $tech-primary` + `padding-left: 16rpx`。
- `.quiz` 改 `@include tech-card(20rpx)`；`.quiz-option` 改 `@include tech-inset(14rpx)`；正确/错误配色用 `#ecfdf3/#fef3f2`；`.quiz__explain` 背景 `#f9fafb`。
- `.quiz__next`、`.quiz-result__again`、`.detail-share`、`.detail-fav`、`.detail-back` 改 `@include tech-button()`。
- `.related-item` 改 `@include tech-card(18rpx)`；`.related-item__emoji` 背景 `linear-gradient(135deg, #eff4ff, #e6fbff)`。
- `.knowledge-detail` 底部 padding 保持 `160rpx + safe-area`；`.detail-fav` bottom `60rpx + safe-area`。

- [ ] **Step 5: 验证并提交**

```bash
npm run typecheck
npm run build:weapp
git add src/components/knowledge src/pages/knowledge
git commit -m "feat: 知识列表与详情改为科技风"
```

---

### Task 8: 删除旧样式层与整体验收

**Files:**
- Delete: `src/styles/clay.scss`
- Verify: 全仓库无 clay 引用

**Interfaces:**
- Consumes: 前 7 个任务的成果。
- Produces: 可合并的科技风版本。

- [ ] **Step 1: 确认无 clay 引用**

```bash
grep -rn "clay" src docs/superpowers/plans/2026-10-25-tech-style-redesign.md
```

预期：`src` 下无输出（docs 中的历史文档不计）。

- [ ] **Step 2: 删除 `src/styles/clay.scss`**

```bash
git rm src/styles/clay.scss
```

- [ ] **Step 3: 全局检查**

```bash
grep -rn "custom-tab-bar\|sync-tabbar" src
grep -rn "adunit-8f9c15536d079fb7\|<Ad" src/pages/index src/pages/test src/pages/forecast
```

预期：
- 无 `custom-tab-bar` / `sync-tabbar` 引用。
- 首页无 `adunit-8f9c15536d079fb7` 与 `<Ad`。
- 测验与天气仍保留各自广告。

- [ ] **Step 4: 类型检查与构建**

```bash
npm run typecheck
npm run build:weapp
```

- [ ] **Step 5: 微信开发者工具手测**

- [ ] 首页空闲态显示品牌头、搜索、四类入口、今日一题、今日贴士、数据速览、热门搜索、知识入口、工具说明。
- [ ] 搜索聚焦、有结果或分类弹窗时，新增区块全部隐藏且无布局跳动。
- [ ] 今日一题答对/答错反馈与解析正确，“再来一题”换题，“去测验”跳转正确。
- [ ] 今日贴士点击进入对应知识文章。
- [ ] 数据速览分类数据条数与题库实际数量一致。
- [ ] 热门搜索点击后直接查询。
- [ ] 首页无广告；测验横幅、天气插屏正常。
- [ ] 系统 tabBar 三项显示正常，选中蓝色，切换无底部遮挡。
- [ ] 分类详情、测验、天气、知识列表/详情均为科技风，无粘土阴影。
- [ ] `npm run typecheck`、`npm run build:weapp` 通过。

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "chore: 删除粘土样式层并完成科技风验收"
```
