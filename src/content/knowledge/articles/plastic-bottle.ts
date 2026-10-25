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
      text: '一瓶矿泉水的旅程通常只有几分钟：拧开、喝完、扔掉。但从它被丢弃的那一刻起，作为 PET 材质的塑料瓶才真正开始“旅行”。如果它没有进入正规回收渠道，就可能随风或随水进入河流，最终汇入海洋。'
    },
    {
      type: 'paragraph',
      text: '塑料之所以被广泛使用，正是因为它便宜、轻便又耐用。可这份“耐用”，也让它成了环境里最难被消化的垃圾之一。自 1950 年代以来，全球塑料产量大幅增长，其中很大一部分被制成一次性包装。'
    },
    {
      type: 'paragraph',
      text: '被丢弃的瓶子往往经历一条相似的路径：被雨水冲进下水道，或被风卷进草丛，最终汇入河流。海洋里的塑料垃圾，很大一部分就来自这些内陆被随手丢下的瓶子。'
    },
    { type: 'heading', text: '450 年是怎么算出来的' },
    {
      type: 'paragraph',
      text: '“450 年”并不是某个实验室精确测出的数字。自然界的降解条件千差万别，光照、温度、微生物都会影响结果。它更像一个基于塑料化学稳定性的估算值，用来提醒我们：塑料的寿命远超人的一生。'
    },
    {
      type: 'paragraph',
      text: '一个 PET 瓶在自然环境中降解，通常需要数百年。这里的“降解”也未必是真正消失，更多时候只是物理碎裂，变成更小的碎片。所谓降解，常常只是从“一个瓶子”变成了“无数颗粒”。'
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
      text: '当塑料瓶在风吹日晒下慢慢变脆、开裂，它会碎裂成毫米级甚至更小的颗粒，这就是微塑料。它们进入土壤、河流和海洋，被浮游生物误食，再沿着食物链一步步传递。'
    },
    {
      type: 'paragraph',
      text: '从某种意义上说，塑料并没有“消失”，只是变得更小、更难被看见、更难被清理。一个被丢弃的瓶子，最终可能以肉眼看不见的形式回到环境中。'
    },
    {
      type: 'paragraph',
      text: '这些微塑料被鱼类、贝类误食后，可能在其体内累积。它们会不会进一步影响人体健康，科学界仍在研究中，但减少摄入总是更稳妥的方向。'
    },
    { type: 'heading', text: '回收为什么没跟上' },
    {
      type: 'paragraph',
      text: '回收听起来是条出路，但现实并不乐观。全球塑料垃圾的回收利用率大约只有 9%，大部分塑料最终被填埋、焚烧，或者直接进入环境。'
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
      text: '即便一个瓶子被顺利回收，也很少能变回同等的瓶子。多数塑料在回收后会降级制成纤维或低价值产品，真正实现闭环再利用的比例有限。'
    },
    {
      type: 'paragraph',
      text: '正因如此，减少使用才是更可靠的起点。比起指望每一个瓶子都被回收，少用一个是更直接、也更确定的选择。'
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
