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
