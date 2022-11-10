import { WeatherUrl, QweatherKey, GeoUrl } from "../constants/config";
import Taro from "@tarojs/taro";

interface WeatherOption {
  location: string;
}

/**
 * 实时天气
 * @param options
 */
export const RealTimeWeather = async (options: WeatherOption) => {
  let location: string = options.location;
  let url: string = `${WeatherUrl}/v7/weather/now?key=${QweatherKey}&location=${location}`;
  let res = await Taro.request({ url });
  return res;
};

/**
 * 7天预报
 * @param options
 */
 export const WeatherV7d = async (options: WeatherOption) => {
  let location: string = options.location;
  let url: string = `${WeatherUrl}/v7/weather/7d?key=${QweatherKey}&location=${location}`;
  let res = await Taro.request({ url });
  return res;
};

/**
 * 城市搜索
 * @param options
 */
 export const SearchCity = async (options: any) => {
    let location: string = options.location;
    let url: string = `${GeoUrl}/v2/city/lookup?key=${QweatherKey}&location=${location}`;
    let res = await Taro.request({ url });
    return res;
  };
