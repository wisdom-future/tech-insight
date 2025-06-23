<template>
  <aside class="w-64 bg-white shadow-sm">
    <nav class="mt-5 px-2">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
        :class="$route.name === item.name ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'"
      >
        <span class="mr-3">{{ item.icon }}</span>
        {{ item.title }}
      </router-link>
    </nav>
  </aside>
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
