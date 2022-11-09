import { RequestUrl, WeatherUrl, QweatherKey } from '../constants/config'
import Taro from '@tarojs/taro'

interface SeachListOption {
  keyword: string
}

/**
 * 查询垃圾类型
 * @param options
 */
export const SeachType = async (options:SeachListOption) => {
  let keyword:string = options.keyword;
  let url:string = `${RequestUrl}?a=EXC_QUERY&kw=${encodeURIComponent(keyword)}`
  let res = await Taro.request({url});
  return res
}

/**
 * 查询垃圾列表
 * @param options
 */
export const SeachKey = async (options:SeachListOption) => {
  let keyword:string = options.keyword;
  let url:string = `${RequestUrl}?a=GET_KEYWORDS&kw=${encodeURIComponent(keyword)}`
  let res = await Taro.request({url});
  return res
}


