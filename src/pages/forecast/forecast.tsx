import { useEffect, useRef, useState } from 'react'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import { RealTimeWeather, SearchCity, WeatherV7d } from '../../api/index'
import { handleTime } from '../../utils/util'

import './forecast.scss'

interface AreaInfo {
  adm2?: string
  name?: string
}

interface WeatherNow {
  text?: string
  temp?: string
  feelsLike?: string
  windDir?: string
  windSpeed?: string
  obsTime?: string
  humidity?: string
  vis?: string
  [key: string]: any
}

interface DailyWeather {
  fxDate: string
  tempMin: string
  tempMax: string
  textDay: string
  textNight: string
  sunrise: string
  sunset: string
}

interface Weather7d {
  daily?: DailyWeather[]
  updateTime?: string
}

function ForeCast() {
  const [dataInfo, setDataInfo] = useState<WeatherNow | null>(null)
  const [areaInfo, setAreaInfo] = useState<AreaInfo[] | null>(null)
  const [data7dInfo, setData7dInfo] = useState<Weather7d | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const interstitialAd = useRef<any>(null)

  useShareAppMessage(() => ({ title: '天气预报' }))

  const weather = async () => {
    setLoading(true)
    setError('')
    try {
      const location = await Taro.getLocation({ type: 'wgs84' })
      const { latitude, longitude } = location
      const areaRes = await SearchCity({
        location: `${longitude},${latitude}`
      })
      const weatherRes = await RealTimeWeather({
        location: `${longitude},${latitude}`
      })
      const weather7dRes = await WeatherV7d({
        location: `${longitude},${latitude}`
      })
      setDataInfo(weatherRes.data.now)
      setAreaInfo(areaRes.data.location)
      setData7dInfo(weather7dRes.data)
    } catch (err) {
      console.error('获取天气失败', err)
      setError('获取天气失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    weather()
  }, [])

  useDidShow(() => {
    if ((Taro as any).createInterstitialAd && !interstitialAd.current) {
      const ad = Taro.createInterstitialAd({
        adUnitId: 'adunit-e3b0b4a6854a07e2'
      })
      ad.onLoad(() => {})
      ad.onError((err) => {
        console.error('插屏广告加载失败', err)
      })
      ad.onClose(() => {})
      interstitialAd.current = ad
    }

    if (interstitialAd.current) {
      interstitialAd.current.show().catch((err: any) => {
        console.error('插屏广告显示失败', err)
      })
    }
  })

  return (
    <View className='forecast'>
      <View className='top'>
        <View style='height: 80rpx;'></View>
        <View className='currentWind'>
          {dataInfo?.text || '--'} {dataInfo?.temp || '--'}℃
        </View>
        <View className='weatherDesc padding'>
          体感温度 {dataInfo?.feelsLike || '--'}℃
        </View>
        <View className='temperature padding'>风向 {dataInfo?.windDir || '--'}</View>
        <View className='temperature padding'>风速 {dataInfo?.windSpeed || '--'}公里/小时</View>
        <View className='time'>
          <View>
            {dataInfo?.obsTime ? handleTime(dataInfo.obsTime) : '--'}
          </View>
          <View>
            {areaInfo?.[0]?.adm2} {areaInfo?.[0]?.name}
          </View>
        </View>
      </View>
      {loading && <View className='loading'>加载中...</View>}
      {error && (
        <View className='loading' onClick={weather}>
          {error}，点击重试
        </View>
      )}
      <View className='list'>
        <View className='list-item'>
          <Text>相对湿度 {dataInfo?.humidity || '--'}%</Text>
        </View>
        <View className='list-item'>
          <Text>能见度 {dataInfo?.vis || '--'}公里</Text>
        </View>
      </View>
      {data7dInfo?.daily && data7dInfo.daily.length > 0 && (
        <ScrollView className='scrollView' scrollX={true}>
          <View className='card'>
            {data7dInfo.daily.map((item, index) => {
              return (
                <View className='card-item' key={index}>
                  <View className='title'>{item.fxDate}</View>
                  <View className='desc'>温度：{item.tempMin}℃~{item.tempMax}℃</View>
                  <View className='desc'>白天： {item.textDay}</View>
                  <View className='desc'>夜间： {item.textNight}</View>
                  <View className='desc'>日出： {item.sunrise}</View>
                  <View className='desc'>日落： {item.sunset}</View>
                </View>
              )
            })}
          </View>
        </ScrollView>
      )}
      {data7dInfo?.updateTime && (
        <View className='updateTime7d'>7天天气更新：{handleTime(data7dInfo.updateTime)}</View>
      )}
      <Button className='button' openType='share'>
        分享
      </Button>
    </View>
  )
}

export default ForeCast
