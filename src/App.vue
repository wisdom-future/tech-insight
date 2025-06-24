<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">ICT技术情报决策引擎</h1>
          </div>
        </div>
      </div>
    </header>
    
    <div class="flex">
      <aside class="w-64 bg-white shadow-sm">
        <nav class="mt-5 px-2">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50"
          >
            <span class="mr-3">{{ item.icon }}</span>
            {{ item.title }}
          </router-link>
        </nav>
      </aside>
      
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
const navigation = [
  { name: 'Overview', title: '概览总览', href: '/', icon: '📊' },
  { name: 'Collection', title: '数据采集', href: '/collection', icon: '📥' },
  { name: 'Analysis', title: '情报分析', href: '/analysis', icon: '🧠' },
  { name: 'Action', title: '行动建议', href: '/action', icon: '🎯' },
  { name: 'Reports', title: '报告中心', href: '/reports', icon: '📋' }
]
</script>
