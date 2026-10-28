import { useCallback, useMemo, useRef, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { Map, MapProps, ScrollView, Text, View } from '@tarojs/components'
import {
  CityKey,
  CityPlants,
  coordTypeText,
  Plant,
  PLANTS_UPDATED_AT,
  plantCities
} from '../../data/plants'
import { wgs2gcj } from '../../utils/coord'
import { SHARE_TITLE } from '../../utils/util'

import './index.scss'

interface SelectedPlant {
  plant: Plant
  /** GCJ-02 坐标 */
  latitude: number
  longitude: number
}

const MAP_ID = 'plant-map'

// 编号圆点 marker：精确坐标用红色，估算/近似坐标用橙色。
// 直接引用静态目录路径，避免小图被 webpack 转成 base64（map 组件不支持 base64 图标）。
const getMarkerIcon = (plant: Plant) =>
  `/static/image/markers/dot-${plant.id}-${
    plant.type === 'exact' ? 'red' : 'orange'
  }.png`

const [updatedYear, updatedMonth, updatedDay] = PLANTS_UPDATED_AT.split('-')
const updatedAtText = `${updatedYear} 年 ${Number(updatedMonth)} 月 ${Number(
  updatedDay
)} 日`

// 统一取 GCJ-02（map 组件坐标系）：gcj02 直接用，wgs84 做纠偏转换
const toGcj = (plant: Plant) => {
  if (plant.sys === 'gcj02') {
    return { latitude: plant.latitude, longitude: plant.longitude }
  }
  const [longitude, latitude] = wgs2gcj(plant.longitude, plant.latitude)
  return { latitude, longitude }
}

function PlantMap() {
  const [cityKey, setCityKey] = useState<CityKey>(plantCities[0].key)
  const [current, setCurrent] = useState<SelectedPlant | null>(null)
  const city = useMemo<CityPlants>(
    () => plantCities.find(item => item.key === cityKey) || plantCities[0],
    [cityKey]
  )
  const [center, setCenter] = useState(city.center)
  const mapCtx = useRef<ReturnType<typeof Taro.createMapContext> | null>(null)

  const getMapCtx = () => {
    if (!mapCtx.current) {
      mapCtx.current = Taro.createMapContext(MAP_ID)
    }
    return mapCtx.current
  }

  useShareAppMessage(() => ({
    title: SHARE_TITLE,
    path: '/pages/map/index'
  }))

  const markers = useMemo<MapProps.marker[]>(
    () =>
      city.plants.map(plant => {
        const point = toGcj(plant)
        return {
          id: plant.id,
          ...point,
          title: plant.title,
          iconPath: getMarkerIcon(plant),
          width: 26,
          height: 26,
          anchor: { x: 0.5, y: 0.5 },
          callout: {
            content: `${plant.id}. ${plant.title}`,
            display: 'BYCLICK' as const,
            color: '#101828',
            fontSize: 12,
            borderRadius: 0,
            borderWidth: 1,
            borderColor: '#d0d5dd',
            bgColor: '#ffffff',
            padding: 8,
            textAlign: 'left' as const,
            anchorX: 0,
            anchorY: 0
          }
        }
      }),
    [city]
  )

  const selectPlant = useCallback((plant: Plant) => {
    const point = toGcj(plant)
    setCurrent({ plant, ...point })
    setCenter({ ...point, scale: 13 })
    getMapCtx()
      .moveToLocation(point)
      .catch(() => {})
  }, [])

  const switchCity = useCallback(
    (next: CityPlants) => {
      if (next.key === cityKey) {
        return
      }
      setCityKey(next.key)
      setCurrent(null)
      setCenter(next.center)
    },
    [cityKey]
  )

  const handleMarkerTap = useCallback(
    (e: { detail?: { markerId?: number | string } }) => {
      const id = Number(e.detail?.markerId)
      const plant = city.plants.find(item => item.id === id)
      if (plant) {
        selectPlant(plant)
      }
    },
    [city, selectPlant]
  )

  const resetView = useCallback(() => {
    setCurrent(null)
    setCenter(city.center)
    getMapCtx()
      .includePoints({
        points: markers.map(item => ({
          latitude: item.latitude,
          longitude: item.longitude
        })),
        padding: [36, 36, 36, 36]
      })
      .catch(() => {})
  }, [city, markers])

  const handleNavigate = useCallback(() => {
    if (!current) {
      return
    }
    Taro.openLocation({
      latitude: current.latitude,
      longitude: current.longitude,
      name: current.plant.title,
      address: current.plant.address,
      scale: 16
    })
  }, [current])

  const handleClose = useCallback(() => setCurrent(null), [])

  return (
    <View className='plant-map'>
      <Map
        id={MAP_ID}
        className='plant-map__map'
        latitude={center.latitude}
        longitude={center.longitude}
        scale={center.scale}
        markers={markers}
        showLocation={false}
        enableRotate={false}
        enableOverlooking={false}
        onMarkerTap={handleMarkerTap}
        onError={() => {}}
      />

      <View className='plant-map__panel'>
        <View className='plant-map__head'>
          <View>
            <Text className='tech-label'>FACILITY MAP</Text>
            <View className='plant-map__title'>{city.name}垃圾焚烧厂</View>
            <View className='plant-map__sub'>
              {city.plants.length} 座设施 · 点击定位查看
            </View>
          </View>
        </View>

        <View className='plant-map__toolbar'>
          <View className='plant-map__cities'>
            {plantCities.map(item => (
              <View
                key={item.key}
                className={
                  'plant-map__city' +
                  (item.key === cityKey ? ' is-active' : '')
                }
                onClick={() => switchCity(item)}
              >
                {item.name}
                <Text className='plant-map__city-count'>
                  {item.plants.length}
                </Text>
              </View>
            ))}
          </View>
          <View className='plant-map__reset' onClick={resetView}>
            全览
          </View>
        </View>

        <View className='plant-map__legend'>
          <View className='plant-map__legend-item'>
            <View className='plant-map__dot plant-map__dot--exact' />
            <Text>精确坐标</Text>
          </View>
          <View className='plant-map__legend-item'>
            <View className='plant-map__dot plant-map__dot--est' />
            <Text>估算 / 近似坐标</Text>
          </View>
          <Text className='plant-map__updated'>
            数据截至 {PLANTS_UPDATED_AT}
          </Text>
        </View>

        <ScrollView className='plant-map__list' scrollY>
          {city.plants.map(plant => (
            <View
              key={plant.id}
              className={
                'plant-item' +
                (current?.plant.id === plant.id ? ' is-active' : '')
              }
              onClick={() => selectPlant(plant)}
            >
              <View className='plant-item__id'>{plant.id}</View>
              <View className='plant-item__body'>
                <View className='plant-item__name'>{plant.title}</View>
                <View className='plant-item__addr'>{plant.address}</View>
              </View>
              <View
                className={
                  'plant-item__type plant-item__type--' + plant.type
                }
              >
                {coordTypeText[plant.type]}
              </View>
            </View>
          ))}
          <View className='plant-map__note'>
            点位依据公开资料整理，数据更新截至 {updatedAtText}
            ；标注为「估算 / 近似」的位置仅作示意，请以设施实际位置为准。
          </View>
        </ScrollView>
      </View>

      {current && (
        <View className='plant-card'>
          <View className='plant-card__close' onClick={handleClose}>
            ✕
          </View>
          <Text className='tech-label'>
            {city.name} · PLANT {current.plant.id}
          </Text>
          <View className='plant-card__name'>{current.plant.title}</View>
          <View className='plant-card__row'>
            <Text className='plant-card__key'>地址</Text>
            <Text className='plant-card__value'>{current.plant.address}</Text>
          </View>
          {current.plant.note && (
            <View className='plant-card__row'>
              <Text className='plant-card__key'>备注</Text>
              <Text className='plant-card__value'>{current.plant.note}</Text>
            </View>
          )}
          <View className='plant-card__row'>
            <Text className='plant-card__key'>坐标</Text>
            <Text className='plant-card__value'>
              {coordTypeText[current.plant.type]}
            </Text>
          </View>
          <View className='plant-card__btn' onClick={handleNavigate}>
            打开地图导航
          </View>
        </View>
      )}
    </View>
  )
}

export default PlantMap
