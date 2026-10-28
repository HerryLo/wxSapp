import { useEffect, useRef, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Text, Button, Ad } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'
import { randomArray } from '../../utils/util'
import { quizShareTitle } from '../../utils/share'
import { readStorage, writeStorage } from '../../utils/storage'
import { DailyStats, WrongItem } from '../../type/index'
import { result } from '../../static/result'

import './test.scss'

interface ResultProp {
  a: string
  c: string
  i: string
  n: string
}

type Answer = number | null

const RANDOM_NUMBER = 10
const NAMES = ['湿垃圾', '干垃圾', '可回收物', '有害垃圾']
const ICON_CLASS = ['ico-3', 'ico-4', 'ico-2', 'ico-1']
const WRONG_KEY = 'quiz_wrong_book'
const DAILY_KEY = 'quiz_daily'

const pad = (v: number) => (v < 10 ? '0' + v : String(v))
const dateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const buildQuiz = (): ResultProp[] => {
  const { data } = result
  const list = [1, 2, 3, 4]
  const arr = randomArray<number>(list, RANDOM_NUMBER)
  return arr.reduce<ResultProp[]>((acc, i) => {
    return acc.concat(randomArray<ResultProp>(data[i], 1))
  }, [])
}

const loadLastWrongs = () => {
  const list = readStorage<WrongItem[]>(WRONG_KEY, [])
  if (!Array.isArray(list)) {
    return []
  }
  return list
    .filter((item, i) => list.findIndex(w => w.n === item.n) === i)
    .slice(0, RANDOM_NUMBER)
}

