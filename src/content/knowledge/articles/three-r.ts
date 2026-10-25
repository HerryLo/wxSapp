import type { KnowledgeArticle } from '../types'

export const threeR: KnowledgeArticle = {
  id: 'three-r',
  title: '3R 原则：Reduce / Reuse / Recycle',
  summary: 'Reduce、Reuse、Recycle 不是并列选项，而是有先后的顺序。',
  takeaway: '最好的垃圾，是没有产生的垃圾。',
  topic: 'action',
  emoji: '🌍',
  readMinutes: 3,
  relatedIds: ['packaging', 'old-clothes'],
  blocks: [
    { type: 'heading', text: 'Reduce：先少产生' },
    {
      type: 'paragraph',
      text: '3R 指的是 Reduce（减少）、Reuse（重复使用）、Recycle（回收）。它们常被并列提起，却并不是三个平等的选项，而是有先后之分的一整套思路。'
    },
    {
      type: 'paragraph',
      text: 'Reduce 排在第一位，指的是从源头上减少垃圾的产生：少买不必要的东西，少用一次性物品，买东西时挑更耐用的。垃圾一旦没有产生，后面的一切处理就都不需要了。'
    },
    {
      type: 'paragraph',
      text: '源头减量也是门槛较低的一步。它不需要分拣，也不需要回收设施，只需要在消费之前多想一下。'
    },
    { type: 'heading', text: 'Reuse：再用一次' },
    {
      type: 'paragraph',
      text: 'Reuse 排在第二位，指的是让物品在丢弃之前尽可能多发挥几次作用。一个玻璃罐可以当收纳瓶，一件旧衣服可以改成抹布，一个袋子可以反复使用。'
    },
    {
      type: 'paragraph',
      text: '重复使用等于延长了物品的寿命。同一件东西用两次，就相当于少生产、少运输了一次新品，也少产生了一份垃圾。很多重复使用不需要额外成本，只需要改变一点点习惯。'
    },
    { type: 'heading', text: 'Recycle：最后才回收' },
    {
      type: 'paragraph',
      text: 'Recycle 排在最后，指的是把材料拆解、重新加工成新的原料。它常常被当成环保的代名词，但回收并不是没有代价的。'
    },
    {
      type: 'paragraph',
      text: '回收过程需要收集、运输、分拣、清洗和再加工，每一步都要消耗能源，也会产生一定的材料损耗。不是所有材料都能被回收成同等品质的产品。'
    },
    {
      type: 'paragraph',
      text: '回收仍然比直接填埋或焚烧更可取，但它应当是减量、重复使用之后才考虑的选择。'
    },
    { type: 'heading', text: '顺序不能反' },
    {
      type: 'paragraph',
      text: '把顺序颠倒过来，效果会打折扣。先把东西造出来、用一次就扔、最后指望回收，会白白多消耗前面几步的能源和材料。'
    },
    {
      type: 'paragraph',
      text: '欧盟废弃物框架指令（2008/98/EC）把“预防产生”放在废弃物管理层级的首位，其后依次是重复使用、回收、其他利用和处置，这一顺序也被许多国家和地区采纳。'
    },
    {
      type: 'paragraph',
      text: '联合国环境规划署在《全球废弃物管理展望》中同样强调，源头减量的环境收益通常高于末端回收。因为垃圾一旦产生，后续的处理总会有损耗。'
    },
    {
      type: 'stats',
      items: [
        { label: '欧盟废弃物管理层级', value: '预防 → 重复使用 → 回收 → 处置' },
        { label: '3R 优先级', value: 'Reduce > Reuse > Recycle' }
      ]
    },
    {
      type: 'list',
      items: [
        'Reduce：少买、少用一次性物品',
        'Reuse：修一修、多用几次',
        'Recycle：材料拆解后再加工'
      ]
    },
    { type: 'tip', text: '下一次购物前，先问自己“真的需要吗”。' }
  ],
  quiz: [
    {
      question: '3R 原则的正确优先级是？',
      options: [
        'Reduce > Reuse > Recycle',
        'Recycle > Reuse > Reduce',
        'Reuse > Recycle > Reduce',
        '三者相同'
      ],
      answer: 0,
      explanation: '3R 有先后之分：先减少产生，再重复使用，最后才考虑回收。'
    },
    {
      question: '以下哪项属于 Reuse？',
      options: [
        '自带水杯重复使用',
        '把塑料瓶扔进可回收桶',
        '焚烧垃圾',
        '填埋'
      ],
      answer: 0,
      explanation: '自带水杯重复使用是让物品多用几次，属于 Reuse；扔进可回收桶属于 Recycle。'
    },
    {
      question: '为什么 Reduce 优先于 Recycle？',
      options: [
        '回收也有能耗和损耗',
        '回收完全无污染',
        'Reduce 更贵',
        '没有区别'
      ],
      answer: 0,
      explanation: '回收需要收集、运输、分拣和再加工，每一步都有能耗和材料损耗，所以源头减量更优先。'
    }
  ],
  sources: [
    '欧盟废弃物框架指令 2008/98/EC',
    '联合国环境规划署（UNEP）：《Global Waste Management Outlook》'
  ]
}
