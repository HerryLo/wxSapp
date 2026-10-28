import { useEffect, useState } from 'react'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import BlockRenderer from '../../components/knowledge/BlockRenderer'
import { getArticle, getRelatedArticles } from '../../content/knowledge'
import { TOPICS } from '../../content/knowledge/topics'
import { readStorage, writeStorage } from '../../utils/storage'
import { articleShareTitle } from '../../utils/share'
import { plantCityNames, plantTotal } from '../../data/plants'

import './detail.scss'

const FAVORITES_KEY = 'knowledge_favorites'
const QUIZ_KEY = 'knowledge_quiz_best'

function KnowledgeDetail() {
  const router = useRouter()
  const id = router.params.id || ''
  const article = getArticle(id)

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = readStorage<string[]>(FAVORITES_KEY, [])
    return Array.isArray(saved) ? saved : []
  })
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [best, setBest] = useState(() => {
    const saved = readStorage<Record<string, number>>(QUIZ_KEY, {})
    const value = saved && typeof saved === 'object' ? saved[id] : 0
    return typeof value === 'number' ? value : 0
  })

  useEffect(() => {
    if (article) {
      Taro.setNavigationBarTitle({ title: article.title })
    }
  }, [article])

  useShareAppMessage(() => ({
    title: articleShareTitle(article?.title),
    path: `/pages/knowledge/detail?id=${id}`
  }))

  if (!article) {
    return (
      <View className='knowledge-detail knowledge-detail--missing'>
        <View className='detail-missing'>文章不存在</View>
        <View className='detail-back' onClick={() => Taro.navigateBack()}>
          返回
        </View>
      </View>
    )
  }

  const favorited = favorites.indexOf(id) !== -1
  const related = getRelatedArticles(article)
  const currentQuestion = article.quiz[questionIndex]
  const isLast = questionIndex === article.quiz.length - 1

  const toggleFavorite = () => {
    const next = favorited
      ? favorites.filter(item => item !== id)
      : favorites.concat(id)
    setFavorites(next)
    writeStorage(FAVORITES_KEY, next)
    Taro.showToast({
      title: favorited ? '已取消收藏' : '已收藏',
      icon: 'none'
    })
  }

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) {
      return
    }
    setSelected(optionIndex)
  }

  const handleNext = () => {
    if (selected === null) {
      return
    }
    const nextScore = score + (selected === currentQuestion.answer ? 1 : 0)
    setScore(nextScore)

    if (isLast) {
      setFinished(true)
      if (nextScore > best) {
        setBest(nextScore)
        const saved = readStorage<Record<string, number>>(QUIZ_KEY, {})
        const base =
          saved && typeof saved === 'object' && !Array.isArray(saved)
            ? saved
            : {}
        writeStorage(QUIZ_KEY, { ...base, [id]: nextScore })
      }
      return
    }

    setQuestionIndex(questionIndex + 1)
    setSelected(null)
  }

  const resetQuiz = () => {
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  const optionClass = (optionIndex: number) => {
    if (selected === null) {
      return 'quiz-option'
    }
    if (optionIndex === currentQuestion.answer) {
      return 'quiz-option is-correct'
    }
    if (optionIndex === selected) {
      return 'quiz-option is-wrong'
    }
    return 'quiz-option is-muted'
  }

  const openRelated = (relatedId: string) => {
    Taro.redirectTo({ url: `/pages/knowledge/detail?id=${relatedId}` })
  }

  const openPlantMap = () => {
    Taro.navigateTo({ url: '/pages/map/index' })
  }

  return (
    <View className='knowledge-detail'>
      <View className='detail-head'>
        <View className={'detail-topic ' + TOPICS[article.topic].className}>
          {TOPICS[article.topic].label}
        </View>
        <View className='detail-title'>{article.title}</View>
        <View className='detail-meta'>
          {article.readMinutes} 分钟阅读 · {article.quiz.length} 题小测
        </View>
      </View>

      <BlockRenderer blocks={article.blocks} topic={article.topic} />

      <View className='detail-takeaway'>
        <View className='detail-takeaway__label'>一句话总结</View>
        <View className='detail-takeaway__text'>{article.takeaway}</View>
      </View>

      {article.id === 'waste-to-energy' && (
        <View className='detail-map' onClick={openPlantMap}>
          <View className='detail-map__icon'>🗺️</View>
          <View className='detail-map__body'>
            <View className='detail-map__title'>看看上海的焚烧厂都在哪</View>
            <View className='detail-map__desc'>
              {plantCityNames} {plantTotal} 座设施 · 查看位置与导航
            </View>
          </View>
          <View className='detail-map__arrow'>›</View>
        </View>
      )}

      {article.quiz.length > 0 && (
        <View className='detail-section'>
          <View className='detail-section__title'>文末小测</View>
          {!finished ? (
            <View className='quiz'>
              <View className='quiz__progress'>
                第 {questionIndex + 1} / {article.quiz.length} 题
              </View>
              <View className='quiz__question'>{currentQuestion.question}</View>
              {currentQuestion.options.map((option, optionIndex) => (
                <View
                  key={option}
                  className={optionClass(optionIndex)}
                  onClick={() => handleSelect(optionIndex)}
                >
                  {option}
                </View>
              ))}
              {selected !== null && (
                <View className='quiz__explain'>
                  {currentQuestion.explanation}
                </View>
              )}
              <View
                className={
                  'quiz__next' + (selected === null ? ' is-disabled' : '')
                }
                onClick={handleNext}
              >
                {isLast ? '查看结果' : '下一题'}
              </View>
            </View>
          ) : (
            <View className='quiz-result'>
              <View className='quiz-result__score'>
                {score}/{article.quiz.length}
              </View>
              <View className='quiz-result__text'>
                {score === article.quiz.length
                  ? '全部答对，厉害！'
                  : '看看解析，下次会更好'}
              </View>
              <View className='quiz-result__best'>
                最高分 {best}/{article.quiz.length}
              </View>
              <View className='quiz-result__again' onClick={resetQuiz}>
                再测一次
              </View>
            </View>
          )}
        </View>
      )}

      <View className='detail-section'>
        <View className='detail-section__title'>相关阅读</View>
        {related.map(item => (
          <View
            className='related-item'
            key={item.id}
            onClick={() => openRelated(item.id)}
          >
            <View className='related-item__emoji'>{item.emoji}</View>
            <View className='related-item__body'>
              <View className='related-item__title'>{item.title}</View>
              <View className='related-item__meta'>
                {TOPICS[item.topic].label} · {item.readMinutes} 分钟
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className='detail-section'>
        <View className='detail-section__title'>资料来源</View>
        {article.sources.map(source => (
          <View className='detail-source' key={source}>
            {source}
          </View>
        ))}
      </View>

      <View className='detail-note'>
        各地分类标准略有差异，具体以当地规定为准。
      </View>

      <Button className='detail-share' openType='share'>
        分享这篇文章
      </Button>

      <View className='detail-fav' onClick={toggleFavorite}>
        {favorited ? '★ 已收藏' : '☆ 收藏'}
      </View>
    </View>
  )
}

export default KnowledgeDetail
