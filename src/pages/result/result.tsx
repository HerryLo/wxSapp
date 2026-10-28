import { useEffect } from 'react'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import IndexModel from '../../model/index/index'
import { findQuickRefItem } from '../../content/quickref'
import { garbageShareTitle } from '../../utils/share'

import './result.scss'

function safeDecode(value?: string): string {
  if (!value) {
    return ''
  }
  try {
    return decodeURIComponent(value)
  } catch (err) {
    return value
  }
}

const toneOf = (code: number): string => {
  if (code === 1) return 'wet'
  if (code === 2) return 'dry'
  if (code === 3) return 'recycle'
  if (code === 4) return 'harmful'
  return 'other'
}

function Result() {
  const router = useRouter()
  const name = safeDecode(router.params.name)
  const found = findQuickRefItem(name)
  const code = found ? found.code : Number(router.params.code || 0)
  const info = code >= 1 && code <= 7 ? IndexModel.getSort(code - 1) : null
  const category = info ? info.name : safeDecode(router.params.category)
  const tone = toneOf(code)

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: name || '垃圾分类结果' })
  }, [name])

  useShareAppMessage(() => ({
    title: garbageShareTitle(name, category),
    path: `/pages/result/result?name=${encodeURIComponent(name)}&code=${code}`
  }))

  if (!name) {
    return (
      <View className='result-page'>
        <View className='result-card'>
          <View className='result-empty'>没有要查询的物品</View>
          <Button
            className='result-btn'
            onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
          >
            去查询
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className='result-page'>
      <View className='result-card'>
        <View className='result-head'>
          <View className='result-name'>{name}</View>
          <Text className={'result-tag tag-' + tone}>
            {category || '暂无分类'}
          </Text>
        </View>
        {info && <View className='result-desc'>{info.des}</View>}
      </View>

      {info && info.inc && (
        <View className='result-card'>
          <View className='result-label'>主要包括</View>
          <View className='result-text'>{info.inc}</View>
        </View>
      )}

      {info && info.req && (
        <View className='result-card'>
          <View className='result-label'>投放要求</View>
          <View className='result-text'>{info.req}</View>
        </View>
      )}

      <View className='result-actions'>
        <Button className='result-btn result-btn--primary' openType='share'>
          分享这个结果
        </Button>
        <Button
          className='result-btn'
          onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
        >
          再查一个
        </Button>
      </View>

      <View className='result-foot'>
        分类依据《上海市生活垃圾分类投放指引（2024版）》，其他城市请以当地规定为准。
      </View>
    </View>
  )
}

export default Result
