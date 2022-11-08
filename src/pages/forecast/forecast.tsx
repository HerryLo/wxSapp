import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { Bmap } from "../../utils/util";
import { dataInfoType, currentWeatherType } from "../../type/index";

import "./forecast.scss";

interface IProps {}
interface IState {
    dataInfo: dataInfoType | null;
}

// 百度地图实例
const newBmap: any = new Bmap();

class ForeCast extends Component<IProps, IState> {
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
        dataInfo: null
    };

    componentWillReceiveProps(nextProps) {
        console.log(this.props, nextProps);
    }

    componentDidMount() {
        this.weather();
    }

    async weather() {
        let res: dataInfoType = await newBmap.getWeather();
        console.log(res);
        let currentWeather: Array<currentWeatherType> = res.currentWeather;
        let arrDate: Array<string> = currentWeather[0].date.split(" ");
        // console.log(arrDate)
        arrDate[2] = arrDate[2].replace(/(\(实时\：)|\)/g, "");
        currentWeather[0].arrDate = arrDate;
        this.setState({
            dataInfo: res
        });
    }

    onShareAppMessage() {
        return {
            title: "天气预报"
        };
    }

    render() {
        let dataInfo: dataInfoType = this.state;
        return (
            <View className="forecast">
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
                        {dataInfo.currentWeather[0].weatherDesc}{" "}
                        {dataInfo.currentWeather[0].wind}
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
                    {dataInfo.originalData.results[0].weather_data.map(
                        (item, index) => {
                            return item.date !=
                                dataInfo.currentWeather[0].date ? (
                                <View className="list-item" key={index}>
                                    <Text>{item.date}</Text>
                                    <Image src={item.dayPictureUrl} />{" "}
                                    <Text>{item.temperature}</Text>
                                </View>
                            ) : (
                                ""
                            );
                        }
                    )}
                </View>
                {/* 指数卡片 */}
                {dataInfo.originalData.results[0].index.length > 0 ? (
                    <ScrollView className="scrollView" scrollX={true}>
                        <View className="card">
                            {dataInfo.originalData.results[0].index.map(
                                (item, index) => {
                                    return (
                                        <View
                                            className="card-item"
                                            key={index}
                                            vertical={true}
                                        >
                                            <View className="title">
                                                {item.tipt}:
                                            </View>
                                            <View className="desc">
                                                {item.des}
                                            </View>
                                        </View>
                                    );
                                }
                            )}
                        </View>
                    </ScrollView>
                ) : (
                    ""
                )}
                <Button className="button" openType="share">
                    分享
                </Button>
            </View>
        );
    }
}

export default ForeCast as ComponentClass;
