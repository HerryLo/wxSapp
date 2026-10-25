import type { KnowledgeArticle } from '../types'

export const plasticBottle: KnowledgeArticle = {
  id: 'plastic-bottle',
  title: '一个塑料瓶的 450 年',
  summary:
    '从货架到海洋，一个 PET 瓶要经历什么？450 年不是精确数字，但足以说明塑料的持久性。',
  takeaway: '少用一个瓶子，比回收一个瓶子更直接。',
  topic: 'risk',
  emoji: '🧴',
  readMinutes: 4,
  featured: true,
  relatedIds: ['microplastics', 'chemical-recycling'],
  blocks: [
    { type: 'heading', text: '从货架到环境' },
    {
      type: 'paragraph',
      text: '一瓶矿泉水的饮用通常只有几分钟：拧开、喝完、扔掉。作为 PET 材质的塑料瓶，从被丢弃的那一刻起才真正开始“旅行”。如果没进入正规回收渠道，它可能随风或随水进入河流，最终汇入海洋。'
    },
    {
      type: 'paragraph',
      text: '塑料被广泛使用，是因为便宜、轻便又耐用。可这份耐用，也让它成了环境中难被消化的垃圾。自 1950 年代以来，全球塑料产量大幅增长，其中很大一部分是一次性包装。'
    },
    { type: 'heading', text: '450 年是怎么算出来的' },
    {
      type: 'paragraph',
      text: '“450 年”并不是实验室精确测出的数字。光照、温度、微生物都会影响降解，它更像基于塑料化学稳定性的估算值，用来提醒我们：塑料的寿命远超人的一生。'
    },
    {
      type: 'paragraph',
      text: '一个 PET 瓶在自然环境中降解，通常需要数百年。这里的“降解”未必是真正消失，更多只是碎裂成更小的颗粒。'
    },
    {
      type: 'stats',
      items: [
        { label: '全球塑料回收率', value: '约 9%', note: 'OECD 2022' },
        {
          label: 'PET 瓶自然降解',
          value: '数百年',
          note: '受环境条件影响，非精确值'
        },
        { label: '塑料产量', value: '自 1950 年代以来大幅增长' }
      ]
    },
    { type: 'heading', text: '碎裂之后：微塑料' },
    {
      type: 'paragraph',
      text: '塑料瓶在风吹日晒下变脆、开裂，会碎裂成毫米级甚至更小的颗粒，这就是微塑料。它们进入土壤、河流和海洋，被浮游生物误食，再沿食物链传递。'
    },
    {
      type: 'paragraph',
      text: '被鱼类、贝类误食后，微塑料可能在其体内累积。它们是否影响人体健康，科学界仍在研究，减少摄入仍是谨慎的方向。'
    },
    { type: 'heading', text: '回收为什么没跟上' },
    {
      type: 'paragraph',
      text: '回收听起来是条出路，但全球塑料垃圾的回收利用率大约只有 9%，大部分最终被填埋、焚烧或进入环境。'
    },
    {
      type: 'list',
      items: [
        '塑料种类繁多，分选和清洗成本高',
        '部分塑料回收后性能下降，只能降级使用',
        '回收基础设施在部分地区仍然不足'
      ]
    },
    {
      type: 'paragraph',
      text: '即便瓶子被回收，也很少变回同等质量的瓶子，多数会降级制成纤维或低价值产品。正因如此，减少使用是更直接的起点。'
    },
    { type: 'tip', text: '自带水杯是最省事的减量方式。' }
  ],
  quiz: [
    {
      question: '一个 PET 塑料瓶在自然环境中完全降解通常需要多久？',
      options: ['1 年', '10 年', '约 450 年', '3 个月'],
      answer: 2,
      explanation:
        '塑料化学性质稳定，自然降解通常以百年计；450 年是常见估算值，不是精确数字。'
    },
    {
      question: '塑料在环境中破碎后，最可能变成什么？',
      options: ['可被微生物完全吃掉', '微塑料', '无害气体', '肥料'],
      answer: 1,
      explanation: '塑料不会凭空消失，而是碎裂成越来越小的微塑料。'
    },
    {
      question: '全球塑料垃圾的回收利用率大致是多少？',
      options: ['约 9%', '约 50%', '约 90%', '100%'],
      answer: 0,
      explanation:
        'OECD 2022 年的估算约为 9%，大部分塑料最终被填埋、焚烧或进入环境。'
    }
  ],
  sources: [
    '经济合作与发展组织（OECD）：《Global Plastics Outlook》2022',
    '联合国环境规划署（UNEP）：《Global Waste Management Outlook》'
  ]
}
