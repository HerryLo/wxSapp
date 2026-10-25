import type { KnowledgeArticle } from '../types'

export const aiSorting: KnowledgeArticle = {
  id: 'ai-sorting',
  title: 'AI 智能分拣与光学分选',
  summary: '近红外识别材质、AI 视觉识别形状，机器人正在替代部分人工分拣。',
  takeaway: 'AI 分拣提升效率，但前端分类和清洁投放仍然不可替代。',
  topic: 'tech',
  emoji: '🤖',
  readMinutes: 3,
  relatedIds: ['chemical-recycling', 'e-waste'],
  blocks: [
    { type: 'heading', text: '为什么人工分拣难' },
    {
      type: 'paragraph',
      text: '垃圾种类多、成分杂，人工分拣工人要在传送带前长时间快速判断，既辛苦又容易出错，还可能接触有害物质。'
    },
    {
      type: 'paragraph',
      text: '随着人力成本上升和垃圾分类要求提高，自动分拣技术越来越受重视。光学分选和 AI 机器人，正逐步进入分选车间。'
    },
    { type: 'heading', text: '光学分选：近红外识别材质' },
    {
      type: 'paragraph',
      text: '近红外（NIR）分选是自动分选的主力技术之一。它利用不同材质对近红外光的反射差异，识别塑料、纸张等常见材质。'
    },
    {
      type: 'paragraph',
      text: '常见的塑料如 PET、PE、PP 等，都可以通过近红外进行区分。设备识别出目标材质后，用气流把物料吹出，实现高速分选。'
    },
    {
      type: 'stats',
      items: [{ label: 'NIR 主要识别', value: '常见塑料材质' }]
    },
    { type: 'heading', text: 'AI 视觉与机器人抓取' },
    {
      type: 'paragraph',
      text: 'AI 视觉进一步加入形状、颜色、纹理等信息，通过图像识别判断“这是什么垃圾”，再驱动机械臂抓取，能处理更复杂的物料。'
    },
    {
      type: 'paragraph',
      text: '一套 AI 分拣机器人通常由视觉识别系统、抓取机械臂和控制算法组成，经过大量样本训练后，可以识别多种品类。'
    },
    {
      type: 'paragraph',
      text: '相比传统光学分选，AI 分拣更灵活，能根据需求更新识别模型，适应不断变化的垃圾种类。'
    },
    { type: 'heading', text: '技术边界' },
    {
      type: 'paragraph',
      text: '自动分拣并非万能。黑色塑料因为难以反射近红外光，识别难度大；严重污染、互相堆叠的物料，也容易让视觉和机械都“抓瞎”。'
    },
    {
      type: 'paragraph',
      text: '为了提高识别率，自动分拣前通常需要预处理，比如破袋、筛分、摊平，让物料尽量分散、干净。这些预处理本身就是不小的工程。'
    },
    {
      type: 'paragraph',
      text: '因此，AI 分拣是“后端提效”的工具，不能替代前端的分类和清洁投放。居民把垃圾分类投好，分选设备才能发挥更大作用。'
    },
    { type: 'tip', text: '投放前简单冲洗、压扁，能提高自动分拣识别率。' }
  ],
  quiz: [
    {
      question: '近红外（NIR）分选主要用来识别什么？',
      options: ['塑料材质', '垃圾重量', '颜色', '温度'],
      answer: 0,
      explanation: '近红外分选利用不同材质对近红外光的反射差异，主要用来识别常见塑料材质。'
    },
    {
      question: 'AI 分拣机器人的关键组成不包括？',
      options: ['视觉识别', '机械抓取', '算法', '焚烧炉'],
      answer: 3,
      explanation: 'AI 分拣机器人由视觉识别、机械抓取和控制算法组成，焚烧炉不属于其组成。'
    },
    {
      question: '当前 AI 分拣的主要限制？',
      options: ['黑色塑料、污染和复杂堆叠', '完全不需要人工', '零成本', '只能分金属'],
      answer: 0,
      explanation: '黑色塑料难反射近红外光，污染和复杂堆叠也会降低识别率，是当前 AI 分拣的主要难点。'
    }
  ],
  sources: [
    '中国城市环境卫生协会：生活垃圾分选技术资料',
    '相关学术综述：生活垃圾智能分选技术研究进展'
  ]
}
