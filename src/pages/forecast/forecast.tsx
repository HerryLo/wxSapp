import { useEffect, useRef, useState } from 'react'
import Taro, {
  useDidShow,
  usePullDownRefresh,
  useShareAppMessage
} from '@tarojs/taro'
import { View, Text, Button, ScrollView, Input } from '@tarojs/components'
import { RealTimeWeather, SearchCity, WeatherV24h, WeatherV7d } from '../../api/index'
import { CityItem, SavedCity } from '../../type/index'
import { readStorage, writeStorage } from '../../utils/storage'
import { SHARE_TITLE } from '../../utils/util'

import './forecast.scss'

const CITY_KEY = 'weather_saved_city'
const CITY_HISTORY_KEY = 'weather_city_history'
const CITY_HISTORY_MAX = 8

interface AreaInfo {
  adm2?: string
  name?: string
}

interface WeatherNow {
  text?: string
  temp?: string
  feelsLike?: string
  windDir?: string
  windScale?: string
  obsTime?: string
  humidity?: string
  vis?: string
  pressure?: string
  cloud?: string
  precip?: string
  icon?: string
}

interface HourlyWeather {
  fxTime?: string
  temp?: string
  icon?: string
}

interface DailyWeather {
  fxDate?: string
  tempMin?: string
  tempMax?: string
  textDay?: string
  iconDay?: string
  sunrise?: string
  sunset?: string
  moonPhase?: string
  uvIndex?: string
  windDirDay?: string
  windScaleDay?: string
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const formatClock = (time?: string) => {
  if (!time) {
    return '--'
  }
  const match = time.match(/T(\d{2}):(\d{2})/)
  return match ? `${match[1]}:${match[2]}` : '--'
}

const formatMonthDay = (date?: string) => {
  if (!date) {
    return '--'
  }
  const parts = date.split('-')
  if (parts.length !== 3) {
    return date
  }
  return `${Number(parts[1])}月${Number(parts[2])}日`
}

const weekdayLabel = (date: string, index: number) => {
  if (index === 0) {
    return '今天'
  }
  if (index === 1) {
    return '明天'
  }
  const parts = date.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return '--'
  }
  return WEEKDAYS[new Date(parts[0], parts[1] - 1, parts[2]).getDay()] || '--'
}

const weatherEmoji = (icon?: string) => {
  const code = Number(icon)
  if (!code) {
    return '🌤️'
  }
  if (code >= 200 && code < 300) {
    return '🌬️'
  }
  if (code >= 300 && code < 400) {
    return '🌧️'
  }
  if (code >= 400 && code < 500) {
    return '🌨️'
  }
  if (code >= 500 && code < 600) {
    return '🌫️'
  }
  if (code === 100) {
    return '☀️'
  }
  if (code === 150) {
    return '🌙'
  }
  if (code === 101 || code === 102 || code === 103 || code === 152) {
    return '⛅'
  }
  if (code === 104 || code === 151 || code === 153) {
    return '☁️'
  }
  return '🌤️'
}

const uvText = (uv?: string) => {
  const value = Number(uv)
  if (Number.isNaN(value)) {
    return '--'
  }
  if (value <= 2) {
    return `${value} 弱`
  }
  if (value <= 5) {
    return `${value} 中等`
  }
  if (value <= 7) {
    return `${value} 强`
  }
  return `${value} 很强`
}

const heroTheme = (icon?: string, obsTime?: string) => {
  const code = Number(icon)
  const hour = obsTime ? Number(obsTime.slice(11, 13)) : -1
  if (code >= 300 && code < 400) {
    return 'hero-rain'
  }
  if (code >= 400 && code < 500) {
    return 'hero-snow'
  }
  if (hour >= 19 || (hour >= 0 && hour < 6)) {
    return 'hero-night'
  }
  if (code === 100 || code === 150) {
    return 'hero-clear'
  }
  return 'hero-cloudy'
}