function Test() {
  const [arrResult, setArrResult] = useState<ResultProp[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [grade, setGrade] = useState(0)
  const [wrongBook, setWrongBook] = useState<WrongItem[]>(loadLastWrongs)
  const [daily, setDaily] = useState<DailyStats>(() =>
    readStorage<DailyStats>(DAILY_KEY, { lastDate: '', streak: 0, total: 0 })
  )
  const [showWrong, setShowWrong] = useState(false)

  // 用 ref 保存最新成绩，保证分享时拿到的是交卷后的分数
  const shareStateRef = useRef({ submitted, grade })
  shareStateRef.current = { submitted, grade }

  useShareAppMessage(() => {
    const state = shareStateRef.current
    return {
      title: quizShareTitle(state.submitted, state.grade, RANDOM_NUMBER),
      path: '/pages/test/test'
    }
  })

  const dataInit = () => {
    setArrResult(buildQuiz())
    setAnswers(Array<Answer>(RANDOM_NUMBER).fill(null))
    setCurrentIndex(0)
    setSubmitted(false)
    setGrade(0)
  }

  useEffect(() => {
    dataInit()
  }, [])

  const current = arrResult[currentIndex]
  const selected = answers[currentIndex]
  const answeredCount = answers.filter(answer => answer !== null).length

  const chooseAnswer = (value: number) => {
    if (submitted) return
    setAnswers(prev => {
      const next = [...prev]
      next[currentIndex] = value
      return next
    })
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goNext = () => {
    if (answers[currentIndex] === null) {
      Taro.showToast({ title: '请先选择答案', icon: 'none' })
      return
    }
    if (currentIndex < RANDOM_NUMBER - 1) {
      setCurrentIndex(currentIndex + 1)
      return
    }
    submit()
  }

  const submit = () => {
    const firstUnanswered = answers.findIndex(answer => answer === null)
    if (firstUnanswered !== -1) {
      setCurrentIndex(firstUnanswered)
      Taro.showToast({ title: '还有题目未作答', icon: 'none' })
      return
    }

    let nextGrade = 0
    const wrongs: WrongItem[] = []
    answers.forEach((answer, i) => {
      const item = arrResult[i]
      if (answer !== null && answer + 1 === Number(item.c)) {
        nextGrade += 10
      } else {
        wrongs.push({
          n: item.n,
          c: item.c,
          chosen: answer === null ? 0 : answer + 1,
          ts: Date.now()
        })
      }
    })
    setGrade(nextGrade)

    const lastWrongs = wrongs.filter(
      (item, i) => wrongs.findIndex(w => w.n === item.n) === i
    )
    setWrongBook(lastWrongs)
    writeStorage(WRONG_KEY, lastWrongs)

    const now = new Date()
    const today = dateStr(now)
    const yesterday = dateStr(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
    )
    const nextDaily: DailyStats =
      daily.lastDate === today
        ? { ...daily, total: daily.total + 1 }
        : {
            lastDate: today,
            streak: daily.lastDate === yesterday ? daily.streak + 1 : 1,
            total: daily.total + 1
          }
    setDaily(nextDaily)
    writeStorage(DAILY_KEY, nextDaily)

    setSubmitted(true)
    Taro.pageScrollTo({ scrollTop: 0, duration: 200 })
  }

  const review = () => {
    setSubmitted(false)
    setCurrentIndex(0)
    Taro.pageScrollTo({ scrollTop: 0, duration: 200 })
  }

  const clearWrong = () => {
    setWrongBook([])
    writeStorage(WRONG_KEY, [])
  }

  const routerGo = (e: ITouchEvent) => {
    Taro.reLaunch({
      url: e.currentTarget.dataset.link
    })
  }

  if (!submitted && !current) {
    return (
      <View className='test-page'>
        <View className='quiz-loading'>正在出题…</View>
      </View>
    )
  }

  return (
    <View className='test-page'>
      {!submitted && current ? (
        <>
          <View className='test-head'>
            <View>
              <View className='test-brand'>垃圾分类测验</View>
              <View className='test-sub'>10 道题，选完可返回检查</View>
            </View>
            <View className='test-meta'>
              <Button className='test-share' openType='share'>
                分享
              </Button>
              <View className='test-date'>连续 {daily.streak} 天</View>
            </View>
          </View>

          <View className='quiz-progress-card'>
            <View className='quiz-progress-head'>
              <Text className='quiz-progress-current'>
                第 {currentIndex + 1} / {RANDOM_NUMBER} 题
              </Text>
              <Text className='quiz-progress-count'>已答 {answeredCount} 题</Text>
            </View>
            <View className='quiz-progress-track'>
              <View
                className='quiz-progress-fill'
                style={{ width: `${(answeredCount / RANDOM_NUMBER) * 100}%` }}
              />
            </View>
            <View className='quiz-dots'>
              {arrResult.map((item, i) => (
                <View
                  key={`${item.n}-${i}`}
                  className={
                    'quiz-dot' +
                    (i === currentIndex ? ' is-current' : '') +
                    (answers[i] !== null ? ' is-done' : '')
                  }
                  onClick={() => setCurrentIndex(i)}
                >
                  {i + 1}
                </View>
              ))}
            </View>
          </View>

          <View className='quiz-card'>
            <View className='quiz-card__head'>
              <Text className='tech-label'>QUESTION {pad(currentIndex + 1)}</Text>
              <Text className='quiz-card__hint'>这道垃圾属于哪类？</Text>
            </View>
            <View className='quiz-card__name'>{current.n}</View>
            <View className='quiz-options'>
              {NAMES.map((name, i) => (
                <View
                  key={name}
                  className={'quiz-option' + (selected === i ? ' is-selected' : '')}
                  onClick={() => chooseAnswer(i)}
                >
                  <View className={'quiz-option__icon ' + ICON_CLASS[i]} />
                  <View className='quiz-option__name'>{name}</View>
                </View>
              ))}
            </View>
          </View>

          <View className='quiz-nav'>
            <View
              className={'quiz-nav__btn' + (currentIndex === 0 ? ' is-disabled' : '')}
              onClick={goPrev}
            >
              上一题
            </View>
            <View className='quiz-nav__btn quiz-nav__btn--primary' onClick={goNext}>
              {currentIndex === RANDOM_NUMBER - 1 ? '交卷' : '下一题'}
            </View>
          </View>

          <View className='quiz-tools'>
            <View className='quiz-tool' onClick={() => setShowWrong(true)}>
              上次错题 <Text>{wrongBook.length}</Text>
            </View>
            <View className='quiz-tool'>
              连续 <Text>{daily.streak}</Text> 天
            </View>
          </View>
          <View className='quiz-tip'>选好后点「下一题」，也可以点题号返回检查。</View>
        </>
      ) : (
        <View className='result-card'>
          <View className='result-head'>
            <Text className='tech-label'>RESULT</Text>
            <View className='result-score'>
              {grade}
              <Text>分</Text>
            </View>
            <View className='result-desc'>
              答对 {grade / 10} / {RANDOM_NUMBER} 题
            </View>
          </View>

          <View className='result-list'>
            {arrResult.map((item, i) => {
              const chosen = answers[i]
              const isCorrect = chosen !== null && chosen + 1 === Number(item.c)
              return (
                <View
                  className={'result-row' + (isCorrect ? ' is-correct' : ' is-wrong')}
                  key={`${item.n}-${i}`}
                >
                  <View className='result-row__name'>{item.n}</View>
                  <View className='result-row__meta'>
                    <Text className='result-row__right'>
                      正确 {NAMES[Number(item.c) - 1]}
                    </Text>
                    <Text className='result-row__mine'>
                      你选 {chosen === null ? '未作答' : NAMES[chosen]}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>

          <View className='result-actions'>
            <View className='result-btn result-btn--ghost' onClick={review}>
              返回检查
            </View>
            <View className='result-btn result-btn--primary' onClick={dataInit}>
              再试一次
            </View>
          </View>

          <Button className='result-share' openType='share'>
            分享成绩
          </Button>

          <View className='studyBar'>
            <View className='studyItem' onClick={() => setShowWrong(true)}>
              上次错题 <Text>{wrongBook.length}</Text> 题
            </View>
            <View className='studyItem'>
              连续 <Text>{daily.streak}</Text> 天
            </View>
          </View>

          <View
            className='result-foot'
            onClick={routerGo}
            data-link='/pages/index/index'
          >
            更多垃圾分类 ›
          </View>
        </View>
      )}

      <View className='ad-bar'>
        <Ad
          unitId='adunit-1a4ad7108719235b'
          onLoad={() => console.log('ad onLoad')}
          onError={() => console.log('ad onError')}
          onClose={() => console.log('ad onClose')}
        />
      </View>

      {showWrong && (
        <View className='wrong-back' onClick={() => setShowWrong(false)}>
          <View className='wrong-panel' onClick={e => e.stopPropagation()}>
            <View className='wrong-head'>
              <Text>上次错题</Text>
              <Text className='wrong-clear' onClick={clearWrong}>清空</Text>
            </View>
            <View className='wrong-sub'>仅保留最近一次测验的错题</View>
            {wrongBook.length === 0 && (
              <View className='wrong-empty'>还没有错题，继续加油！</View>
            )}
            {wrongBook.map(item => (
              <View className='wrong-item' key={item.n}>
                <View className='wrong-name'>{item.n}</View>
                <View className='wrong-answer'>
                  <Text className='wrong-mine'>你选 {NAMES[item.chosen - 1]}</Text>
                  <Text className='wrong-right'>正确 {NAMES[Number(item.c) - 1]}</Text>
                </View>
              </View>
            ))}
            <View className='wrong-close' onClick={() => setShowWrong(false)}>
              知道了
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default Test
