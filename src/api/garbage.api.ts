import Taro from '@tarojs/taro'
import { GarbageUrl } from '../constants/config'
import { GarbageItem, GarbageResponse } from '../type/index'

/**
 * 查询垃圾分类
 * @param name 垃圾名称
 */
export const SearchGarbage = async (name: string): Promise<Array<GarbageItem>> => {
  const res = await Taro.request<GarbageResponse>({
    url: GarbageUrl,
    data: { name }
  })
  if (res.data.code !== 200) {
    throw new Error(res.data.msg || '查询失败')
  }
  return res.data.data || []
}
