<template>
  <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <span class="text-2xl mr-2">{{ data.icon || '📊' }}</span>
        <h3 class="font-medium text-gray-900">{{ data.title || '数据卡片' }}</h3>
      </div>
      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
        <span class="text-sm font-semibold text-blue-600">{{ data.todayCount || 0 }} 条</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-gray-600">总计</span>
        <span class="text-sm font-semibold">{{ data.totalCount || 0 }} 条</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-gray-600">成功率</span>
        <span class="text-sm font-semibold text-green-600">{{ data.successRate || 0 }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
