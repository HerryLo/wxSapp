## 垃圾分类小程序
![taro](https://img.shields.io/badge/-taro%40v1.3.10-orange)
![typescript](https://img.shields.io/badge/-typescript-brightgreen)
![scss](https://img.shields.io/badge/-scss-brightgreen)
![yarn](https://img.shields.io/badge/-yarn%401.12.3-brightgreen)

> 我们的工具，目前的功能有垃圾分类查询功能、垃圾分类小测验、天气预报，后续会开启更多功能。

查询API是调取的别人的，目前支持微信小程序和支付宝小程序。

### Tips
* Taro-cli
* TypeScript
* Node.js
* Yarn

### 项目

#### ts+react语法
```JavaScript
// page/index.tsx
import { ComponentClass, TouchEvent } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Icon, Input, Button } from '@tarojs/components'

import './index.scss'

interface Props {}
interface State {
    search: string,
    keywords: Array<string>,
    imgList: Array<string>,
    selectedSort: SelectedSort | null,
}

class Index extends Component <Props,State>   {
  config: Config = {
    navigationBarTitleText: '垃圾分类助手',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#2c7cf7'
  }

  constructor (props) {
    super(props)
    ......
```

#### scss语法

```scss
.index-container {
    padding: 50rpx 50rpx;
    background: #fff;

    & .img-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-around;
        margin-top: 40rpx;
    }

    & .inconImage {
        width: 220rpx;
        height: 220rpx;
        margin: 20rpx 40rpx 20rpx 40rpx;
    }
    ......
```

### 微信小程序

<img width="300" height="300" center src="https://raw.githubusercontent.com/HerryLo/wxSapp/master/img/gh_75d5a8e03369_258.jpg" />


### 支付宝小程序

<img width="300" height="350" center src="https://raw.githubusercontent.com/HerryLo/wxSapp/master/img/s6x01351xerl2wqeqhpfn56_55388962.jpg" />
