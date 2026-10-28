import { useMemo, useState } from 'react'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import ArticleCard from '../../components/knowledge/ArticleCard'
import { articles, getArticlesByTopic } from '../../content/knowledge'
import { TOPICS, TOPIC_ORDER } from '../../content/knowledge/topics'
import type { KnowledgeTopic } from '../../content/knowledge/types'
import { readStorage, writeStorage } from '../../utils/storage'
import { KNOWLEDGE_SHARE_TITLE } from '../../utils/share'
import { plantCityNames, plantTotal } from '../../data/plants'

import './index.scss'

type Filter = 'all' | 'favorites' | KnowledgeTopic

const FAVORITES_KEY = 'knowledge_favorites'

function KnowledgeList() {
  const [filter, setFilter] = useState<Filter>('all')
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = readStorage<string[]>(FAVORITES_KEY, [])
    return Array.isArray(saved) ? saved : []
  })

  useShareAppMessage(() => ({
    title: KNOWLEDGE_SHARE_TITLE,
    path: '/pages/knowledge/index'
  }))

  useDidShow(() => {
    const saved = readStorage<string[]>(FAVORITES_KEY, [])
    setFavorites(Array.isArray(saved) ? saved : [])
  })

  const list = useMemo(() => {
    if (filter === 'all') {
      return articles
    }
    if (filter === 'favorites') {
      return articles.filter(item => favorites.indexOf(item.id) !== -1)
    }
    return getArticlesByTopic(filter)
  }, [filter, favorites])

  const featured =
    filter === 'all' ? list.find(item => item.featured) : undefined
  const rest = featured ? list.filter(item => item.id !== featured.id) : list

  const filters: Array<{ key: Filter; label: string; count?: number }> = [
    { key: 'all', label: '全部' },
    ...TOPIC_ORDER.map<{ key: Filter; label: string }>(topic => ({
      key: topic,
      label: TOPICS[topic].label
    })),
    { key: 'favorites', label: '收藏', count: favorites.length }
  ]

  const toggleFavorite = (id: string) => {
    const exists = favorites.indexOf(id) !== -1
    const next = exists
      ? favorites.filter(item => item !== id)
      : favorites.concat(id)
    setFavorites(next)
    writeStorage(FAVORITES_KEY, next)
    Taro.showToast({
      title: exists ? '已取消收藏' : '已收藏',
      icon: 'none'
    })
  }

  const openArticle = (id: string) => {
    Taro.navigateTo({ url: `/pages/knowledge/detail?id=${id}` })
  }

  const openPlantMap = () => {
    Taro.navigateTo({ url: '/pages/map/index' })
  }

  return (
    <View className='knowledge-page'>
      <View className='knowledge-head'>
        <View className='knowledge-title'>垃圾分类知识</View>
        <View className='knowledge-subtitle'>分完之后，垃圾去了哪里</View>
      </View>

      <View className='knowledge-map' onClick={openPlantMap}>
        <View className='knowledge-map__icon'>🗺️</View>
        <View className='knowledge-map__body'>
          <Text className='knowledge-map__label'>FACILITY MAP</Text>
          <View className='knowledge-map__title'>垃圾焚烧厂分布</View>
          <View className='knowledge-map__desc'>
            {plantCityNames} {plantTotal} 座设施 · 查看位置与导航
          </View>
        </View>
        <View className='knowledge-map__arrow'>›</View>
      </View>

      <ScrollView className='knowledge-filters' scrollX>
        {filters.map(item => (
          <View
            key={item.key}
            className={
              'knowledge-filter' + (filter === item.key ? ' is-active' : '')
            }
            onClick={() => setFilter(item.key)}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <Text className='knowledge-filter__count'>{item.count}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View className='knowledge-list'>
        {featured && (
          <ArticleCard
            article={featured}
            featured
            favorited={favorites.indexOf(featured.id) !== -1}
            onToggleFavorite={toggleFavorite}
            onOpen={openArticle}
          />
        )}
        {rest.map(item => (
          <ArticleCard
            key={item.id}
            article={item}
            favorited={favorites.indexOf(item.id) !== -1}
            onToggleFavorite={toggleFavorite}
            onOpen={openArticle}
          />
        ))}
      </View>

      {list.length === 0 && (
        <View className='knowledge-empty'>
          {filter === 'favorites'
            ? '还没有收藏，读一篇试试'
            : '这个主题还没有文章'}
        </View>
      )}

      <View className='knowledge-note'>
        各地分类标准略有差异，具体以当地规定为准。
      </View>
    </View>
  )
}

export default KnowledgeList
