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
