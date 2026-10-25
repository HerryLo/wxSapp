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
      text: '“可降解塑料”这个词，容易让人以为扔到哪都能自己消失。实际上，“可降解”往往指的是在特定条件下降解，而不是随处都能快速分解。'
    },
    {
      type: 'paragraph',
      text: '在自然土壤、淡水甚至填埋场里，许多可降解塑料的降解速度可能很慢。把它们随手丢弃，同样会造成塑料污染。'
    },
    { type: 'heading', text: 'PLA、PBAT 是什么' },
    {
      type: 'paragraph',
      text: '常见的可降解塑料主要有两类：PLA（聚乳酸）和 PBAT。PLA 多由玉米等植物淀粉发酵制成，偏硬；PBAT 柔韧，常与 PLA 复配使用。'
    },
    {
      type: 'paragraph',
      text: '它们被用来做可降解袋、餐具等。但它们仍是“塑料”，只是分子结构在特定条件下更容易被微生物分解。'
    },
    { type: 'heading', text: '需要工业堆肥条件' },
    {
      type: 'paragraph',
      text: 'PLA 要较快降解，通常需要在工业堆肥条件下进行——温度维持在 50–60℃ 左右，并保持特定湿度。这样的条件，家庭后院或自然土壤里往往达不到。'
    },
    {
      type: 'paragraph',
      text: '国际上用标准来界定“可堆肥塑料”。国家标准 GB/T 28206-2011 和欧洲标准 EN 13432，都对可堆肥塑料的降解性能、崩解和生态毒性提出了要求。'
    },
    {
      type: 'paragraph',
      text: '只有通过这类标准的产品，才称得上“可堆肥”。普通垃圾桶、普通填埋场，通常无法提供这些降解条件。'
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
      text: '可降解塑料应按当地要求投放，进入专门的工业堆肥设施才有意义；如果当地没有这样的设施，它和普通塑料一起混入回收流，反而可能污染传统塑料回收。'
    },
    {
      type: 'paragraph',
      text: '说到底，可降解塑料不是“乱扔许可证”。减少使用、重复使用，仍然是最优先的选择。'
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
      explanation: '可降解塑料需要工业堆肥的温度、湿度等条件，进入专门的工业堆肥设施才最可靠。'
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
