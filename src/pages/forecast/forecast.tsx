import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Bmap } from '../../utils/util'

import './forecast.scss'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageOwnProps = {}

type PageState = {}

type IProps = PageOwnProps

interface ForeCast {
  props: IProps;
}

// 百度地图实例
const newBmap = new Bmap();

class ForeCast extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#2c7cf7'
  }

  constructor (props) {
    super(props)
    this.state = {
      dataInfo: null
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    this.weather();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  async weather() {
    let res = await newBmap.getWeather();
    let { currentWeather } = res;
    let arrDate = currentWeather[0].date.split(' ')
    // console.log(arrDate)
    arrDate[2] = arrDate[2].replace(/(\(实时\：)|\)/g, '')
    currentWeather[0].arrDate = arrDate
    this.setState({
      dataInfo: res
    })
  };

  render () {
    return (
      <View className='forecast'>
        {/* 头部内容 */}
        <View className="top">
          <View style="height: 80rpx;"></View>
          <View className="currentWind">
            {dataInfo.currentWeather[0].arrDate[2]}
          </View>
          <View className="weatherDesc padding">
            {dataInfo.currentWeather[0].weatherDesc}
          </View>
          <View className="temperature padding">
            {dataInfo.currentWeather[0].temperature}
          </View>
          <View className="windDesc padding">
            {dataInfo.currentWeather[0].weatherDesc} {dataInfo.currentWeather[0].wind}
          </View>
          <View className="time">
            <View>
              {dataInfo.currentWeather[0].arrDate[0]}
              {dataInfo.currentWeather[0].arrDate[1]}
            </View>
            <View>
              {/* <Image src="../../static/image/position-icon.png" /> */}
              {dataInfo.currentWeather[0].currentCity}
            </View>
          </View>
        </View>
        {/* 内容列表 */}
        <View className="list">
          {
            dataInfo.originalData.results[0].weather_data.map((item, index)=> {
              return item.date != dataInfo.currentWeather[0].date ? <View className="list-item" key={index}>
                <Text>{item.date}</Text><Image src={item.dayPictureUrl} /> <Text>{item.temperature}</Text>
              </View> : ''
            })
          }
        </View>
        {/* 指数卡片 */}
        {
          dataInfo.originalData.results[0].index.length > 0 ?
          <ScrollView className="scrollView" scrollX={true}>
            <View className="card">
              {
                dataInfo.originalData.results[0].index.map((item, index)=> {
                  return <View className="card-item" key={index} vertical={true}>
                      <View className="title">{item.tipt}:</View>
                      <View className="desc">{item.des}</View>
                    </View>
                })
              }
            </View>
          </ScrollView> :
          ''
        }
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default ForeCast as ComponentClass<PageOwnProps, PageState>
