import { useMemo, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import {
  QUICKREF_GROUPS,
  QUICKREF_TOTAL,
  categoryName,
  searchQuickRef
} from '../../content/quickref'
import { QUICKREF_SHARE_TITLE } from '../../utils/share'

import './index.scss'

const TONE_OF_CODE: Record<number, string> = {
  1: 'wet',
  2: 'dry',
  3: 'recycle',
  4: 'harmful',
  5: 'other',
  6: 'other',
  7: 'other'
}

function QuickRef() {
  const [keyword, setKeyword] = useState('')
  const results = useMemo(() => searchQuickRef(keyword), [keyword])
  const searching = keyword.trim().length > 0

  useShareAppMessage(() => ({
    title: QUICKREF_SHARE_TITLE,
    path: '/pages/quickref/index'
  }))

  const openItem = (name: string, code: number) => {
    Taro.navigateTo({
      url: `/pages/result/result?name=${encodeURIComponent(name)}&code=${code}`
    })
  }

  return (
    <View className='quickref-page'>
      <View className='quickref-head'>
        <View className='quickref-title'>常见物品垃圾分类速查</View>
        <View className='quickref-sub'>
          共收录 {QUICKREF_TOTAL} 种物品，输入名称可查全部；分类依据上海标准
        </View>
      </View>

      <View className='quickref-search'>
        <Input
          className='quickref-input'
          placeholder='输入物品名称，如：奶茶杯'
          confirmType='search'
          value={keyword}
          onInput={event => setKeyword(event.detail.value)}
        />
      </View>

      {searching ? (
        <View className='quickref-card'>
          <View className='quickref-card__head'>
            <Text className='quickref-card__title'>搜索结果</Text>
            <Text className='quickref-card__count'>{results.length} 条</Text>
          </View>
          {results.length === 0 && (
            <View className='quickref-empty'>没有找到，试试换个说法</View>
          )}
          <View className='quickref-list'>
            {results.map(item => (
              <View
                className='quickref-row'
                key={`${item.code}-${item.name}`}
                onClick={() => openItem(item.name, item.code)}
              >
                <Text className='quickref-row__name'>{item.name}</Text>
                <Text
                  className={
                    'quickref-tag tag-' + (TONE_OF_CODE[item.code] || 'other')
                  }
                >
                  {categoryName(item.code)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        QUICKREF_GROUPS.map(group => (
          <View className='quickref-card' key={group.code}>
            <View className='quickref-card__head'>
              <Text className='quickref-card__title'>{group.name}</Text>
              <Text className='quickref-card__count'>共 {group.total} 种</Text>
            </View>
            <View className='quickref-chips'>
              {group.items.map(item => (
                <View
                  className='quickref-chip'
                  key={`${group.code}-${item.name}`}
                  onClick={() => openItem(item.name, group.code)}
                >
                  {item.name}
                </View>
              ))}
            </View>
            {group.total > group.items.length && (
              <View className='quickref-more'>
                仅展示常用 {group.items.length} 种，输入名称可查全部
              </View>
            )}
          </View>
        ))
      )}

      <Button className='quickref-share' openType='share'>
        分享速查表
      </Button>

      <View className='quickref-foot'>
        分类依据《上海市生活垃圾分类投放指引（2024版）》。其他城市标准可能不同，请以当地规定为准。
      </View>
    </View>
  )
}

export default QuickRef
