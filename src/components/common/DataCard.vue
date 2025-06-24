<template>
  <div :class="cardClasses" class="rounded-lg p-4 border">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <span class="text-2xl mr-2">{{ data.icon }}</span>
        <h3 class="font-medium text-gray-900">{{ data.title }}</h3>
      </div>
      <span :class="statusClasses" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
        {{ data.status === 'loading' ? '加载中' : '活跃' }}
      </span>
    </div>
    
    <div v-if="loading" class="space-y-2">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
    
    <div v-else class="space-y-2">
      <div class="flex justify-between">
        <span class="text-sm text-gray-600">今日采集</span>
        <span :class="primaryTextClass" class="text-sm font-semibold">{{ data.todayCount }} 条</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-gray-600">总计</span>
        <span class="text-sm font-semibold">{{ data.totalCount }} 条</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-gray-600">成功率</span>
        <span class="text-sm font-semibold text-green-600">{{ data.successRate }}%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-gray-600">{{ scoreLabel }}</span>
        <span class="text-sm font-semibold text-orange-600">{{ scoreValue }}</span>
      </div>
    </div>
    
    <div v-if="!loading && tags.length > 0" :class="borderClass" class="mt-3 pt-3 border-t">
      <div class="text-xs text-gray-600 mb-1">{{ tagLabel }}:</div>
      <div class="flex flex-wrap gap-1">
        <span v-for="tag in tags" :key="tag" 
              :class="tagClasses" 
              class="inline-flex items-center px-2 py-1 rounded text-xs">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const colorConfig = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    status: 'bg-blue-100 text-blue-800',
    text: 'text-blue-600',
    tag: 'bg-blue-100 text-blue-700',
    borderClass: 'border-blue-200'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    status: 'bg-green-100 text-green-800',
    text: 'text-green-600',
    tag: 'bg-green-100 text-green-700',
    borderClass: 'border-green-200'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    status: 'bg-purple-100 text-purple-800',
    text: 'text-purple-600',
    tag: 'bg-purple-100 text-purple-700',
    borderClass: 'border-purple-200'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    status: 'bg-orange-100 text-orange-800',
    text: 'text-orange-600',
    tag: 'bg-orange-100 text-orange-700',
    borderClass: 'border-orange-200'
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    status: 'bg-indigo-100 text-indigo-800',
    text: 'text-indigo-600',
    tag: 'bg-indigo-100 text-indigo-700',
    borderClass: 'border-indigo-200'
  },
  pink: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    status: 'bg-pink-100 text-pink-800',
    text: 'text-pink-600',
    tag: 'bg-pink-100 text-pink-700',
    borderClass: 'border-pink-200'
  },
  cyan: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    status: 'bg-cyan-100 text-cyan-800',
    text: 'text-cyan-600',
    tag: 'bg-cyan-100 text-cyan-700',
    borderClass: 'border-cyan-200'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    status: 'bg-yellow-100 text-yellow-800',
    text: 'text-yellow-600',
    tag: 'bg-yellow-100 text-yellow-700',
    borderClass: 'border-yellow-200'
  }
}

const cardClasses = computed(() => {
  const config = colorConfig[props.color] || colorConfig.blue
  return `${config.bg} ${config.border}`
})

const statusClasses = computed(() => {
  const config = colorConfig[props.color] || colorConfig.blue
  return config.status
})

const primaryTextClass = computed(() => {
  const config = colorConfig[props.color] || colorConfig.blue
  return config.text
})

const tagClasses = computed(() => {
  const config = colorConfig[props.color] || colorConfig.blue
  return config.tag
})

const borderClass = computed(() => {
  const config = colorConfig[props.color] || colorConfig.blue
  return config.borderClass
})

const scoreLabel = computed(() => {
  if (props.data.avgQualityScore !== undefined) return '质量评分'
  if (props.data.avgStarRating !== undefined) return '平均星数'
  if (props.data.avgImpactScore !== undefined) return '影响力评分'
  if (props.data.avgInnovationScore !== undefined) return '创新度评分'
  if (props.data.avgMarketImpact !== undefined) return '市场影响'
  if (props.data.avgInfluenceScore !== undefined) return '影响力评分'
  return '评分'
})

const scoreValue = computed(() => {
  if (props.data.avgQualityScore !== undefined) return `${props.data.avgQualityScore}/10`
  if (props.data.avgStarRating !== undefined) return props.data.avgStarRating
  if (props.data.avgImpactScore !== undefined) return `${props.data.avgImpactScore}/10`
  if (props.data.avgInnovationScore !== undefined) return `${props.data.avgInnovationScore}/10`
  if (props.data.avgMarketImpact !== undefined) return `${props.data.avgMarketImpact}/10`
  if (props.data.avgInfluenceScore !== undefined) return `${props.data.avgInfluenceScore}/10`
  return '0'
})

const tags = computed(() => {
  return props.data.topKeywords || 
         props.data.topFields || 
         props.data.topLanguages || 
         props.data.topSources || 
         props.data.topCompanies || 
         props.data.topTechnologies || 
         props.data.topCategories || 
         []
})

const tagLabel = computed(() => {
  if (props.data.topKeywords) return '热门领域'
  if (props.data.topFields) return '技术领域'
  if (props.data.topLanguages) return '热门语言'
  if (props.data.topSources) return '热门来源'
  if (props.data.topCompanies) return '重点公司'
  if (props.data.topTechnologies) return '热门技术'
  if (props.data.topCategories) return '产品类别'
  return '标签'
})
</script>
