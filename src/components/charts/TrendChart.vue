<template>
  <div :style="{ height: height }" class="w-full relative">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-500">加载中...</span>
    </div>
    
    <!-- 无数据状态 -->
    <div v-else-if="!data || !data.datasets || data.datasets.length === 0" 
         class="flex items-center justify-center h-full text-gray-500">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="mt-2">暂无数据</p>
      </div>
    </div>
    
    <!-- 图表画布 -->
    <canvas v-else ref="chartCanvas" class="w-full h-full"></canvas>
    
    <!-- 图例 -->
    <div v-if="!loading && data && data.datasets && data.datasets.length > 0" 
         class="absolute bottom-2 left-2 right-2">
      <div class="flex flex-wrap justify-center gap-2 text-xs">
        <div v-for="(label, index) in data.labels" :key="index" 
             class="flex items-center space-x-1">
          <div :style="{ backgroundColor: getColor(index) }" 
               class="w-3 h-3 rounded-sm"></div>
          <span class="text-gray-600">{{ label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  height: {
    type: String,
    default: '300px'
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'bar', // 'bar', 'line', 'pie'
    validator: (value) => ['bar', 'line', 'pie'].includes(value)
  }
})

const chartCanvas = ref(null)
let resizeObserver = null

// 默认颜色配置
const defaultColors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#F59E0B', // orange
  '#6366F1', // indigo
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#EAB308', // yellow
  '#EF4444', // red
  '#84CC16'  // lime
]

// 获取颜色
const getColor = (index) => {
  if (props.data.datasets && props.data.datasets[0] && props.data.datasets[0].backgroundColor) {
    const colors = props.data.datasets[0].backgroundColor
    return Array.isArray(colors) ? colors[index] || defaultColors[index % defaultColors.length] : colors
  }
  return defaultColors[index % defaultColors.length]
}

// 渲染柱状图
const renderBarChart = (ctx, canvasWidth, canvasHeight) => {
  const dataset = props.data.datasets[0]
  const data = dataset.data || []
  const labels = props.data.labels || []
  
  if (data.length === 0) return
  
  const padding = 40
  const chartWidth = canvasWidth - padding * 2
  const chartHeight = canvasHeight - padding * 2 - 40 // 为图例留空间
  const barWidth = chartWidth / data.length * 0.6
  const barSpacing = chartWidth / data.length * 0.4
  const maxValue = Math.max(...data) * 1.2
  
  // 绘制背景网格
  ctx.strokeStyle = '#E5E7EB'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(padding + chartWidth, y)
    ctx.stroke()
  }
  
  // 绘制Y轴标签
  ctx.fillStyle = '#6B7280'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((maxValue / 5) * (5 - i))
    const y = padding + (chartHeight / 5) * i
    ctx.fillText(value.toString(), padding - 10, y + 4)
  }
  
  // 绘制柱状图
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight
    const x = padding + (chartWidth / data.length) * index + barSpacing / 2
    const y = padding + chartHeight - barHeight
    
    // 绘制柱子
    ctx.fillStyle = getColor(index)
    ctx.fillRect(x, y, barWidth, barHeight)
    
    // 绘制阴影效果
    const gradient = ctx.createLinearGradient(x, y, x + barWidth, y)
    gradient.addColorStop(0, 'rgba(255,255,255,0.3)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.1)')
    ctx.fillStyle = gradient
    ctx.fillRect(x, y, barWidth, barHeight)
    
    // 绘制数值标签
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(value.toString(), x + barWidth / 2, y - 8)
    
    // 绘制X轴标签
    if (labels[index]) {
      ctx.fillStyle = '#6B7280'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      
      // 处理长标签，自动换行
      const label = labels[index]
      if (label.length > 6) {
        const words = label.split('')
        const maxCharsPerLine = 6
        let line = ''
        let lineCount = 0
        
        for (let i = 0; i < words.length; i++) {
          if (line.length < maxCharsPerLine) {
            line += words[i]
          } else {
            ctx.fillText(line, x + barWidth / 2, padding + chartHeight + 20 + lineCount * 15)
            line = words[i]
            lineCount++
          }
        }
        if (line) {
          ctx.fillText(line, x + barWidth / 2, padding + chartHeight + 20 + lineCount * 15)
        }
      } else {
        ctx.fillText(label, x + barWidth / 2, padding + chartHeight + 20)
      }
    }
  })
}

