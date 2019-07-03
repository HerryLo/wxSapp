import {
  ComponentClass
} from 'react'
import Taro, {
  Component,
  Config
} from '@tarojs/taro'
import {
  View,
  Text,
  Button
} from '@tarojs/components'

class Detail extends Component {

  config: Config = {
    navigationBarTitleText: '',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#2c7cf7'
  }

  constructor(props) {
    super(props)
    this.state = {
      names : ["湿垃圾", "干垃圾", "可回收垃圾", "有害垃圾"],
      colors : ["ico-3.jpg", "ico-4.jpg", "ico-2.jpg", "ico-1.jpg0"],
      des : [
        "日常生活垃圾产生的容易腐烂的生物质废弃物",
        "除有害垃圾、可回收物、 湿垃圾以外的其他生活废弃物",
        "适宜回收利用和资源化利 用的，如：玻、金、塑、 纸、衣",
        "对人体健康或者自然环境造成直接或潜在危害的废弃物",
        "建筑装修产生的垃圾, 不能直接丢入垃圾桶，需要投入专门的建筑垃圾桶或联系物业处理",
        "体积较大、整体性强，需要拆分再处理的废弃物品"
      ],
      inc: [
        "食材废料，剩菜剩饭、瓜皮果核、花卉绿植、过期食品等易腐生活废弃物",
        "餐盒、餐巾纸、湿纸巾、卫生间用纸、塑料袋、 食品包装袋、污染严重的纸、烟蒂、纸尿裤、 一次性杯子、大骨头、贝壳、花盆、陶瓷等",
        "酱油瓶、玻璃杯、平板玻璃、易拉罐、饮料瓶、 洗发水瓶、塑料玩具、书本、报纸、广告单、纸板箱、衣服、床上用品等",
        "废电池、油漆桶、荧光灯管、废药品及其包装物等"
      ],
      req: [
        "产生时与其他垃圾分开收集，尽量沥干水分，有包装物的湿垃圾应将包装物去除后分类投放，包装物请投放到对应的可回收物或干垃圾容器",
        "放入干垃圾收集器，并保持周边环境整洁",
        "轻投轻放、清洁干燥，避免污染。废纸尽量平整。立体包装物请清空内容物，清洁后压扁投放。有尖锐边角的，应包裹后投放",
        "投放时请注意轻放。易破损的请连带包装或包裹后轻放，如易挥发，请密封后投放"
      ]
    }
  }

  render() {
    return (
      <View >

      </View>
    )
  }
}

export default Detail
