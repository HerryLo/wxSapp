import { View } from '@tarojs/components'

import './DataStrip.scss'

interface DataStripProps {
  stats: Array<{ label: string; value: string }>
}

function DataStrip({ stats }: DataStripProps) {
  return (
    <View className='data-strip'>
      {stats.map(item => (
        <View className='data-strip__item' key={item.label}>
          <View className='data-strip__value'>{item.value}</View>
          <View className='data-strip__label'>{item.label}</View>
        </View>
      ))}
    </View>
  )
}

export default DataStrip
