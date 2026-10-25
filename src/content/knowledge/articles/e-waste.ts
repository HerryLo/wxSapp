import type { KnowledgeArticle } from '../types'

export const eWaste: KnowledgeArticle = {
  id: 'e-waste',
  title: '电子垃圾：城市矿山还是毒源',
  summary: '电子垃圾既是“城市矿山”，也可能是重金属污染源。',
  takeaway: '把旧电器交给正规回收渠道，是最稳妥的处理方式。',
  topic: 'risk',
  emoji: '📱',
  readMinutes: 4,
  relatedIds: ['waste-to-energy', 'chemical-recycling'],
  blocks: [
    { type: 'heading', text: '电子垃圾为什么特殊' },
    {
      type: 'paragraph',
      text: '手机、电脑、家电更新换代越来越快，被淘汰的电子产品构成了电子垃圾。据《Global E-waste Monitor 2024》，2022 年全球电子垃圾产生量约为 6200 万吨，而且还在增长。'
    },
    {
      type: 'paragraph',
      text: '电子垃圾特殊在它的“两面性”：一方面富含金属，具有回收价值；另一方面含有重金属、阻燃剂等有害物质，处理不当会造成污染。'
    },
    {
      type: 'paragraph',
      text: '智能手机、平板等设备的换机周期越来越短，废旧电子产品迅速堆积。这些产品结构复杂、材料多样，不能像普通垃圾那样简单处理。'
    },
    { type: 'heading', text: '城市矿山：金属比矿石更富' },
    {
      type: 'paragraph',
      text: '电子垃圾被称为“城市矿山”，是因为其中金、铜等金属的品位，常常高于天然矿石。回收这些金属，比开采新矿更省资源、更省能源。'
    },
    {
      type: 'paragraph',
      text: '一块废旧电路板里，可能同时含有金、银、铜等多种可回收金属。只要采用正规工艺，就能把它们重新变成可用资源。'
    },
    {
      type: 'paragraph',
      text: '从废旧电子产品中回收金属，通常比从矿石中重新开采更省资源。一座城市里积攒的旧电器，就像一座可以反复利用的“矿”。'
    },
    {
      type: 'paragraph',
      text: '除了常见的金、铜，一些电子元器件里还含有银、钯等稀贵金属。这些资源散落在废旧设备里，如果不回收，就等于白白流失。'
    },
    {
      type: 'stats',
      items: [
        { label: '2022 年全球电子垃圾', value: '约 6200 万吨' },
        {
          label: '正规回收率',
          value: '约 22.3%',
          note: 'Global E-waste Monitor 2024'
        },
        { label: '可回收金属', value: '金、铜等' }
      ]
    },
    { type: 'heading', text: '非正规拆解的代价' },
    {
      type: 'paragraph',
      text: '如果电子垃圾落入非正规拆解作坊，问题就来了。用火烧、酸洗等原始手段提取金属，会释放重金属和持久性有机物，污染土壤、水体和空气。'
    },
    {
      type: 'paragraph',
      text: '一些拆解者把废料随意堆放、露天焚烧，其中的阻燃剂和重金属会长期残留。这种“要了金属、毁了环境”的做法，得不偿失。'
    },
    {
      type: 'paragraph',
      text: '在缺少防护的作坊里，拆解者长期接触有害物质，健康受损的风险很高。非正规拆解看似省钱，实则把成本转嫁给了环境与健康。'
    },
    {
      type: 'list',
      items: [
        '重金属进入土壤和水体',
        '焚烧释放持久性有机物',
        '阻燃剂等有害物质残留'
      ]
    },
    { type: 'heading', text: '正规回收怎么做' },
    {
      type: 'paragraph',
      text: '正规回收会先进行安全拆解，分离有害部件，再对金属、塑料等材料分类处理。这样既能回收资源，又能控制污染。'
    },
    {
      type: 'paragraph',
      text: '对个人来说，把旧电器交给正规回收点，是最稳妥的选择。正规回收率约 22.3%，意味着大量电子垃圾仍未进入规范渠道，每个人都有机会做出改变。'
    },
    {
      type: 'paragraph',
      text: '越来越多地区推行生产者责任延伸制度，让制造商为产品的回收负起责任。对普通人而言，把旧设备交给正规渠道，就是参与其中的一步。'
    },
    {
      type: 'paragraph',
      text: '回收渠道的选择也很重要：路边流动回收、网络平台和品牌官方以旧换新，正规程度各不相同，优先选择有资质的回收渠道更稳妥。'
    },
    { type: 'tip', text: '丢弃前先清除个人数据，再交给正规回收点。' }
  ],
  quiz: [
    {
      question: '全球电子垃圾年产生量约为？',
      options: ['6200 万吨', '600 万吨', '6 亿吨', '6000 吨'],
      answer: 0,
      explanation: '据《Global E-waste Monitor 2024》，2022 年全球电子垃圾约为 6200 万吨。'
    },
    {
      question: '电子垃圾被称为“城市矿山”是因为？',
      options: ['含可回收金属', '埋在城里', '颜色像矿', '可以种树'],
      answer: 0,
      explanation: '电子垃圾中金、铜等金属品位常高于天然矿石，因而被称为“城市矿山”。'
    },
    {
      question: '非正规拆解电子垃圾的主要风险？',
      options: ['重金属和持久性有机物污染', '只损失金属', '没有风险', '增加氧气'],
      answer: 0,
      explanation:
        '非正规拆解使用火烧、酸洗等手段，会释放重金属和持久性有机物，污染环境。'
    }
  ],
  sources: [
    '联合国：《Global E-waste Monitor 2024》',
    '生态环境部：固体废物相关环境状况公报'
  ]
}
