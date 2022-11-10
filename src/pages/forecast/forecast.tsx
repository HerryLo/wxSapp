import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { RealTimeWeather, SearchCity, WeatherV7d } from "../../api/index";
import { handleTime } from '../../utils/util';

import "./forecast.scss";

interface IProps { }
interface IState {
  dataInfo: any;
  areaInfo: any;
  data7dInfo: any
}

class ForeCast extends Component<IProps, IState> {
  [x: string]: any;
  /**
   * 指定config的类型声明为: Taro.Config
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "天气预报",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#2c7cf7"
  };

  constructor(props) {
    super(props);
  }

  readonly state: Readonly<IState> = {
    dataInfo: null,
    areaInfo: null,
    data7dInfo: null
  };

  componentDidMount() {
    this.weather();
  }

  async weather() {
    Taro.getLocation({
      success: async res => {
        console.log(res);
        const { latitude, longitude } = res;
        const areaRes = await SearchCity({
          location: `${longitude},${latitude}`
        });
        console.log(areaRes);
        let weatherRes = await RealTimeWeather({
          location: `${longitude},${latitude}`
        });
        console.log(weatherRes);
        let weather7dRes = await WeatherV7d({
          location: `${longitude},${latitude}`
        });
        console.log(weather7dRes);
        this.setState({
          dataInfo: weatherRes.data.now,
          areaInfo: areaRes.data.location,
          data7dInfo: weather7dRes.data
        });
      }
    });
  }

  onShareAppMessage() {
    return {
      title: "天气预报"
    };
  }

  render() {
    let { dataInfo, areaInfo, data7dInfo } = this.state;
    return (
      <View className="forecast">
        {/* 头部内容 */}
        <View className="top">
          <View style="height: 80rpx;"></View>
          <View className="currentWind">
            {dataInfo.text || '--'} {dataInfo.temp || '--'}℃
          </View>
          <View className="weatherDesc padding">
            体感温度 {dataInfo.feelsLike || '--'}℃
          </View>
          <View className="temperature padding">风向 {dataInfo.windDir || '--'}</View>
          <View className="temperature padding">风速 {dataInfo.windSpeed || '--'}公里/小时</View>
          <View className="time">
            <View>
              {handleTime(dataInfo.obsTime)}
            </View>
            <View>
              {areaInfo[0].adm2} {areaInfo[0].name}
            </View>
          </View>
        </View>
        {/* 内容列表 */}
        <View className="list">
          <View className="list-item">
            <Text>相对湿度 {dataInfo.humidity || '--'}%</Text>
          </View>
          <View className="list-item">
            <Text>能见度 {dataInfo.vis || '--'}公里</Text>
          </View>
        </View>
        {/* 7天天气 */}
        {data7dInfo.daily.length > 0 && (
          <ScrollView className="scrollView" scrollX={true}>
            <View className="card">
              {data7dInfo.daily.map((item, index) => {
                return (
                  <View className="card-item" key={index} vertical={true}>
                    <View className="title">{item.fxDate}</View>
                    <View className="desc">温度：{item.tempMin}℃~{item.tempMax}℃</View>
                    <View className="desc">白天： {item.textDay}</View>
                    <View className="desc">夜间： {item.textNight}</View>
                    <View className="desc">日出： {item.sunrise}</View>
                    <View className="desc">日落： {item.sunset}</View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
        {data7dInfo.updateTime && <View className="updateTime7d">7天天气更新：{handleTime(data7dInfo.updateTime)}</View>}
        <Button className="button" openType="share">
          分享
        </Button>
      </View>
    );
  }
}

export default ForeCast as ComponentClass;
