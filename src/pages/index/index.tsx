import { useEffect, useRef, useState } from 'react'
import Taro, { useDidHide, useShareAppMessage } from '@tarojs/taro'
import { View, Icon, Input, Button, Text, Ad } from '@tarojs/components'
import { SearchGarbage } from '../../api/index'
import IndexModel from '../../model/index/index'
import { GarbageItem, SelectedSort } from '../../type/index'
import { readStorage, writeStorage } from '../../utils/storage'
import { ITouchEvent } from '@tarojs/components/types/common'

import './index.scss'

const IMG_LIST = ['ico-3', 'ico-4', 'ico-2', 'ico-1']
const HOT_SEARCHES = ['电池', '塑料瓶', '剩菜剩饭', '快递纸箱', '口罩', '灯管', '旧衣服', '陶瓷碗']
const HISTORY_KEY = 'garbage_search_history'
const HISTORY_MAX = 10

const categoryTone = (category: string) => {
  if (category === '湿垃圾') return 'wet'
  if (category === '干垃圾') return 'dry'
  if (category === '可回收物') return 'recycle'
  if (category === '有害垃圾') return 'harmful'
  return 'other'
}

function Index() {
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const [garbageList, setGarbageList] = useState<GarbageItem[]>([])
  const [selectedSort, setSelectedSort] = useState<SelectedSort | null>(null)
  const [history, setHistory] = useState<string[]>(() =>
    readStorage<string[]>(HISTORY_KEY, [])
  )
  const requestId = useRef(0)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useShareAppMessage(() => ({ title: '垃圾分类助手' }))

  useEffect(() => () => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
    }
  }, [])

  const handleFocus = () => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
    setFocused(true)
  }

  // 延迟隐藏，避免点击「最近搜索」时先触发 blur 导致列表被移除
  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setFocused(false), 150)
  }

  // 点击输入框以外区域时主动收起搜索面板
  const closeSearchPanel = () => {
    if (!focused) {
      return
    }
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
    setFocused(false)
    Taro.hideKeyboard()
  }

  // 离开页面（如切换 tab）时重置搜索面板，避免广告等元素残留展示
  useDidHide(() => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
    setFocused(false)
  })

  const clear = () => {
    requestId.current += 1
    setGarbageList([])
    setSearch('')
  }

  const pushHistory = (word: string) => {
    const next = [word, ...history.filter(item => item !== word)].slice(0, HISTORY_MAX)
    setHistory(next)
    writeStorage(HISTORY_KEY, next)
  }

  const clearHistory = () => {
    setHistory([])
    writeStorage(HISTORY_KEY, [])
  }

  const runSearch = async (raw: string, record = false) => {
    const str = raw.trim()
    setSearch(raw)
    if (!str) {
      clear()
      return
    }
    if (record) {
      pushHistory(str)
    }
    const currentId = ++requestId.current
    try {
      const list = await SearchGarbage(str)
      if (currentId === requestId.current) {
        setGarbageList(list)
      }
    } catch (err) {
      if (currentId === requestId.current) {
        setGarbageList([])
        Taro.showToast({
          title: err instanceof Error ? err.message : '查询失败',
          icon: 'none'
        })
      }
    }
  }

  const seach = (e: any) => {
    runSearch(e.detail.value)
  }

  const confirmSearch = () => {
    runSearch(search, true)
  }

  const searchSort = (e: ITouchEvent) => {
    const name = e.currentTarget.dataset.name as string
    const data = garbageList.find(item => item.name === name)
    if (!data) {
      return
    }
    pushHistory(data.name)
    const index = IndexModel.handleCategory(data.category)
    if (index === undefined) {
      Taro.showToast({ title: '暂不支持该垃圾类型', icon: 'none' })
      return
    }
    setSelectedSort(IndexModel.getSort(index))
  }

  const dismiss = () => {
    setSelectedSort(null)
  }

  const routeGo = (e: ITouchEvent) => {
    const { link, index } = e.currentTarget.dataset
    Taro.navigateTo({
      url: `${link}?index=${index}`
    })
  }

  const goKnowledge = () => {
    Taro.navigateTo({ url: '/pages/knowledge/index' })
  }

  return (
    <View className='index-container' onClick={closeSearchPanel}>
      <View className='searchFiled' onClick={e => e.stopPropagation()}>
        <Icon type='search' color='rgb(156, 156, 156)' />
        <Input
          className='input'
          placeholder='输入垃圾名称'
          confirmType='search'
          onInput={seach}
          onConfirm={confirmSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={search}
        />
        <View onClick={clear} className='icon'>
          <Icon type='cancel' color='rgb(156, 156, 156)' />
        </View>
      </View>
      {
        !search && focused && history.length > 0 &&
          <View className='search-history'>
            <View className='chip-head'>
              <Text className='chip-title'>最近搜索</Text>
              <Text className='chip-clear' onClick={clearHistory}>清除</Text>
            </View>
            <View className='chip-wrap'>
              {history.map(word => (
                <View
                  className='chip'
                  key={word}
                  onClick={() => runSearch(word, true)}
                >
                  {word}
                </View>
              ))}
            </View>
          </View>
      }
      {
        !search && focused &&
          <View className='search-history'>
            <View className='chip-head'>
              <Text className='chip-title'>热门搜索</Text>
            </View>
            <View className='chip-wrap'>
              {HOT_SEARCHES.map(word => (
                <View
                  className='chip'
                  key={word}
                  onClick={() => runSearch(word, true)}
                >
                  {word}
                </View>
              ))}
            </View>
          </View>
      }
      {
        garbageList.length > 0 &&
          <View className='searchResults'>
            {garbageList.map((item, index) => {
              return (
                <View className='searchList' key={`${item.name}-${index}`}>
                  <View
                    className='searchCell'
                    onClick={searchSort}
                    data-name={item.name}
                  >
                    <Text className='search-name'>{item.name}</Text>
                    <Text className={'tag tag-' + categoryTone(item.category)}>
                      {item.category}
                    </Text>
                  </View>
                  <View className='line'></View>
                </View>
              )
            })}
          </View>
      }
      {
        search && garbageList.length === 0 &&
          <View className='desc'>未找到相关垃圾分类信息</View>
      }
      {
        garbageList.length === 0 && !search && !focused &&
          <View className='img-container'>
            {
              IMG_LIST.map((item, index) => {
                return (
                  <View
                    key={index}
                    onClick={routeGo}
                    data-link='/pages/detail/detail'
                    data-index={index}
                    className={'inconImage ' + item}
                  >
                  </View>
                )
              })
            }
          </View>
      }
      {
        garbageList.length === 0 && !search && !focused &&
          <View className='knowledge-entry' onClick={goKnowledge}>
            <View className='knowledge-entry__icon'>📚</View>
            <View className='knowledge-entry__body'>
              <View className='knowledge-entry__title'>垃圾去哪了？</View>
              <View className='knowledge-entry__desc'>环境风险 · 处理技术 · 减量行动</View>
            </View>
            <View className='knowledge-entry__arrow'>›</View>
          </View>
      }
      {
        selectedSort !== null &&
          <View className='resultback' onClick={dismiss}>
            <View className='resultView'>
              <View className='resultHead'>
                {selectedSort.name}
              </View>
              <View className='desView'>
                <View
                  className={'bigIcon ' + selectedSort.iconClass}
                  style={{ backgroundColor: selectedSort.color }}
                ></View>
                {selectedSort.des}
              </View>
              {
                selectedSort.inc &&
                  <View className='title'>
                    {selectedSort.name}主要包括
                  </View>
              }
              <View className='des'>
                {selectedSort.inc}
              </View>
              {
                selectedSort.req &&
                  <View className='title'>
                    {selectedSort.name}投放要求
                  </View>
              }
              <View className='des'>
                {selectedSort.req}
              </View>
            </View>
          </View>
      }
      {
        garbageList.length === 0 && !search && !focused &&
          <View className='desc'>
            工具说明: 上海垃圾分类查询小工具，2019年7月1日,《上海市生活垃圾管理条例》正式实施，生活垃圾按照
            <Text>"可回收物"、"有害垃圾"、"湿垃圾"、"干垃圾"</Text>
            的分类标准。
          </View>
      }
      {
        !focused &&
          <Button className='button' openType='share'>
            分享
          </Button>
      }
      <View className='ad-wrap'>
        <Ad
          unitId='adunit-8f9c15536d079fb7'
          onLoad={() => console.log('ad onLoad')}
          onError={() => console.log('ad onError')}
          onClose={() => console.log('ad onClose')}
        />
      </View>
    </View>
  )
}

export default Index