// 渲染折线图
const renderLineChart = (ctx, canvasWidth, canvasHeight) => {
  const dataset = props.data.datasets[0]
  const data = dataset.data || []
  const labels = props.data.labels || []
  
  if (data.length === 0) return
  
  const padding = 40
  const chartWidth = canvasWidth - padding * 2
  const chartHeight = canvasHeight - padding * 2 - 40
  const maxValue = Math.max(...data) * 1.2
  const minValue = Math.min(...data) * 0.8
  const valueRange = maxValue - minValue
  
  // 绘制背景网格
  ctx.strokeStyle = '#E5E7EB'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(padding + chartWidth, y)
    ctx.stroke()
  }
  
  // 绘制Y轴标签
  ctx.fillStyle = '#6B7280'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const value = Math.round(maxValue - (valueRange / 5) * i)
    const y = padding + (chartHeight / 5) * i
    ctx.fillText(value.toString(), padding - 10, y + 4)
  }
  
  // 计算点的位置
  const points = data.map((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
    return { x, y, value }
  })
  
  // 绘制折线
  ctx.strokeStyle = getColor(0)
  ctx.lineWidth = 3
  ctx.beginPath()
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  })
  ctx.stroke()
  
  // 绘制数据点
  points.forEach((point, index) => {
    // 绘制点的外圈
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI)
    ctx.fill()
    
    // 绘制点的内圈
    ctx.fillStyle = getColor(0)
    ctx.beginPath()
    ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
    ctx.fill()
    
    // 绘制数值标签
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(point.value.toString(), point.x, point.y - 12)
    
    // 绘制X轴标签
    if (labels[index]) {
      ctx.fillStyle = '#6B7280'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(labels[index], point.x, padding + chartHeight + 20)
    }
  })
}

// 渲染饼图
const renderPieChart = (ctx, canvasWidth, canvasHeight) => {
  const dataset = props.data.datasets[0]
  const data = dataset.data || []
  const labels = props.data.labels || []
  
  if (data.length === 0) return
  
  const centerX = canvasWidth / 2
  const centerY = (canvasHeight - 40) / 2 // 为图例留空间
  const radius = Math.min(centerX, centerY) - 40
  const total = data.reduce((sum, value) => sum + value, 0)
  
  let currentAngle = -Math.PI / 2 // 从顶部开始
  
  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI
    const endAngle = currentAngle + sliceAngle
    
    // 绘制扇形
    ctx.fillStyle = getColor(index)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, endAngle)
    ctx.closePath()
    ctx.fill()
    
    // 绘制边框
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 绘制百分比标签
    const labelAngle = currentAngle + sliceAngle / 2
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)
    
    const percentage = ((value / total) * 100).toFixed(1)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${percentage}%`, labelX, labelY)
    
    currentAngle = endAngle
  })
}

// 主渲染函数
const renderChart = () => {
  if (!chartCanvas.value || !props.data.datasets || props.data.datasets.length === 0) return
  
  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  
  // 设置高DPI支持
  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  
  // 清除画布
  ctx.clearRect(0, 0, rect.width, rect.height)
  
  // 根据类型渲染不同图表
  switch (props.type) {
    case 'line':
      renderLineChart(ctx, rect.width, rect.height)
      break
    case 'pie':
      renderPieChart(ctx, rect.width, rect.height)
      break
    case 'bar':
    default:
      renderBarChart(ctx, rect.width, rect.height)
      break
  }
}

// 监听数据变化
watch(() => [props.data, props.type], () => {
  if (!props.loading) {
    nextTick(() => {
      renderChart()
    })
  }
}, { deep: true })

// 监听加载状态变化
watch(() => props.loading, (newLoading) => {
  if (!newLoading) {
    nextTick(() => {
      renderChart()
    })
  }
})

// 组件挂载
onMounted(() => {
  if (!props.loading) {
    nextTick(() => {
      renderChart()
    })
  }
  
  // 设置ResizeObserver监听尺寸变化
  if (chartCanvas.value) {
    resizeObserver = new ResizeObserver(() => {
      if (!props.loading) {
        renderChart()
      }
    })
    resizeObserver.observe(chartCanvas.value)
  }
})

// 组件卸载
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
canvas {
  display: block;
}
</style>
