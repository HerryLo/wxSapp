import bmap from '../libs/bmap-wx';
import { BMAPAK } from '../constants/config'

/**
 * 百度地图对象类
 */
export class Bmap {
  constructor() {
    this.BMap =  new bmap.BMapWX({
      ak: BMAPAK
    });
  }

  getWeather():Promise<Object> {
    return new Promise((resolve, reject)=> {
      this.BMap.weather({
        success(data) {
          resolve(data);
        },
        fail(data) {
          reject(data);
        }
      });
    })
  }
}

/**
 * 随机获取数组 下标
 * @param len 数组长度
 * 0 ~ l-1
 */
export function getRandomIndex ( len : number): number {
  let l: number = len;
  return Math.floor(Math.random() * l);
}

/**
 *
 * @param arr 数组
 * @param n 需要循环的长度
 */
export function randomArray<T>(arr: T[], n: number): T[] {
  let list: T[] = []
  let len = arr.length
  let i: number = 0
  while(i < n) {
    i++;
    let r: number = getRandomIndex(len)
    list.push(arr[r])
  }
  return list
}
