import { View, Text } from '@tarojs/components'
import type {
  KnowledgeBlock,
  KnowledgeTopic
} from '../../content/knowledge/types'

import './BlockRenderer.scss'

interface BlockRendererProps {
  blocks: KnowledgeBlock[]
  topic: KnowledgeTopic
}

function BlockRenderer({ blocks, topic }: BlockRendererProps) {
  return (
    <View className='block-list'>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <View className='block-heading' key={index}>
              {block.text}
            </View>
          )
        }

        if (block.type === 'paragraph') {
          return (
            <View className='block-paragraph' key={index}>
              {block.text}
            </View>
          )
        }

        if (block.type === 'list') {
          return (
            <View className='block-list-items' key={index}>
              {block.items.map((item, itemIndex) => (
                <View className='block-list-item' key={itemIndex}>
                  <View className='block-list-dot' />
                  <Text className='block-list-text'>{item}</Text>
                </View>
              ))}
            </View>
          )
        }

        if (block.type === 'stats') {
          return (
            <View className='block-stats' key={index}>
              {block.items.map(item => (
                <View className='block-stat' key={item.label}>
                  <View
                    className={'block-stat__value block-stat__value--' + topic}
                  >
                    {item.value}
                  </View>
                  <View className='block-stat__label'>{item.label}</View>
                  {item.note && (
                    <View className='block-stat__note'>{item.note}</View>
                  )}
                </View>
              ))}
            </View>
          )
        }

        return (
          <View className={'block-tip block-tip--' + topic} key={index}>
            {block.title && (
              <View className='block-tip__title'>{block.title}</View>
            )}
            <View className='block-tip__text'>{block.text}</View>
          </View>
        )
      })}
    </View>
  )
}

export default BlockRenderer
