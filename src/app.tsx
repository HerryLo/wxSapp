import Taro, { Component, Config } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";

import Index from "./pages/index";

import configStore from "./store";

import "./app.scss";
import { ComponentClass } from "react";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component<ComponentClass> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        pages: [
            "pages/index/index",
            "pages/forecast/forecast",
            "pages/detail/detail",
            "pages/test/test"
        ],
        window: {
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#fff",
            navigationBarTitleText: "WeChat",
            navigationBarTextStyle: "black"
        },
        tabBar:
            process.env.TARO_ENV === "alipay"
                ? {
                      color: "#eee",
                      selectedColor: "#49a9ee",
                      backgroundColor: "#ffffff",
                      list: [
                          {
                              text: "分类",
                              iconPath:
                                  "./static/image/outline_home_black_18.png",
                              selectedIconPath:
                                  "./static/image/round_home_black_18.png",
                              pagePath: "pages/index/index"
                          },
                          {
                              text: "测验",
                              iconPath:
                                  "./static/image/outline_visibility_black_18.png",
                              selectedIconPath:
                                  "./static/image/round_visibility_black_18.png",
                              pagePath: "pages/test/test"
                          }
                      ]
                  }
                : {
                      color: "#eee",
                      selectedColor: "#49a9ee",
                      backgroundColor: "#ffffff",
                      list: [
                          {
                              text: "分类",
                              iconPath:
                                  "./static/image/outline_home_black_18.png",
                              selectedIconPath:
                                  "./static/image/round_home_black_18.png",
                              pagePath: "pages/index/index"
                          },
                          {
                              text: "测试",
                              iconPath:
                                  "./static/image/outline_visibility_black_18.png",
                              selectedIconPath:
                                  "./static/image/round_visibility_black_18.png",
                              pagePath: "pages/test/test"
                          },
                          {
                              text: "预报",
                              iconPath:
                                  "./static/image/outline_cloud_black_18.png",
                              selectedIconPath:
                                  "./static/image/round_cloud_black_18.png",
                              pagePath: "pages/forecast/forecast"
                          }
                      ]
                  },
        permission: {
            "scope.userLocation": {
                desc: "允许智吱声访问您当前的地理位置信息？"
            }
        },
        requiredPrivateInfos: ["getLocation"]
    };

    componentDidMount() {}

    componentDidShow() {}

    componentDidHide() {}

    componentDidCatchError() {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return (
            <Provider store={store}>
                <Index />
            </Provider>
        );
    }
}

Taro.render(<App />, document.getElementById("app"));
