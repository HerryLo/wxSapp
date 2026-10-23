import Taro from '@tarojs/taro'

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = Taro.getStorageSync(key)
    return value === '' || value === undefined || value === null ? fallback : (value as T)
  } catch (err) {
    console.error('读取缓存失败', key, err)
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    Taro.setStorageSync(key, value)
  } catch (err) {
    console.error('写入缓存失败', key, err)
  }
}
