import { useEffect, useRef, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Text, Button, Ad } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'
import { randomArray } from '../../utils/util'
import { result } from '../../static/result'

import './test.scss'

interface ResultProp {
  a: string
  c: string
  i: string
  n: string
}

const RANDOM_NUMBER = 10
const NAMES = ['湿垃圾', '干垃圾', '可回收物', '有害垃圾']
const ICON_CLASS = ['ico-1', 'ico-2', 'ico-3', 'ico-4']

function Test() {
  const clickState = useRef(true)
  const [arrResult, setArrResult] = useState<ResultProp[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [index, setIndex] = useState(-1)
  const [resultIndexList, setResultIndexList] = useState<number[]>([])
  const [grade, setGrade] = useState(0)

  useShareAppMessage(() => ({ title: '垃圾分类统一考试' }))

  const dataInit = () => {
    const { data } = result
    const list = [1, 2, 3, 4]
    const arr = randomArray<number>(list, RANDOM_NUMBER)
    const nextResult = arr.reduce<ResultProp[]>((acc, i) => {
      return acc.concat(randomArray<ResultProp>(data[i], 1))
    }, [])
    setArrResult(nextResult)
    setIndex(-1)
    setGrade(0)
    setCurrentIndex(0)
    setResultIndexList([])
  }

  useEffect(() => {
    dataInit()
  }, [])

  const clickCard = (e: ITouchEvent) => {
    if (!clickState.current) return
    clickState.current = false
    const { currentindex, index: cardIndex } = e.currentTarget.dataset
    const nextCurrentIndex = Number(currentindex) + 1
    const selected = Number(cardIndex)
    setIndex(selected)
    setTimeout(() => {
      const nextList = [...resultIndexList, selected]
      setResultIndexList(nextList)
      setIndex(-1)
      setCurrentIndex(nextCurrentIndex)
      setTimeout(() => {
        clickState.current = true
      }, 200)
      if (nextCurrentIndex === 10) {
        let nextGrade = 0
        nextList.forEach((item, i) => {
          if (item + 1 === Number(arrResult[i].c)) {
            nextGrade += 10
          }
        })
        setGrade(nextGrade)
      }
    }, 300)
  }

  const routerGo = (e: ITouchEvent) => {
    Taro.reLaunch({
      url: e.currentTarget.dataset.link
    })
  }

  const ci = currentIndex < 9 ? '0' + (currentIndex + 1) : currentIndex + 1

  return (
    <View className='container'>
      <View
        className='icon_Swiper'
        style={{
          transform: `translateX(-${currentIndex * 100}vw)`,
          transition: '0.3s'
        }}
      >
        {arrResult.map((item, ids) => {
          return (
            <View key={ids} className='icon_list'>
              <View className='number'>
                <Text>{ci}</Text> / 10
              </View>
              <View className='title'>{item.n}</View>
              {ICON_CLASS.map((iconClass, ins) => {
                return (
                  <View
                    key={ins}
                    data-index={ins}
                    data-currentindex={ids}
                    onClick={clickCard}
                    className={
                      (index === ins ? 'active' : '') + ' card_Info'
                    }
                  >
                    <View className={iconClass + ' inconImage'}></View>
                    <View className='name'>{NAMES[ins]}</View>
                  </View>
                )
              })}
            </View>
          )
        })}
        <View className='resultList'>
          <View className='resultList-title'>成绩单</View>
          {arrResult.map((item, resultIndex) => {
            const seletype = resultIndexList[resultIndex]
            return (
              <View className='result-item' key={item.i}>
                <View className='name'>{item.n}</View>
                <View className='typeResult'>
                  <View className='type'>{NAMES[Number(item.c) - 1]}</View>
                  <View className='result'>
                    {NAMES[seletype] === NAMES[Number(item.c) - 1] ? (
                      '✔'
                    ) : (
                      <Text>{NAMES[seletype]}</Text>
                    )}
                  </View>
                </View>
              </View>
            )
          })}
          <View className='grade'>分数：{grade}</View>
          <View className='btnList'>
            <View className='btn1' onClick={dataInit}>
              再试一次
            </View>
            <Button className='btn2' openType='share'>
              考考别人
            </Button>
          </View>
          <View
            className='foot'
            onClick={routerGo}
            data-link='/pages/index/index'
          >
            更多垃圾分类
          </View>
        </View>
      </View>
      <Button className='button' openType='share'>
        分享
      </Button>
      <Ad
        unitId='adunit-1a4ad7108719235b'
        onLoad={() => console.log('ad onLoad')}
        onError={() => console.log('ad onError')}
        onClose={() => console.log('ad onClose')}
      />
    </View>
  )
}

export default Test
