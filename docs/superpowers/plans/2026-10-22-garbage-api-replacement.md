# 垃圾分类接口替换实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页垃圾分类查询从失效的 `trash.lhsr.cn` 接口替换为 `https://api.nxvav.cn/api/garbages/`。

**Architecture:** 新接口一次请求直接返回 `{ name, category, content }[]`，不再有旧的「关键词列表 + 关键词详情数组」两步结构。搜索列表直接渲染接口返回的物品名，点击后用 `category`（中文分类名）映射到现有 `IndexModel.getSort()` 的本地分类详情。

**Tech Stack:** Taro 4.3、React 18、TypeScript、`Taro.request`

---

## 接口结论

- 地址：`GET https://api.nxvav.cn/api/garbages/?name=<物品名>`
- 参数：`name`，必填，未传返回 `{"code":400,"msg":"请提供要查询的物品名称"}`
- 成功：`{"code":200,"data":[{"name":"玻璃瓶","category":"可回收物","content":"适宜回收利用和资源化利用的，如：玻、金、塑、纸、衣"}]}`
- 无结果：`{"code":200,"data":[],"msg":"未找到相关垃圾分类信息"}`
- 无分页、无鉴权；`category` 取值：可回收物 / 有害垃圾 / 湿垃圾 / 干垃圾

## 改动点评估

| 文件 | 改动 |
| --- | --- |
| `src/constants/config.ts` | 删除失效的 `RequestUrl`，新增 `GarbageUrl` |
| `src/api/garbage.api.ts` | 新增：带类型的 `SearchGarbage(name)` |
| `src/api/seach.api.ts` | 删除（唯一调用方在首页） |
| `src/api/index.ts` | 导出改为 `SearchGarbage` |
| `src/type/index.d.ts` | 新增 `GarbageItem`、`GarbageResponse` |
| `src/model/index/index.ts` | `handleCssName`（旧 CssName 映射）改为 `handleCategory`（中文分类映射） |
| `src/pages/index/index.tsx` | 去掉 `KwArrData`/`keywords`/`kwArr`，改为 `GarbageItem[]`；增加请求竞态保护与失败提示 |

**非代码事项：** 小程序后台需将 `https://api.nxvav.cn` 加入 request 合法域名。

---

### Task 1: 接口层

**Files:**
- Modify: `src/constants/config.ts`
- Create: `src/api/garbage.api.ts`
- Delete: `src/api/seach.api.ts`
- Modify: `src/api/index.ts`
- Modify: `src/type/index.d.ts`

- [ ] **Step 1: 替换常量**

`src/constants/config.ts` 中删除 `RequestUrl` 及其注释，新增：

```ts
// 垃圾分类查询
export const GarbageUrl = 'https://api.nxvav.cn/api/garbages'
```

- [ ] **Step 2: 新增类型**

`src/type/index.d.ts` 新增：

```ts
export interface GarbageItem {
    name: string;
    category: string;
    content: string;
}

export interface GarbageResponse {
    code: number;
    data?: Array<GarbageItem>;
    msg?: string;
}
```

- [ ] **Step 3: 新增 API 并删除旧 API**

新增 `src/api/garbage.api.ts`：

```ts
import Taro from '@tarojs/taro'
import { GarbageUrl } from '../constants/config'
import { GarbageItem, GarbageResponse } from '../type/index'

export const SearchGarbage = async (name: string): Promise<Array<GarbageItem>> => {
  const res = await Taro.request<GarbageResponse>({
    url: GarbageUrl,
    data: { name }
  })
  if (res.data.code !== 200) {
    throw new Error(res.data.msg || '查询失败')
  }
  return res.data.data || []
}
```

删除 `src/api/seach.api.ts`，`src/api/index.ts` 首行改为：

```ts
export { SearchGarbage } from './garbage.api'
```

- [ ] **Step 4: 类型检查**

Run: `npm run typecheck`
Expected: 报错仅出现在尚未修改的 `src/pages/index/index.tsx`（`SeachKey` 不存在、`res.data.kw_list` 等），下一步修复。

### Task 2: 分类映射与首页

**Files:**
- Modify: `src/model/index/index.ts`
- Modify: `src/pages/index/index.tsx`

- [ ] **Step 1: 中文分类映射**

`src/model/index/index.ts` 中删除 `handleCssName`，改为：

```ts
  handleCategory(category: string): number | undefined {
    const categoryIndex: Record<string, number> = {
      '湿垃圾': 0,
      '干垃圾': 1,
      '可回收物': 2,
      '有害垃圾': 3,
      '建筑垃圾': 4,
      '大件垃圾': 5,
      '不属于生活垃圾': 6
    }
    return categoryIndex[category]
  }
```

- [ ] **Step 2: 首页改为直接消费新接口**

`src/pages/index/index.tsx`：
- import 改为 `import { useRef, useState } from 'react'`、`import { SearchGarbage } from '../../api/index'`、`import { GarbageItem, SelectedSort } from '../../type/index'`
- 删除 `KwArrData` 接口
- 状态改为：

```ts
  const [search, setSearch] = useState('')
  const [garbageList, setGarbageList] = useState<GarbageItem[]>([])
  const [selectedSort, setSelectedSort] = useState<SelectedSort | null>(null)
  const requestId = useRef(0)
```

- `clear` / `seach` / `searchSort` 改为：

```ts
  const clear = () => {
    requestId.current += 1
    setGarbageList([])
    setSearch('')
  }

  const seach = async (e: any) => {
    const str: string = e.detail.value
    setSearch(str)
    if (!str.trim()) {
      clear()
      return
    }
    const currentId = ++requestId.current
    try {
      const list = await SearchGarbage(str.trim())
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

  const searchSort = (e: ITouchEvent) => {
    const name = e.currentTarget.dataset.name as string
    const data = garbageList.find(item => item.name === name)
    if (!data) {
      return
    }
    const index = IndexModel.handleCategory(data.category)
    if (index === undefined) {
      Taro.showToast({ title: '暂不支持该垃圾类型', icon: 'none' })
      return
    }
    setSelectedSort(IndexModel.getSort(index))
  }
```

- 列表渲染改为：

```tsx
      {
        garbageList.map((item, index) => {
          return (
            <View className='searchList' key={`${item.name}-${index}`}>
              <View
                className='searchCell'
                onClick={searchSort}
                data-name={item.name}
              >
                {item.name}
              </View>
              <View className='line'></View>
            </View>
          )
        })
      }
```

- 图片入口与底部说明的空状态条件改为 `garbageList.length === 0 && !search`
- 搜索中无结果时显示：

```tsx
      {
        search && garbageList.length === 0 &&
          <View className='desc'>未找到相关垃圾分类信息</View>
      }
```

- [ ] **Step 3: 类型检查**

Run: `npm run typecheck`
Expected: 通过

### Task 3: 构建验证

- [ ] **Step 1: 构建**

Run: `npm run build:weapp`
Expected: 构建成功

- [ ] **Step 2: 确认产物使用新域名**

Run: `grep -r "api.nxvav.cn" dist | head`
Expected: 有匹配

Run: `grep -r "trash.lhsr.cn" dist | head`
Expected: 无匹配
