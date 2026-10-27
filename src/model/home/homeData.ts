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

// 只取四分类数据；装修垃圾、大件垃圾等专门渠道不进入四选一测验
const getQuizItems = (): RawQuizItem[] =>
  Object.entries(result.data)
    .filter(([key]) => {
      const code = Number(key)
      return code >= 1 && code <= CATEGORY_NAMES.length
    })
    .reduce<RawQuizItem[]>((list, [, group]) => list.concat(group), [])

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
