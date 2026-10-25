import type { KnowledgeArticle } from '../types'

export const chemicalRecycling: KnowledgeArticle = {
  id: 'chemical-recycling',
  title: '塑料化学回收：解聚、热解、气化',
  summary: '当物理回收遇到混合、污染的塑料，化学回收提供了另一条路径。',
  takeaway: '化学回收是补充，不是万能解；减量和重复使用仍优先。',
  topic: 'tech',
  emoji: '♻️',
  readMinutes: 4,
  relatedIds: ['plastic-bottle', 'biodegradable'],
  blocks: [
    { type: 'heading', text: '物理回收的天花板' },
    {
      type: 'paragraph',
      text: '物理回收（机械回收）是把塑料清洗、粉碎、熔融后重新造粒，制成新的塑料制品。它对 PET 瓶、干净的包装膜等单一、洁净的塑料效果较好。'
    },
    {
      type: 'paragraph',
      text: '但物理回收有自己的天花板：混合塑料难以高效分离，被食物污染的塑料影响品质，反复循环还会让分子链降解、性能下降。'
    },
    {
      type: 'paragraph',
      text: '面对这些“回收不了的塑料”，化学回收提供了另一条路径——把塑料拆解成更小的分子，再重新利用。'
    },
    { type: 'heading', text: '解聚：变回单体' },
    {
      type: 'paragraph',
      text: '解聚是把塑料分子拆回到它的单体（原料）状态。它适合 PET、PLA 等由特定单体聚合而成的塑料。'
    },
    {
      type: 'paragraph',
      text: '解聚得到的单体，可以重新聚合为接近“新料”品质的塑料，实现较高等级的循环。但它通常只对结构相对规整的特定塑料有效，对原料纯度要求也较高。'
    },
    {
      type: 'stats',
      items: [{ label: '解聚适用塑料', value: 'PET、PLA 等特定塑料' }]
    },
    { type: 'heading', text: '热解与气化：变油和气' },
    {
      type: 'paragraph',
      text: '热解是在无氧或低氧条件下加热塑料，把它分解成热解油、气体和残渣；气化则更进一步，在更高温度下把塑料转化为合成气。'
    },
    {
      type: 'paragraph',
      text: '热解更适合混合、受污染的聚烯烃塑料，比如混杂的包装膜、塑料碎片等，因为这些材料用机械方法难以高效回收。'
    },
    {
      type: 'paragraph',
      text: '产出的热解油可以作为化工原料或燃料的替代，合成气也能用于制氢或发电。这些技术为“难回收塑料”打开了新的出路。'
    },
    { type: 'heading', text: '现实中的限制' },
    {
      type: 'paragraph',
      text: '化学回收的短板也很明显：能耗较高，工艺复杂，设施投入大，对原料也有适配性要求。它的规模化和经济性仍在推进之中。'
    },
    {
      type: 'paragraph',
      text: '因此，化学回收更多被定位为物理回收的补充，而不是替代。它适合处理那些物理回收处理不了的塑料，而不是“兜底一切”。'
    },
    {
      type: 'paragraph',
      text: '从优先级看，减少使用、重复使用和物理回收仍应排在化学回收之前。化学回收再先进，也不应成为随意使用一次性塑料的借口。'
    },
    { type: 'tip', text: '可回收物保持清洁干燥，能提高物理回收成功率。' }
  ],
  quiz: [
    {
      question: '塑料化学回收与物理回收的主要区别？',
      options: [
        '化学回收把塑料分解为单体/油/气',
        '化学回收只是清洗',
        '物理回收用酸',
        '没有区别'
      ],
      answer: 0,
      explanation: '化学回收通过解聚、热解、气化等方式把塑料分解为单体、油或气，与物理回收的熔融再造粒不同。'
    },
    {
      question: '热解更适合处理哪类塑料？',
      options: ['单一洁净 PET 瓶', '混合、受污染的聚烯烃塑料', '玻璃', '金属'],
      answer: 1,
      explanation: '热解更适合混合、受污染的聚烯烃塑料，这类材料难以用机械方法高效回收。'
    },
    {
      question: '化学回收的主要限制之一是？',
      options: ['能耗和原料适配性', '完全无污染', '成本为零', '可处理所有垃圾'],
      answer: 0,
      explanation: '化学回收能耗较高、工艺复杂，且对原料有适配性要求，是其现实限制之一。'
    }
  ],
  sources: [
    '经济合作与发展组织（OECD）：《Global Plastics Outlook》2022',
    '艾伦·麦克阿瑟基金会：《The New Plastics Economy》'
  ]
}
