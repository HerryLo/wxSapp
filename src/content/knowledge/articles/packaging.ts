import type { KnowledgeArticle } from '../types'

export const packaging: KnowledgeArticle = {
  id: 'packaging',
  title: '外卖与快递包装怎么减',
  summary: '外卖和快递包装，是城市生活垃圾里增长最快的一部分。',
  takeaway: '少要一份餐具、拆净胶带，都是立刻能做的减量。',
  topic: 'action',
  emoji: '📦',
  readMinutes: 3,
  relatedIds: ['three-r', 'microplastics'],
  blocks: [
    { type: 'heading', text: '包装垃圾去了哪' },
    {
      type: 'paragraph',
      text: '外卖盒、塑料袋、快递箱和填充物，是城市生活垃圾里增长很快的一类。它们大多只用一次就被丢弃，体积大、材质杂，给垃圾处理带来了不小的压力。'
    },
    {
      type: 'paragraph',
      text: '据国家邮政局相关报告，我国快递行业每年产生的纸类包装废弃物超过 800 万吨、塑料包装废弃物约 180 万吨。'
    },
    {
      type: 'paragraph',
      text: '这些包装一部分进入回收渠道，另一部分则混在生活垃圾里被填埋或焚烧。'
    },
    { type: 'heading', text: '哪些包装可回收' },
    {
      type: 'paragraph',
      text: '纸箱是回收价值较高的一类。干净、完整、压扁后的瓦楞纸箱可以重新打成纸浆，做成新的纸板。'
    },
    {
      type: 'paragraph',
      text: '但胶带和塑料填充物会拖累纸箱回收。回收打浆时，残留的胶带难以处理，会形成工业垃圾；气泡膜、泡沫等填充物的回收渠道很少，回收率很低。'
    },
    {
      type: 'paragraph',
      text: '外卖餐盒的问题在油污。食物残渣和油渍会污染纸张和塑料，让原本可回收的材料失去回收价值，甚至污染同一批回收物。'
    },
    { type: 'heading', text: '点外卖时的减量选择' },
    {
      type: 'paragraph',
      text: '点外卖时，一个直接的减量做法是选择“无需餐具”。少要一双筷子、一个勺子和一张纸巾，就少了一套一次性用品进入垃圾流。'
    },
    {
      type: 'paragraph',
      text: '如果可以，选择简包装或备注少要包装袋，也能减少一部分浪费。吃不完的餐盒尽量倒掉残渣、简单冲洗，再判断是否可回收。'
    },
    { type: 'heading', text: '快递箱的循环' },
    {
      type: 'paragraph',
      text: '收到快递后，把纸箱压扁、去掉胶带，再单独投放，能明显提高它的回收价值。填充物和胶带应尽量分开处理，不要混在纸箱里。'
    },
    {
      type: 'paragraph',
      text: '能重复使用的纸箱和缓冲材料，可以留作下次寄件或收纳。从源头看，选择原装直发、减少二次包装，也是商家和平台正在推进的方向。'
    },
    {
      type: 'stats',
      items: [
        {
          label: '快递纸类包装废弃物',
          value: '超过 800 万吨',
          note: '国家邮政局相关报告'
        },
        {
          label: '快递塑料包装废弃物',
          value: '约 180 万吨',
          note: '国家邮政局相关报告'
        }
      ]
    },
    {
      type: 'list',
      items: [
        '纸箱：压扁、去胶带后可回收',
        '胶带与填充物：混入会降低回收价值',
        '外卖餐盒：油污会污染回收'
      ]
    },
    { type: 'tip', text: '拆快递后把纸箱压扁、去掉胶带，再单独投放。' }
  ],
  quiz: [
    {
      question: '外卖餐盒回收难的主要原因是？',
      options: ['油污污染', '太大', '太贵', '没有回收价值'],
      answer: 0,
      explanation: '食物残渣和油渍会污染纸张和塑料，让原本可回收的材料失去回收价值。'
    },
    {
      question: '快递纸箱回收时最需要去掉什么？',
      options: ['胶带和填充物', '纸板', '文字', '颜色'],
      answer: 0,
      explanation: '胶带残留和塑料填充物会干扰打浆、降低纸箱的回收价值，应尽量去掉。'
    },
    {
      question: '点外卖时最直接的减量做法？',
      options: ['选择无需餐具', '多要包装', '多点一份', '扔掉'],
      answer: 0,
      explanation: '选择“无需餐具”能直接少掉一套一次性用品，是点外卖时最直接的减量。'
    }
  ],
  sources: [
    '国家邮政局：快递包装绿色治理相关报告',
    '住房和城乡建设部：《中国城乡建设统计年鉴》'
  ]
}
