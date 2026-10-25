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
