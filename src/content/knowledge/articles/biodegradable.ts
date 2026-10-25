import type { KnowledgeArticle } from '../types'

export const biodegradable: KnowledgeArticle = {
  id: 'biodegradable',
  title: '可降解塑料：PLA/PBAT 的真相',
  summary: '“可降解”不等于“扔哪都能降解”。PLA 和 PBAT 需要合适的处置条件。',
  takeaway: '可降解塑料不是乱扔许可证，优先减量和重复使用。',
  topic: 'tech',
  emoji: '🌽',
  readMinutes: 4,
  relatedIds: ['plastic-bottle', 'chemical-recycling'],
  blocks: [
    { type: 'heading', text: '可降解不等于随处降解' },
    {
      type: 'paragraph',
      text: '“可降解塑料”容易让人以为扔到哪都能自己消失。实际上，“可降解”往往指在特定条件下降解，速度取决于微生物、温度和湿度。'
    },
    {
      type: 'paragraph',
      text: '在自然土壤、淡水甚至填埋场里，许多可降解塑料降解很慢。把它们随手丢弃，同样会造成塑料污染。'
    },
    { type: 'heading', text: 'PLA、PBAT 是什么' },
    {
      type: 'paragraph',
      text: '常见的可降解塑料主要有两类：PLA（聚乳酸）和 PBAT。PLA 多由玉米等植物淀粉发酵制成，偏硬；PBAT 柔韧，常与 PLA 复配使用。'
    },
    {
      type: 'paragraph',
      text: '它们常被做成可降解袋、餐具，但本质上仍是塑料，只是分子结构在特定条件下更容易被微生物分解。两者的比例和加工方式，会影响袋子的强度、韧性和降解表现。'
    },
    { type: 'heading', text: '需要工业堆肥条件' },
    {
      type: 'paragraph',
      text: 'PLA 要较快降解，通常需要工业堆肥条件——温度维持在 50–60℃ 左右，并保持特定湿度。家庭后院或自然土壤里往往达不到。'
    },
    {
      type: 'paragraph',
      text: '国家标准 GB/T 28206-2011 和欧洲标准 EN 13432，都对可堆肥塑料的降解性能、崩解和生态毒性提出了要求。只有通过这类标准的产品，才称得上“可堆肥”。'
    },
    {
      type: 'paragraph',
      text: '普通垃圾桶、普通填埋场通常无法提供这些降解条件，因此同样叫“可降解”，不同环境下的表现可能相差很大。'
    },
    {
      type: 'stats',
      items: [
        { label: 'PLA 工业堆肥条件', value: '约 50–60℃ + 特定湿度' },
        { label: '可堆肥标准', value: 'GB/T 28206、EN 13432' }
      ]
    },
    { type: 'heading', text: '怎么正确使用' },
    {
      type: 'paragraph',
      text: '对消费者来说，重点是“看清标识”：真正可堆肥的产品会标注相应标准，并说明合适的处置方式。'
    },
    {
      type: 'paragraph',
      text: '可降解塑料应按当地要求投放，进入专门的工业堆肥设施才有意义；若混入传统塑料回收流，反而可能造成污染。'
    },
    {
      type: 'paragraph',
      text: '说到底，可降解塑料不是“乱扔许可证”。减少使用、重复使用，仍然是优先考虑的选择。'
    },
    {
      type: 'list',
      items: [
        '看清标识与执行标准',
        '按当地要求投放到相应渠道',
        '不要混入普通塑料回收',
        '优先减量，重复使用'
      ]
    },
    { type: 'tip', text: '看清标识，按当地要求投放，不要混入普通塑料回收。' }
  ],
  quiz: [
    {
      question: 'PLA 塑料在自然土壤中通常？',
      options: [
        '很快完全降解',
        '可能需要工业堆肥条件才能较快降解',
        '立即消失',
        '变成肥料'
      ],
      answer: 1,
      explanation: 'PLA 在自然土壤或填埋环境中降解可能很慢，通常需要工业堆肥条件才能较快降解。'
    },
    {
      question: '“可降解塑料”最可靠的处置方式是？',
      options: ['扔进普通垃圾桶', '进入工业堆肥设施', '埋在后院', '扔进河里'],
      answer: 1,
      explanation: '可降解塑料需要工业堆肥的温度、湿度等条件，进入专门的工业堆肥设施才更稳妥。'
    },
    {
      question: '可降解塑料不能解决所有塑料污染，主要因为？',
      options: [
        '需要合适的处置条件且可能与传统塑料混淆',
        '它太贵',
        '它不能做成袋子',
        '它有毒'
      ],
      answer: 0,
      explanation: '可降解塑料依赖特定处置条件，且容易与传统塑料混淆、污染回收流，因此不能解决所有塑料污染。'
    }
  ],
  sources: [
    '国家标准 GB/T 28206-2011《可堆肥塑料技术要求》',
    '欧洲标准 EN 13432'
  ]
}
