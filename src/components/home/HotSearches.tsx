import { View, Text } from '@tarojs/components'

import './HotSearches.scss'

interface HotSearchesProps {
  words: string[]
  onPick: (word: string) => void
}

function HotSearches({ words, onPick }: HotSearchesProps) {
  return (
    <View className='hot-searches'>
      <View className='hot-searches__head'>
        <Text className='tech-label'>TRENDING</Text>
        <Text className='hot-searches__title'>热门搜索</Text>
      </View>
      <View className='hot-searches__chips'>
        {words.map(word => (
          <View
            className='hot-searches__chip'
            key={word}
            onClick={() => onPick(word)}
          >
            {word}
          </View>
        ))}
      </View>
    </View>
  )
}

export default HotSearches
