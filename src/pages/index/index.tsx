import { ComponentClass, ReactNode } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Icon, Input, Button} from '@tarojs/components'
import { SeachType, SeachKey } from '../../api/index'
import IndexModel from '../../model/index/index'
import { SelectedSort } from '../../type/index'

import './index.scss'

interface Props {}
interface State {
    search: string,
    keywords: Array<string>,
    imgList: Array<string>,
    selectedSort: SelectedSort,
}

class Index extends Component <Props,State>   {
  config: Config = {
    navigationBarTitleText: '垃圾分类助手',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#2c7cf7'
  }

  constructor (props) {
    super(props)
  }

  readonly state: Readonly<State> = {
    search: '',
    keywords: [],
    selectedSort: {
        des: '',
        req: '',
        inc: '',
        name: '',
        color: '',
        iconClass: ''
    },
    imgList: [
        'ico-3',
        'ico-4',
        'ico-2',
        'ico-1'
    ]
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
          selectedSort: IndexModel.getSort(IndexModel.handleSorch(type))
        })
    }
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

  render(): ReactNode {
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
