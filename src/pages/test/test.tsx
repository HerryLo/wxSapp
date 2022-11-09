import { ComponentClass, ReactNode } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { randomArray } from "../../utils/util";

import "./test.scss";

interface Props {}

interface State {
  Names: Array<string>;
  IconClass: Array<string>;
  arrResult: Array<ResultProp>;
  currentIndex: number;
  index: number;
  resultIndexList: Array<number>;
  grade: number;
}

interface ResultProp {
  a: string;
  c: string; // 类型
  i: string; // 拼音缩写
  n: string; // name
}

const RandomNumber = 10;

let clickState = true;

class Test extends Component<Props, State> {
  config: Config = {
    navigationBarTitleText: "小测试",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#2c7cf7"
  };

  constructor(props) {
    super(props);
  }

  public readonly state: Readonly<State> = {
    Names: ["湿垃圾", "干垃圾", "可回收物", "有害垃圾"],
    IconClass: ["ico-1", "ico-2", "ico-3", "ico-4"],
    arrResult: [],
    currentIndex: 0,
    index: -1,
    resultIndexList: [],
    grade: 0
  };

  componentDidMount() {
    this.init();
  }

  init() {
    this.dataInit();
  }

  dataInit() {
    let { result } = require("../../static/result");
    console.log(result);
    let { data } = result;
    let arrResult: Array<ResultProp> = [];
    let list: Array<number> = [1, 2, 3, 4];
    // 得到类型数组的对应下标
    let arr: Array<number> = randomArray<number>(list, RandomNumber);
    console.log(arr);
    console.log(data);
    for (let i = 0; i < arr.length; i++) {
      // 随机垃圾数据
      arrResult = arrResult.concat(randomArray<ResultProp>(data[arr[i]], 1));
    }
    this.setState({
      arrResult,
      index: -1,
      grade: 0,
      currentIndex: 0,
      resultIndexList: []
    });
    console.log(arrResult);
  }

  clickCard(e) {
    let { resultIndexList } = this.state;
    if (!clickState) return false;
    clickState = false;
    let { dataset } = e.currentTarget;
    let { currentindex, index } = dataset;
    index = Number(index);
    // 当前卡片下标加1
    currentindex = Number(currentindex) + 1;

    // 当前点击的下标
    this.setState(
      {
        index: index
      },
      () => {
        setTimeout(() => {
          resultIndexList.push(index);
          this.setState(
            {
              index: -1,
              resultIndexList,
              currentIndex: currentindex
            },
            () => {
              setTimeout(() => {
                clickState = true;
              }, 200);
              if (currentindex == 10) {
                this.countGrade();
              }
            }
          );
        }, 300);
      }
    );
  }

  countGrade() {
    let grade = 0;
    let { resultIndexList, arrResult } = this.state;
    resultIndexList.forEach((item, index) => {
      if (item + 1 === Number(arrResult[index].c)) {
        grade += 10;
      }
    });
    this.setState({
      grade
    });
  }

  routerGo(e) {
    let { dataset } = e.currentTarget;
    let { link } = dataset;
    Taro.reLaunch({
      url: link
    });
  }

  /**
   * 分享函数
   */
  onShareAppMessage() {
    return {
      title: "垃圾分类统一考试"
    };
  }

  render(): ReactNode {
    let indexCard = this.state.index;
    let {
      IconClass,
      Names,
      arrResult,
      currentIndex,
      resultIndexList,
      grade
    } = this.state;
    let ci = currentIndex < 9 ? "0" + (currentIndex + 1) : currentIndex + 1;
    return (
      <View className="container">
        <View
          className="icon_Swiper"
          style="transform: translateX(-{{currentIndex*100}}vw);transition: .3s;"
        >
          {arrResult.map((item, ids) => {
            return (
              <View key={ids} className="icon_list">
                <View className="number">
                  <Text>{ci}</Text> / 10
                </View>
                <View className="title">{item.n}</View>
                {IconClass.map((item, ins) => {
                  return (
                    <View
                      key={ins}
                      data-index={ins}
                      data-currentindex={ids}
                      onClick={this.clickCard}
                      className={
                        (indexCard == ins ? "active" : "") + " card_Info"
                      }
                    >
                      <View className={item + " inconImage"}></View>
                      <View className="name">{Names[ins]}</View>
                    </View>
                  );
                })}
              </View>
            );
          })}
          <View className="resultList">
            <View className="resultList-title">成绩单</View>
            {arrResult.map((item, index) => {
              let seletype = resultIndexList[index];
              return (
                <View className="result-item" key={item.i}>
                  <View className="name">{item.n}</View>
                  <View className="typeResult">
                    <View className="type">{Names[item.c - 1]}</View>
                    <View className="result">
                      {Names[seletype] == Names[item.c - 1] ? (
                        "✔"
                      ) : (
                        <Text>{Names[seletype]}</Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
            <View className="grade">分数：{grade}</View>
            <View className="btnList">
              <View className="btn1" onClick={this.dataInit}>
                再试一次
              </View>
              <Button className="btn2" openType="share">
                考考别人
              </Button>
            </View>
            <View
              className="foot"
              onClick={this.routerGo}
              data-link="/pages/index/index"
            >
              更多垃圾分类
            </View>
          </View>
        </View>
        <Button className="button" openType="share">
          分享
        </Button>
      </View>
    );
  }
}

export default Test as ComponentClass;
