import { useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { getArticle } from '../../content/knowledge'
import { TOPICS } from '../../content/knowledge/topics'

import './detail.scss'

const NAMES = ['湿垃圾', '干垃圾', '可回收物', '有害垃圾']
const ICON_CLASS = ['ico-3', 'ico-4', 'ico-2', 'ico-1']
const DES = [
  '是指日常生活垃圾产生的容易腐烂的生物质废弃物。',
  '是指除有害垃圾、可回收物、湿垃圾以外的其他生活废弃物。',
  '是指适宜回收利用和资源化利用的，如：玻、金、塑、 纸、衣。',
  '是指对人体健康或者自然环境造成直接或潜在危害的废弃物。',
  '建筑装修产生的垃圾, 不能直接丢入垃圾桶，需要投入专门的建筑垃圾桶或联系物业处理',
  '体积较大、整体性强，需要拆分再处理的废弃物品'
]
const INCS = [
  '包括食材废料，剩菜剩饭、瓜皮果核、花卉绿植、过期食品等易腐生活废弃物。',
  '包括餐盒、餐巾纸、湿纸巾、卫生间用纸、塑料袋、食品包装袋、污染严重的纸、烟蒂、纸尿裤、一次性杯子、大骨头、贝壳、花盆、陶瓷等。',
  '包括酱油瓶、玻璃杯、平板玻璃、易拉罐、饮料瓶、洗发水瓶、塑料玩具、书本、报纸、广告单、纸板箱、衣服、床上用品等。',
  '包括废电池、油漆桶、荧光灯管、废药品及其包装物等。'
]
const REQS = [
  '产生时与其他垃圾分开收集，尽量沥干水分，有包装物的湿垃圾应将包装物去除后分类投放，包装物请投放到对应的可回收物或干垃圾容器。',
  '放入干垃圾收集器，并保持周边环境整洁。',
  '轻投轻放、清洁干燥，避免污染。废纸尽量平整。立体包装物请清空内容物，清洁后压扁投放。有尖锐边角的，应包裹后投放。',
  '投放时请注意轻放。易破损的请连带包装或包裹后轻放，如易挥发，请密封后投放。'
]
const RELATED: string[][] = [
  ['kitchen-waste', 'three-r'],
  ['waste-to-energy', 'landfill'],
  ['chemical-recycling', 'old-clothes'],
  ['e-waste', 'waste-to-energy']
]

function Detail() {
  const router = useRouter()
  const index = Number(router.params.index || 0)

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: NAMES[index]
    })
  }, [index])

  return (
    <View>
      <View className='container'>
        <View className='detail-hero'>
          <View className={ICON_CLASS[index] + ' detail-hero__icon'}></View>
          <View className='detail-hero__body'>
            <View className='detail-hero__name'>{NAMES[index]}</View>
            <View className='detail-hero__desc'>{DES[index]}</View>
          </View>
        </View>
        <View className='detail-block'>
          <View className='detail-block__label'>主要内容</View>
          <View className='detail-block__text'>{INCS[index]}</View>
        </View>
        <View className='detail-block'>
          <View className='detail-block__label'>投放要求</View>
          <View className='detail-block__text'>{REQS[index]}</View>
        </View>
        {(RELATED[index] || []).length > 0 && (
          <View className='detail-related-title'>延伸阅读</View>
        )}
        {(RELATED[index] || []).map(articleId => {
          const item = getArticle(articleId)
          if (!item) {
            return null
          }
          return (
            <View
              className='related'
              key={item.id}
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/knowledge/detail?id=${item.id}`
                })
              }}
            >
              <View className='related__emoji'>{item.emoji}</View>
              <View className='related__body'>
                <View className='related__title'>{item.title}</View>
                <View className='related__meta'>
                  {TOPICS[item.topic].label} · {item.readMinutes} 分钟
                </View>
              </View>
              <View className='related__arrow'>›</View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default Detail
