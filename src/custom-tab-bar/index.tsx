import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

const TAB_LIST = [
  {
    text: '首页',
    pagePath: '/pages/index/index',
    iconPath: '/static/image/outline_home_black_18.png',
    selectedIconPath: '/static/image/round_home_black_18.png'
  },
  {
    text: '测验',
    pagePath: '/pages/test/test',
    iconPath: '/static/image/outline_visibility_black_18.png',
    selectedIconPath: '/static/image/round_visibility_black_18.png'
  },
  {
    text: '预报',
    pagePath: '/pages/forecast/forecast',
    iconPath: '/static/image/outline_cloud_black_18.png',
    selectedIconPath: '/static/image/round_cloud_black_18.png'
  }
]

const getCurrentIndex = () => {
  const pages = Taro.getCurrentPages()
  const route = (pages[pages.length - 1]?.route || '').replace(/^\//, '')
  const index = TAB_LIST.findIndex(item => item.pagePath === `/${route}`)
  return index === -1 ? 0 : index
}

function CustomTabBar() {
  const [selected, setSelected] = useState(getCurrentIndex)

  useEffect(() => {
    const sync = () => setSelected(getCurrentIndex())
    Taro.eventCenter.on('sync-tabbar', sync)
    return () => {
      Taro.eventCenter.off('sync-tabbar', sync)
    }
  }, [])

  const switchTab = (index: number) => {
    if (index === selected) {
      return
    }
    setSelected(index)
    Taro.switchTab({ url: TAB_LIST[index].pagePath })
  }

  return (
    <View className='custom-tab-bar'>
      {TAB_LIST.map((item, index) => {
        const active = selected === index
        return (
          <View
            key={item.pagePath}
            className={'custom-tab-bar__item' + (active ? ' is-active' : '')}
            onClick={() => switchTab(index)}
          >
            <Image
              className={'custom-tab-bar__icon' + (active ? ' is-active' : '')}
              src={active ? item.selectedIconPath : item.iconPath}
            />
            <View className='custom-tab-bar__text'>{item.text}</View>
          </View>
        )
      })}
    </View>
  )
}

export default CustomTabBar
