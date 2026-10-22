import { useRef, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Icon, Input, Button, Text, Ad } from '@tarojs/components'
import { SearchGarbage } from '../../api/index'
import IndexModel from '../../model/index/index'
import { GarbageItem, SelectedSort } from '../../type/index'
import { ITouchEvent } from '@tarojs/components/types/common'

import './index.scss'

const IMG_LIST = ['ico-3', 'ico-4', 'ico-2', 'ico-1']

function Index() {
  const [search, setSearch] = useState('')
  const [garbageList, setGarbageList] = useState<GarbageItem[]>([])
  const [selectedSort, setSelectedSort] = useState<SelectedSort | null>(null)
  const requestId = useRef(0)

  useShareAppMessage(() => ({ title: '垃圾分类助手' }))

  const clear = () => {
    requestId.current += 1
    setGarbageList([])
    setSearch('')
  }

  const seach = async (e: any) => {
    const str: string = e.detail.value
    setSearch(str)
    if (!str.trim()) {
      clear()
      return
    }
    const currentId = ++requestId.current
    try {
      const list = await SearchGarbage(str.trim())
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

  const searchSort = (e: ITouchEvent) => {
    const name = e.currentTarget.dataset.name as string
    const data = garbageList.find(item => item.name === name)
    if (!data) {
      return
    }
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

  return (
    <View className='index-container'>
      <View className='searchFiled'>
        <Icon type='search' color='rgb(156, 156, 156)' />
        <Input
          className='input'
          placeholder='输入垃圾名称'
          confirmType='search'
          onInput={seach}
          value={search}
        />
        <View onClick={clear} className='icon'>
          <Icon type='cancel' color='rgb(156, 156, 156)' />
        </View>
      </View>
      {
        garbageList.map((item, index) => {
          return (
            <View className='searchList' key={`${item.name}-${index}`}>
              <View
                className='searchCell'
                onClick={searchSort}
                data-name={item.name}
              >
                {item.name}
              </View>
              <View className='line'></View>
            </View>
          )
        })
      }
      {
        search && garbageList.length === 0 &&
          <View className='desc'>未找到相关垃圾分类信息</View>
      }
      {
        garbageList.length === 0 && !search &&
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
        garbageList.length === 0 && !search &&
          <View className='desc'>
            工具说明: 上海垃圾分类查询小工具，2019年7月1日,《上海市生活垃圾管理条例》正式实施，生活垃圾按照
            <Text>"可回收物"、"有害垃圾"、"湿垃圾"、"干垃圾"</Text>
            的分类标准。
          </View>
      }
      <Button className='button' openType='share'>
        分享
      </Button>
      <Ad
        unitId='adunit-8f9c15536d079fb7'
        onLoad={() => console.log('ad onLoad')}
        onError={() => console.log('ad onError')}
        onClose={() => console.log('ad onClose')}
      />
    </View>
  )
}

export default Index
