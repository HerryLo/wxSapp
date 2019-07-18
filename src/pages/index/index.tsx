import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Icon, Input, Image, Button} from '@tarojs/components'
import { SeachType, SeachKey } from '../../api/index'

import './index.scss'

class Index extends Component {
  config: Config = {
    navigationBarTitleText: '垃圾分类助手',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#2c7cf7'
  }

  constructor (props) {
    super(props)
    this.state = {
      search: '',
      selectedSort: null,
      keywords: [],
      imgList: [
        'ico-3',
        'ico-4',
        'ico-2',
        'ico-1'
      ]
    }
  }

  /**
   * 清理input和列表 内容
   */
  clear() {
    this.setState({
      keywords: [],
      search: ""
    })
  }

  /**
   * 查询input输入框内容
   * @param e
   */
  seach(e) {
    let str = e.detail.value
    // console.log(str)
    if(!str) {
      this.clear()
      return
    }
    this.setState({
      search: str
    },async ()=> {
      let res = await SeachKey({keyword: str})
      if(res) {
        this.setState({
          keywords: res.data.kw_list
        })
      }
    })
  }

  /**
   * 搜索选择的内容
   * @param e
   */
  async searchSort(e) {
    let keyword = e.currentTarget.dataset.keyword
    let res = await SeachType({keyword});
    if(res) {
      let type = res.data.query_result_type_1.trashType
        this.setState({
          selectedSort: this.getSort(this.handleSorch(type))
        })
    }
  }

  /**
   * 排列匹配
   * @param i
   */
  getSort(i) {
    let iconClass = '';
    let names = ["湿垃圾", "干垃圾", "可回收物", "有害垃圾", "建筑垃圾", "大件垃圾", "不属于生活垃圾"]
    let colors = ["#48D1CC", "#8B4513", "#7CFC00", "#FF0000", "#8B4513", "#b85349", "#b85349"]
    let des = [
      "日常生活垃圾产生的容易腐烂的生物质废弃物",
      "除有害垃圾、可回收物、湿垃圾以外的其他生活废弃物",
      "适宜回收利用和资源化利用的，如：玻、金、塑、纸、衣",
      "对人体健康或者自然环境造成直接或潜在危害的废弃物",
      "建筑装修产生的垃圾, 不能直接丢入垃圾桶，需要投入专门的建筑垃圾桶或联系物业处理",
      "体积较大、整体性强，需要拆分再处理的废弃物品",
      "不属于生活垃圾"
    ]
    let inc = [
      "食材废料，剩菜剩饭、瓜皮果核、花卉绿植、过期食品等易腐生活废弃物",
      "餐盒、餐巾纸、湿纸巾、卫生间用纸、塑料袋、食品包装袋、污染严重的纸、烟蒂、纸尿裤、一次性杯子、大骨头、贝壳、花盆、陶瓷等",
      "酱油瓶、玻璃杯、平板玻璃、易拉罐、饮料瓶、洗发水瓶、塑料玩具、书本、报纸、广告单、纸板箱、衣服、床上用品等",
      "废电池、油漆桶、荧光灯管、废药品及其包装物等",
      "水泥、砖块、瓷砖等",
      "床、床板、床头柜、桌子、椅子、沙发等",
      ""
    ]
    let req = [
      "产生时与其他垃圾分开收集，尽量沥干水分，有包装物的湿垃圾应将包装物去除后分类投放，包装物请投放到对应的可回收物或干垃圾容器",
      "放入干垃圾收集器，并保持周边环境整洁",
      "轻投轻放、清洁干燥，避免污染。废纸尽量平整。立体包装物请清空内容物，清洁后压扁投放。有尖锐边角的，应包裹后投放",
      "投放时请注意轻放。易破损的请连带包装或包裹后轻放，如易挥发，请密封后投放",
      "不能直接丢入垃圾桶，需要投入专门的建筑垃圾桶或联系物业处理!",
      "不能直接丢入垃圾桶，联系物业处理或者预约回收垃圾经营者上门回收",
      ""
    ]

    switch(i){
      case 0:
        iconClass="ico-3";
        break;
      case 1:
        iconClass="ico-4";
        break;
      case 2:
        iconClass="ico-2";
        break;
      case 3:
        iconClass="ico-1";
        break;
    }

    let model = {
      "name": names[i],
      "color": colors[i],
      "iconClass": iconClass,
      "des": des[i],
      "inc": inc[i],
      "req": req[i]
    }
    return model
  }

  handleSorch(i) {
    switch (i) {
      case 1:
        i = 3
        break
      case 2:
        i = 2
        break
      case 3:
        i = 0
        break
      case 4:
        i = 1
        break
      case -3:
        i = 4
        break
      case -2:
        i = 5
        break
      case -1:
        i = 6
        break
    }
    return i
  }

  dismiss() {
    this.setState({
      selectedSort: null
    })
  }

  /**
   * 跳转
   */
  RouteGo(e) {
    let { dataset } = e.currentTarget;
    let { link, index } = dataset
    let url = `${link}?index=${index}`
    Taro.navigateTo({
      url
    })
  }

  /**
   * 分享函数
   */
  onShareAppMessage() {
    return {
      title: '垃圾分类助手'
    }
  }

  render() {
    let { search, imgList, keywords, selectedSort} = this.state
    return (
      <View className='index-container'>
        <View className='searchFiled'>
          <Icon
            type="search"
            color='rgb(156, 156, 156)' />
          {/* input输入框 */}
          <Input
            className='input'
            placeholder="输入垃圾名称"
            confirmType="search"
            onInput={this.seach}
            value={search} />
          <View
            onClick={this.clear}
            className="icon">
            <Icon
              // onClick={this.clear}
              type="cancel"
              color='rgb(156, 156, 156)'
              />
          </View>
        </View>
        {
          // 搜索列表
          keywords.length != 0 && keywords.map((item, index)=> {
            return <View className='searchList' key={index}><View
              className="searchCell"
              onClick={this.searchSort}
              data-keyword={item}>{item}</View>
            <View className='line'></View></View>
          })
        }
        {
          // img展示
          keywords.length == 0 &&<View className="img-container">
              {
                imgList.map((item, index)=> {
                return <View
                  key={index}
                  onClick={this.RouteGo}
                  data-link="/pages/detail/detail"
                  data-index={index}
                  className='inconImage {{item}}' >
                  </View>
                })
              }
          </View>
        }
        {
          // 详情弹层
          selectedSort != null && <View className='resultback' onClick={this.dismiss}>
          <View className='resultView'>
            <View className='resultHead'>
              {selectedSort.name}
            </View>
            <View className='desView'>
              <View className='bigIcon {{selectedSort.iconClass}}'style='background-color:{{selectedSort.color}}'></View>
              {selectedSort.des}
            </View>
            {
              selectedSort.inc && <View className='title'>
                {selectedSort.name}主要包括
              </View>
            }
            <View className='des'>
              {selectedSort.inc}
            </View>
            {
              selectedSort.req && <View className='title'>
                {selectedSort.name}投放要求
              </View>
            }
            <View className='des'>
              {selectedSort.req}
            </View>
          </View>
        </View>
        }
        {
          keywords.length == 0 && <View className="desc">工具说明: 上海垃圾分类查询小工具，2019年7月1日,《上海市生活垃圾管理条例》正式实施，生活垃圾按照<Text>"可回收物"、"有害垃圾"、"湿垃圾"、"干垃圾"</Text>的分类标准。</View>
        }
        <Button
          className="button"
          openType="share">
            分享
        </Button>
      </View>
    )
  }
}

export default Index as ComponentClass
