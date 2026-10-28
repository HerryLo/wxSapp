import { SHARE_TITLE } from './util'

export const HOME_SHARE_TITLE = '垃圾分类查询助手：这是什么垃圾？'
export const KNOWLEDGE_SHARE_TITLE = '垃圾分类科普：垃圾去哪了？'
export const QUICKREF_SHARE_TITLE = '常见物品垃圾分类速查表：奶茶杯、口罩、电池怎么分？'

/**
 * 查询结果分享标题：带上物品名和分类，让分享卡片自带答案
 */
export function garbageShareTitle(name: string, category: string): string {
  const item = (name || '').trim()
  const cat = (category || '').trim()
  return item && cat ? `${item}属于${cat}｜垃圾分类助手` : SHARE_TITLE
}

/**
 * 测验分享标题：交卷后带上成绩
 */
export function quizShareTitle(
  submitted: boolean,
  grade: number,
  total: number
): string {
  if (!submitted || total <= 0) {
    return `垃圾分类测验：${total || 10} 题测测你的分类水平`
  }
  const correct = Math.round(grade / 10)
  return `我 ${total} 题答对 ${correct} 题，你敢来挑战吗？`
}

/**
 * 科普文章分享标题：用文章标题代替统一文案
 */
export function articleShareTitle(title?: string): string {
  const text = (title || '').trim()
  return text ? `${text}｜垃圾分类科普` : SHARE_TITLE
}
