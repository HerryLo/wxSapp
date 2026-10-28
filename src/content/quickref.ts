import { result } from '../static/result'

interface RawItem {
  n: string
  c: string
  a?: string
}

export interface QuickRefItem {
  name: string
  code: number
  /** 搜索用文本：名称 + 别名 */
  haystack: string
}

export interface QuickRefGroup {
  code: number
  name: string
  tone: string
  total: number
  items: QuickRefItem[]
}

const CATEGORY_META: Array<{ code: number; name: string; tone: string }> = [
  { code: 1, name: '湿垃圾', tone: 'wet' },
  { code: 2, name: '干垃圾', tone: 'dry' },
  { code: 3, name: '可回收物', tone: 'recycle' },
  { code: 4, name: '有害垃圾', tone: 'harmful' },
  { code: 5, name: '装修垃圾', tone: 'other' },
  { code: 6, name: '大件垃圾', tone: 'other' },
  { code: 7, name: '不属于生活垃圾', tone: 'other' }
]

/** 每个分类在速查页首屏展示的常用物品数量 */
export const QUICKREF_LIMIT = 40

const data = result.data as Record<string, RawItem[]>

export const QUICKREF_GROUPS: QuickRefGroup[] = CATEGORY_META.map(meta => {
  const list = (data[String(meta.code)] || []).map(item => ({
    name: item.n,
    code: meta.code,
    haystack: `${item.n} ${item.a || ''}`
  }))
  return {
    code: meta.code,
    name: meta.name,
    tone: meta.tone,
    total: list.length,
    items: list.slice(0, QUICKREF_LIMIT)
  }
}).filter(group => group.total > 0)

export const QUICKREF_TOTAL = Object.keys(data).reduce((sum, key) => {
  const code = Number(key)
  return categoryName(code) ? sum + (data[key] || []).length : sum
}, 0)

export function categoryName(code: number): string {
  const meta = CATEGORY_META.find(item => item.code === code)
  return meta ? meta.name : ''
}

/**
 * 在全部物品里按名称或别名搜索
 */
export function searchQuickRef(keyword: string, limit = 60): QuickRefItem[] {
  const query = keyword.trim()
  if (!query) {
    return []
  }
  const matches: QuickRefItem[] = []
  const keys = Object.keys(data)
  for (let k = 0; k < keys.length; k += 1) {
    const code = Number(keys[k])
    if (!categoryName(code)) {
      continue
    }
    const list = data[keys[k]] || []
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i]
      if (`${item.n} ${item.a || ''}`.indexOf(query) !== -1) {
        matches.push({
          name: item.n,
          code,
          haystack: `${item.n} ${item.a || ''}`
        })
        if (matches.length >= limit) {
          return matches
        }
      }
    }
  }
  return matches
}

/**
 * 按名称精确查找，找不到再退化为包含匹配
 */
export function findQuickRefItem(name: string): QuickRefItem | undefined {
  const query = name.trim()
  if (!query) {
    return undefined
  }
  let fuzzy: QuickRefItem | undefined
  const keys = Object.keys(data)
  for (let k = 0; k < keys.length; k += 1) {
    const code = Number(keys[k])
    if (!categoryName(code)) {
      continue
    }
    const list = data[keys[k]] || []
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i]
      if (item.n === query) {
        return { name: item.n, code, haystack: `${item.n} ${item.a || ''}` }
      }
      if (!fuzzy && item.n.indexOf(query) !== -1) {
        fuzzy = { name: item.n, code, haystack: `${item.n} ${item.a || ''}` }
      }
    }
  }
  return fuzzy
}
