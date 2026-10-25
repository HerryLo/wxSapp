import type { KnowledgeArticle } from '../types'

export const oldClothes: KnowledgeArticle = {
  id: 'old-clothes',
  title: '旧衣回收后去了哪',
  summary: '旧衣不是垃圾。复用、再生、能源化，是三条不同的去向。',
  takeaway: '先捐赠和重复使用，再考虑回收再生。',
  topic: 'action',
  emoji: '👕',
  readMinutes: 3,
  relatedIds: ['three-r', 'chemical-recycling'],
  blocks: [
    { type: 'heading', text: '旧衣不是垃圾' },
    {
      type: 'paragraph',
      text: '衣柜里不穿的衣服，并不意味着它已经成了垃圾。很多旧衣还能继续被穿、被用，或者被拆解成新的材料。'
    },
    {
      type: 'paragraph',
      text: '把旧衣当成资源而不是废弃物，是处理它的第一步。判断一件旧衣的去向，主要看它的新旧程度、材质和是否完好。'
    },
    {
      type: 'paragraph',
      text: '每年被丢弃的纺织品数量庞大，其中很大一部分本可以重新利用，而不是直接进入焚烧或填埋。'
    },
    { type: 'heading', text: '回收后的几条路径' },
    {
      type: 'paragraph',
      text: '旧衣回收后通常先分拣。还能穿的会被整理后进入二手流通，流向国内外的二手市场，继续被穿用。'
    },
    {
      type: 'paragraph',
      text: '不适合再穿的，会按材质决定去向：纯棉等纤维可以做成工业擦拭布，也可以通过机械拆解做成再生纤维；部分材料还能通过化学方法解聚成新原料。'
    },
    {
      type: 'paragraph',
      text: '真正无法利用的部分，才会被送去能源化或填埋。二手复用、再生纤维和擦拭布，是旧衣最主要的三条再利用路径。'
    },
    { type: 'heading', text: '再生纤维的难点' },
    {
      type: 'paragraph',
      text: '再生最大的难点在混纺。涤棉混纺等面料把不同纤维交织在一起，成分复杂，分离起来费时费力，成本和能耗都不低。'
    },
    {
      type: 'paragraph',
      text: '纯棉、纯涤纶等单一材质的纤维相对容易再生，而混纺衣物往往只能降级利用，甚至难以回收。'
    },
    {
      type: 'paragraph',
      text: '另一个容易被忽略的问题是，合成纤维衣物在每次洗涤时都会脱落微塑料纤维，随洗衣废水排入环境。'
    },
    { type: 'heading', text: '怎么处理旧衣' },
    {
      type: 'paragraph',
      text: '处理旧衣，优先考虑让衣服继续被穿。还能穿的可以捐赠、转卖或送给有需要的人，这是环境收益更高的方式。'
    },
    {
      type: 'paragraph',
      text: '不适合继续穿的，可以投放到专门的旧衣回收箱或回收渠道，进入再生体系。投放前清洗干净、打包好，能提高后续的复用率。'
    },
    {
      type: 'paragraph',
      text: '先捐赠和重复使用，再考虑回收再生，是处理旧衣的合理顺序。'
    },
    {
      type: 'stats',
      items: [
        { label: '旧衣再利用路径', value: '二手复用 / 再生纤维 / 擦拭布' },
        { label: '再生难点', value: '混纺纤维分离' }
      ]
    },
    {
      type: 'list',
      items: [
        '先分拣：能穿的进二手流通',
        '不适合穿的：做擦拭布或再生纤维',
        '混纺：分离难、成本高'
      ]
    },
    { type: 'tip', text: '清洗干净、打包投放，能提高旧衣复用率。' }
  ],
  quiz: [
    {
      question: '旧衣回收后最常见的去向不包括？',
      options: ['二手流通', '再生纤维', '擦拭布', '全部直接填埋'],
      answer: 3,
      explanation: '旧衣会优先进入二手流通、再生纤维或擦拭布等再利用渠道，不会全部直接填埋。'
    },
    {
      question: '混纺旧衣再生难的主要原因是？',
      options: ['纤维种类混合难分离', '颜色太深', '太旧', '没有市场'],
      answer: 0,
      explanation: '涤棉混纺等面料纤维交织在一起，成分复杂、分离困难，是再生的主要难点。'
    },
    {
      question: '处理旧衣更优先的做法是？',
      options: [
        '先捐赠/重复使用，再回收',
        '直接扔掉',
        '焚烧',
        '剪碎埋土里'
      ],
      answer: 0,
      explanation: '让衣服继续被穿是环境收益更高的方式，应先捐赠和重复使用，再考虑回收再生。'
    }
  ],
  sources: [
    '中国循环经济协会：《中国废旧纺织品综合利用年度报告》',
    '联合国环境规划署（UNEP）：纺织业环境影响相关报告'
  ]
}
