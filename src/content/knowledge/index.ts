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