function ForeCast() {
  const [dataInfo, setDataInfo] = useState<WeatherNow | null>(null)
  const [areaInfo, setAreaInfo] = useState<AreaInfo | null>(null)
  const [daily, setDaily] = useState<DailyWeather[]>([])
  const [hourly, setHourly] = useState<HourlyWeather[]>([])
  const [updateTime, setUpdateTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needSetting, setNeedSetting] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [cityList, setCityList] = useState<CityItem[]>([])
  const [cityLoading, setCityLoading] = useState(false)
  const [cityHistory, setCityHistory] = useState<SavedCity[]>(() =>
    readStorage<SavedCity[]>(CITY_HISTORY_KEY, [])
  )
  const interstitialAd = useRef<any>(null)

  useShareAppMessage(() => ({ title: SHARE_TITLE }))

  const weather = async (target?: SavedCity | null) => {
    setLoading(true)
    setError('')
    setNeedSetting(false)
    let fromGps = false
    try {
      if (target === null) {
        try {
          Taro.removeStorageSync(CITY_KEY)
        } catch (err) {
          console.error('清除保存城市失败', err)
        }
      }
      const saved = target === undefined ? readStorage<SavedCity | null>(CITY_KEY, null) : target
      let loc = ''
      if (saved) {
        loc = saved.location
        setAreaInfo({ name: saved.name })
      } else {
        fromGps = true
        const location = await Taro.getLocation({ type: 'wgs84' })
        loc = `${location.longitude},${location.latitude}`
      }
      const [areaRes, nowRes, dailyRes, hourlyRes] = await Promise.all([
        SearchCity({ location: loc }).catch(() => null),
        RealTimeWeather({ location: loc }),
        WeatherV7d({ location: loc }),
        WeatherV24h({ location: loc }).catch(() => null)
      ])
      if (nowRes.data.code !== '200' || dailyRes.data.code !== '200') {
        throw new Error('天气接口返回异常')
      }
      setDataInfo(nowRes.data.now || null)
      setAreaInfo(areaRes?.data?.location?.[0] || (saved ? { name: saved.name } : null))
      setDaily(dailyRes.data.daily || [])
      setHourly(hourlyRes?.data?.code === '200' ? hourlyRes.data.hourly || [] : [])
      setUpdateTime(dailyRes.data.updateTime || nowRes.data.updateTime || '')
    } catch (err: any) {
      console.error('获取天气失败', err)
      const message: string = err?.errMsg || ''
      const denied = fromGps && /auth|authorize|permission|deny/i.test(message)
      setNeedSetting(denied)
      setError(denied ? '定位权限未开启，请在设置中允许定位' : '获取天气失败')
    } finally {
      setLoading(false)
    }
  }

  const searchCity = async () => {
    const word = keyword.trim()
    if (!word) {
      return
    }
    setCityLoading(true)
    try {
      const res = await SearchCity({ location: word })
      if (res.data.code === '200') {
        setCityList(res.data.location || [])
      } else {
        setCityList([])
      }
    } catch (err) {
      console.error('搜索城市失败', err)
      setCityList([])
      Taro.showToast({ title: '城市搜索失败', icon: 'none' })
    } finally {
      setCityLoading(false)
    }
  }

  const applyCity = (city: SavedCity) => {
    writeStorage(CITY_KEY, city)
    const nextHistory = [
      city,
      ...cityHistory.filter(item => item.location !== city.location)
    ].slice(0, CITY_HISTORY_MAX)
    setCityHistory(nextHistory)
    writeStorage(CITY_HISTORY_KEY, nextHistory)
    setPickerOpen(false)
    setCityList([])
    setKeyword('')
    setDataInfo(null)
    setDaily([])
    setHourly([])
    weather(city)
  }

  const chooseCity = (item: CityItem) => {
    if (!item.lon || !item.lat) {
      return
    }
    applyCity({ name: item.name, location: `${item.lon},${item.lat}` })
  }

  const clearCityHistory = () => {
    setCityHistory([])
    writeStorage(CITY_HISTORY_KEY, [])
  }

  const useCurrentCity = () => {
    setPickerOpen(false)
    setCityList([])
    setKeyword('')
    setDataInfo(null)
    setDaily([])
    setHourly([])
    weather(null)
  }

  const handleErrorClick = async () => {
    if (!needSetting) {
      weather()
      return
    }
    const setting = await Taro.openSetting()
    if (setting.authSetting['scope.userLocation']) {
      weather()
    }
  }

  useEffect(() => {
    weather()
  }, [])

  usePullDownRefresh(async () => {
    await weather()
    Taro.stopPullDownRefresh()
  })

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

  const today = daily[0]
  const temps = daily.reduce<number[]>((list, item) => {
    const min = Number(item.tempMin)
    const max = Number(item.tempMax)
    if (!Number.isNaN(min)) {
      list.push(min)
    }
    if (!Number.isNaN(max)) {
      list.push(max)
    }
    return list
  }, [])
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0
  const tempRange = Math.max(maxTemp - minTemp, 1)

  const hourList = dataInfo
    ? [
        { label: '现在', temp: dataInfo.temp, icon: dataInfo.icon },
        ...hourly.map(item => ({
          label: formatClock(item.fxTime),
          temp: item.temp,
          icon: item.icon
        }))
      ]
    : []

  const metrics = dataInfo
    ? [
        { label: '湿度', value: dataInfo.humidity ? `${dataInfo.humidity}%` : '--' },
        {
          label: '风力',
          value: `${dataInfo.windDir || '--'} ${dataInfo.windScale || '-'}级`
        },
        { label: '能见度', value: dataInfo.vis ? `${dataInfo.vis} km` : '--' },
        { label: '气压', value: dataInfo.pressure ? `${dataInfo.pressure} hPa` : '--' },
        { label: '云量', value: dataInfo.cloud ? `${dataInfo.cloud}%` : '--' },
        { label: '降水', value: dataInfo.precip ? `${dataInfo.precip} mm` : '--' }
      ]
    : []

  const cityName = areaInfo?.name || areaInfo?.adm2 || '当前位置'
  const theme = heroTheme(dataInfo?.icon, dataInfo?.obsTime)
  const updateText = updateTime
    ? `${formatMonthDay(updateTime.slice(0, 10))} ${formatClock(updateTime)}`
    : '--'

  return (
    <View className='forecast'>
      {error && (
        <View className='error-tip' onClick={handleErrorClick}>
          {error}，{needSetting ? '去设置' : '点击重试'}
        </View>
      )}

      {!dataInfo && (
        <View className='state-card'>
          {loading ? '正在获取天气…' : '暂无天气数据'}
        </View>
      )}

      {dataInfo && (
        <>
          <View className={'hero ' + theme}>
            <View className='hero-top'>
              <View className='location' onClick={() => setPickerOpen(true)}>
                <Text className='location-pin'>📍</Text>
                <Text className='city'>{cityName}</Text>
                <Text className='location-arrow'>▾</Text>
              </View>
              <Button className='share-btn' openType='share'>
                分享
              </Button>
            </View>
            <View className='hero-date'>
              {today
                ? `${formatMonthDay(today.fxDate)} ${weekdayLabel(today.fxDate || '', 0)}`
                : '--'}
            </View>
            <View className='hero-main'>
              <View className='temp'>
                {dataInfo.temp || '--'}
                <Text className='degree'>°</Text>
              </View>
              <View className='summary'>
                <View className='condition'>{dataInfo.text || '--'}</View>
                <View className='feels'>体感 {dataInfo.feelsLike || '--'}°</View>
                {today && (
                  <View className='range'>
                    {today.tempMin || '--'}° / {today.tempMax || '--'}°
                  </View>
                )}
              </View>
            </View>
            <View className='hero-foot'>
              <Text>
                {dataInfo.windDir || '--'} {dataInfo.windScale || '-'}级
              </Text>
              <Text>更新于 {formatClock(dataInfo.obsTime)}</Text>
            </View>
          </View>

          <View className='section'>
            <View className='section-title'>24小时预报</View>
            <ScrollView className='hourly' scrollX>
              {hourList.map((item, index) => (
                <View
                  className={'hour-item' + (index === 0 ? ' is-now' : '')}
                  key={`${item.label}-${index}`}
                >
                  <Text className='hour-time'>{item.label}</Text>
                  <Text className='hour-icon'>{weatherEmoji(item.icon)}</Text>
                  <Text className='hour-temp'>{item.temp || '--'}°</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View className='section'>
            <View className='section-title'>当前详情</View>
            <View className='metrics'>
              {metrics.map(item => (
                <View className='metric-card' key={item.label}>
                  <View className='metric-label'>{item.label}</View>
                  <View className='metric-value'>{item.value}</View>
                </View>
              ))}
            </View>
          </View>

          {daily.length > 0 && (
            <View className='section'>
              <View className='section-title'>7天预报</View>
              <View className='daily'>
                {daily.map((item, index) => {
                  const min = Number(item.tempMin)
                  const max = Number(item.tempMax)
                  const left = Number.isNaN(min)
                    ? 0
                    : ((min - minTemp) / tempRange) * 100
                  const width =
                    Number.isNaN(min) || Number.isNaN(max)
                      ? 0
                      : Math.max(((max - min) / tempRange) * 100, 6)
                  return (
                    <View className='day-row' key={item.fxDate || index}>
                      <View className='day-label'>
                        <Text className='day-name'>
                          {weekdayLabel(item.fxDate || '', index)}
                        </Text>
                        <Text className='day-date'>
                          {(item.fxDate || '').slice(5).replace('-', '/')}
                        </Text>
                      </View>
                      <Text className='day-icon'>{weatherEmoji(item.iconDay)}</Text>
                      <View className='day-desc'>
                        <Text className='day-text'>{item.textDay || '--'}</Text>
                        <Text className='day-wind'>
                          {item.windDirDay || '--'} {item.windScaleDay || '-'}级
                        </Text>
                      </View>
                      <View className='day-temp'>
                        <Text className='temp-min'>{item.tempMin || '--'}°</Text>
                        <View className='temp-track'>
                          <View
                            className='temp-bar'
                            style={{ left: `${left}%`, width: `${width}%` }}
                          />
                        </View>
                        <Text className='temp-max'>{item.tempMax || '--'}°</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          )}

          {today && (
            <View className='section'>
              <View className='section-title'>今日概览</View>
              <View className='overview'>
                <View className='overview-item'>
                  <Text className='overview-icon'>🌅</Text>
                  <Text className='overview-label'>日出</Text>
                  <Text className='overview-value'>{today.sunrise || '--'}</Text>
                </View>
                <View className='overview-item'>
                  <Text className='overview-icon'>🌇</Text>
                  <Text className='overview-label'>日落</Text>
                  <Text className='overview-value'>{today.sunset || '--'}</Text>
                </View>
                <View className='overview-item'>
                  <Text className='overview-icon'>☀️</Text>
                  <Text className='overview-label'>紫外线</Text>
                  <Text className='overview-value'>{uvText(today.uvIndex)}</Text>
                </View>
                <View className='overview-item'>
                  <Text className='overview-icon'>🌙</Text>
                  <Text className='overview-label'>月相</Text>
                  <Text className='overview-value'>{today.moonPhase || '--'}</Text>
                </View>
              </View>
            </View>
          )}

          <View className='update-time'>数据更新于 {updateText}</View>
        </>
      )}

      {pickerOpen && (
        <View className='city-back' onClick={() => setPickerOpen(false)}>
          <View className='city-panel' onClick={e => e.stopPropagation()}>
            <View className='city-head'>切换城市</View>
            {cityHistory.length > 0 && (
              <View className='city-recent'>
                <View className='city-recent-head'>
                  <Text className='city-recent-title'>最近选择</Text>
                  <Text className='city-recent-clear' onClick={clearCityHistory}>
                    清除
                  </Text>
                </View>
                <View className='city-chips'>
                  {cityHistory.map(city => (
                    <View
                      className='city-chip'
                      key={city.location}
                      onClick={() => applyCity(city)}
                    >
                      {city.name}
                    </View>
                  ))}
                </View>
              </View>
            )}
            <Input
              className='city-input'
              placeholder='输入城市名，如 北京'
              confirmType='search'
              value={keyword}
              onInput={e => setKeyword(e.detail.value)}
              onConfirm={searchCity}
            />
            {cityLoading && <View className='city-empty'>搜索中…</View>}
            {!cityLoading && cityList.length === 0 && (
              <View className='city-empty'>暂无结果，输入后按键盘搜索</View>
            )}
            {cityList.map(item => (
              <View
                className='city-item'
                key={item.id}
                onClick={() => chooseCity(item)}
              >
                <Text className='city-name'>{item.name}</Text>
                {item.adm2 && item.adm2 !== item.name && (
                  <Text className='city-sub'>{item.adm2}</Text>
                )}
              </View>
            ))}
            <View className='city-current' onClick={useCurrentCity}>
              使用当前位置
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default ForeCast
