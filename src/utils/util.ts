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

  getWeather() {
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
