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
            className={
              'article-card__bookmark' + (favorited ? ' is-active' : '')
            }
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
