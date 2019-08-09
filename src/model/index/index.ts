import { SelectedSort } from '../../type/index'

class IndexModel {
  /**
   * 排列匹配
   * @param i
   */
  getSort(i: number): SelectedSort {
    let iconClass: string = '';
    let names: Array<string> = ["湿垃圾", "干垃圾", "可回收物", "有害垃圾", "建筑垃圾", "大件垃圾", "不属于生活垃圾"]
    let colors: Array<string> = ["#48D1CC", "#8B4513", "#7CFC00", "#FF0000", "#8B4513", "#b85349", "#b85349"]
    let des: Array<string> = [
      "日常生活垃圾产生的容易腐烂的生物质废弃物",
      "除有害垃圾、可回收物、湿垃圾以外的其他生活废弃物",
      "适宜回收利用和资源化利用的，如：玻、金、塑、纸、衣",
      "对人体健康或者自然环境造成直接或潜在危害的废弃物",
      "建筑装修产生的垃圾, 不能直接丢入垃圾桶，需要投入专门的建筑垃圾桶或联系物业处理",
      "体积较大、整体性强，需要拆分再处理的废弃物品",
      "不属于生活垃圾"
    ]
    let inc: Array<string> = [
      "食材废料，剩菜剩饭、瓜皮果核、花卉绿植、过期食品等易腐生活废弃物",
      "餐盒、餐巾纸、湿纸巾、卫生间用纸、塑料袋、食品包装袋、污染严重的纸、烟蒂、纸尿裤、一次性杯子、大骨头、贝壳、花盆、陶瓷等",
      "酱油瓶、玻璃杯、平板玻璃、易拉罐、饮料瓶、洗发水瓶、塑料玩具、书本、报纸、广告单、纸板箱、衣服、床上用品等",
      "废电池、油漆桶、荧光灯管、废药品及其包装物等",
      "水泥、砖块、瓷砖等",
      "床、床板、床头柜、桌子、椅子、沙发等",
      ""
    ]
    let req: Array<string> = [
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

    let model:SelectedSort = {
      "name": names[i],
      "color": colors[i],
      "iconClass": iconClass,
      "des": des[i],
      "inc": inc[i],
      "req": req[i]
    }
    return model
  }

  /**
   * 转换
   * @param i
   */
  handleSorch(i): number {
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

  /**
   * 转换
   * @param i
   */
  handleCssName(CssName: string): number {
      let i;
    switch (CssName) {
      case 'shi':
        i = 0
        break
      case 'gan':
        i = 1
        break
      case 'kehuishou':
        i = 2
        break
      case 'youhai':
        i = 3
        break
    }
    return i
  }

}

export default new IndexModel()
