<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-900">ICT技术情报决策引擎</h1>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500">{{ currentTime }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

const currentTime = ref('')

onMounted(() => {
  setInterval(() => {
    currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }, 1000)
})
</script>
