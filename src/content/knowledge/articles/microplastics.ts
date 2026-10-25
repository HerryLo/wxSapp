import type { KnowledgeArticle } from '../types'

export const microplastics: KnowledgeArticle = {
  id: 'microplastics',
  title: '微塑料：从洗衣水到餐桌',
  summary: '小于 5 毫米的塑料颗粒，已经出现在水、空气和食物里。',
  takeaway: '减少一次性塑料和合成纤维排放，比事后清理更有效。',
  topic: 'risk',
  emoji: '🔬',
  readMinutes: 4,
  relatedIds: ['plastic-bottle', 'packaging'],
  blocks: [
    { type: 'heading', text: '微塑料从哪来' },
    {
      type: 'paragraph',
      text: '微塑料通常指粒径小于 5 毫米的塑料颗粒。它们一部分来自洗护产品、工业原料中被直接制成的小颗粒，另一部分来自大块塑料在环境中碎裂而成。'
    },
    {
      type: 'paragraph',
      text: '合成纤维衣物、轮胎磨损、一次性包装的碎裂，都是微塑料的重要来源。按来源可分为两类：直接制成的小颗粒叫初级微塑料，大块塑料碎裂而成的叫次级微塑料。'
    },
    { type: 'heading', text: '一条洗衣废水里的纤维' },
    {
      type: 'paragraph',
      text: '每洗一次合成纤维衣物，纤维之间相互摩擦，就会脱落大量微小的塑料纤维。这些纤维随洗衣废水排出，成为微塑料的重要来源之一。'
    },
    {
      type: 'paragraph',
      text: '一条牛仔裤或一件抓绒衣，一次洗涤可能释放出成千上万根微纤维。涤纶、尼龙、腈纶等合成面料本质上都是塑料，衣物越旧，掉落的纤维往往越多，普通洗衣机又难以拦截。'
    },
    {
      type: 'stats',
      items: [
        { label: '微塑料定义', value: '粒径小于 5 毫米' },
        { label: '重要来源', value: '洗衣废水中的合成纤维' }
      ]
    },
    { type: 'heading', text: '它们去了哪' },
    {
      type: 'paragraph',
      text: '随水排出的微塑料进入污水处理厂。污水处理能截留一部分颗粒，但这些被截留的微塑料会进入污泥，而污泥若被用作土壤改良剂，微塑料又可能被带回环境。'
    },
    {
      type: 'paragraph',
      text: '剩下的微塑料随处理后的出水进入河流和海洋。它们还会通过空气、饮用水、食物进入人体，几乎无处不在。'
    },
    {
      type: 'paragraph',
      text: '世界卫生组织在 2019 年的报告中指出，饮用水里已经检测到微塑料。微塑料难以生物降解，会在环境中长期累积，清理几乎不可能。'
    },
    {
      type: 'list',
      items: [
        '洗衣废水 → 污水处理厂',
        '出水 → 河流与海洋',
        '污泥 → 土壤',
        '空气与食物 → 人体'
      ]
    },
    { type: 'heading', text: '怎么减少暴露' },
    {
      type: 'paragraph',
      text: '面对已经无处不在的微塑料，个体能做的首先是减少源头排放：少用一次性塑料，选择天然纤维衣物，都可以从源头上减少微塑料的产生。'
    },
    {
      type: 'paragraph',
      text: '在洗衣机上加装过滤装置，能截留部分纤维，减少它们进入污水系统的量。少买合成纤维衣物、选择更耐穿的天然面料，也能从源头减少微纤维。相比事后清理，源头减排更有效。'
    },
    { type: 'tip', text: '洗衣机加装过滤装置，能截留部分纤维。' }
  ],
  quiz: [
    {
      question: '微塑料通常指粒径小于多少的塑料颗粒？',
      options: ['5 毫米', '5 厘米', '5 米', '0.5 毫米'],
      answer: 0,
      explanation: '微塑料通常指粒径小于 5 毫米的塑料颗粒，5 毫米是常见的界定标准。'
    },
    {
      question: '以下哪项是微塑料的重要来源？',
      options: ['洗衣废水中的合成纤维', '雨水', '阳光', '土壤矿物'],
      answer: 0,
      explanation: '合成纤维衣物在洗涤时会脱落大量微纤维，洗衣废水是微塑料的重要来源之一。'
    },
    {
      question: '减少微塑料暴露的可行做法是？',
      options: [
        '多喝瓶装水',
        '使用洗衣机过滤装置、减少一次性塑料',
        '焚烧塑料',
        '把塑料扔进海里'
      ],
      answer: 1,
      explanation:
        '从源头减少一次性塑料，并用洗衣机过滤装置截留纤维，比事后清理更有效。'
    }
  ],
  sources: [
    '世界卫生组织（WHO）：《Microplastics in drinking-water》2019',
    '联合国环境规划署（UNEP）：塑料与微塑料相关报告'
  ]
}
