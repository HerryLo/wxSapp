import { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { getDailyQuiz } from '../../model/home/homeData'

import './DailyQuiz.scss'

function DailyQuiz() {
  const [offset, setOffset] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const item = useMemo(() => getDailyQuiz(new Date(), offset), [offset])

  if (!item) {
    return null
  }

  const next = () => {
    setOffset(value => value + 1)
    setSelected(null)
  }

  const goTest = () => {
    Taro.switchTab({ url: '/pages/test/test' })
  }

  const optionClass = (index: number) => {
    if (selected === null) {
      return 'daily-quiz__option'
    }
    if (index === item.answer) {
      return 'daily-quiz__option is-correct'
    }
    if (index === selected) {
      return 'daily-quiz__option is-wrong'
    }
    return 'daily-quiz__option is-muted'
  }

  return (
    <View className='daily-quiz'>
      <View className='daily-quiz__head'>
        <Text className='tech-label'>TODAY</Text>
        <Text className='daily-quiz__hint'>这道垃圾属于哪类？</Text>
      </View>
      <View className='daily-quiz__name'>{item.name}</View>
      <View className='daily-quiz__options'>
        {item.options.map((option, index) => (
          <View
            key={option}
            className={optionClass(index)}
            onClick={() => {
              if (selected === null) {
                setSelected(index)
              }
            }}
          >
            {option}
          </View>
        ))}
      </View>
      {selected !== null && (
        <View className='daily-quiz__explain'>{item.explanation}</View>
      )}
      <View className='daily-quiz__foot'>
        <Text className='daily-quiz__again' onClick={next}>
          再来一题
        </Text>
        <Text className='daily-quiz__link' onClick={goTest}>
          去测验 ›
        </Text>
      </View>
    </View>
  )
}

export default DailyQuiz
