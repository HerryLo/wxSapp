import type { KnowledgeArticle, KnowledgeTopic } from './types'
import { plasticBottle } from './articles/plastic-bottle'
import { landfill } from './articles/landfill'
import { microplastics } from './articles/microplastics'
import { eWaste } from './articles/e-waste'
import { wasteToEnergy } from './articles/waste-to-energy'
import { kitchenWaste } from './articles/kitchen-waste'
import { chemicalRecycling } from './articles/chemical-recycling'
import { aiSorting } from './articles/ai-sorting'
import { biodegradable } from './articles/biodegradable'
import { threeR } from './articles/three-r'
import { packaging } from './articles/packaging'
import { oldClothes } from './articles/old-clothes'

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
