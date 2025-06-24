<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">数据采集监控</h1>
          <p class="mt-1 text-sm text-gray-600">技术数据和业界标杆实时监控状态</p>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="refreshData" :disabled="loading" 
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? '刷新中...' : '刷新数据' }}
          </button>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="systemStatus.class">
            <span class="w-2 h-2 rounded-full mr-1.5" :class="systemStatus.dotClass"></span>
            {{ systemStatus.text }}
          </span>
          <span class="text-sm text-gray-500">最后更新: {{ lastUpdate }}</span>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">数据获取失败</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
            <p class="mt-1">正在使用缓存数据显示，请检查网络连接或稍后重试。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术数据监控区域 -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">📊 技术数据监控区域</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 学术论文卡片 -->
        <DataCard :data="techData.academicPapers" color="blue" :loading="loading" />
        <!-- 专利数据卡片 -->
        <DataCard :data="techData.patentData" color="green" :loading="loading" />
        <!-- 开源项目卡片 -->
        <DataCard :data="techData.openSourceProjects" color="purple" :loading="loading" />
        <!-- 技术新闻卡片 -->
        <DataCard :data="techData.techNews" color="orange" :loading="loading" />
      </div>
    </div>

    <!-- 业界标杆监控区域 -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">🏭 业界标杆监控区域</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 标杆动态卡片 -->
        <DataCard :data="benchmarkData.industryDynamics" color="indigo" :loading="loading" />
        <!-- 技术创新卡片 -->
        <DataCard :data="benchmarkData.techInnovation" color="pink" :loading="loading" />
        <!-- 产品发布卡片 -->
        <DataCard :data="benchmarkData.productLaunches" color="cyan" :loading="loading" />
        <!-- 人才流动卡片 -->
        <DataCard :data="benchmarkData.talentMovement" color="yellow" :loading="loading" />
      </div>
    </div>

    <!-- 趋势图表区域 -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">📈 数据采集趋势</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 技术数据趋势图 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-900 mb-3">技术数据采集趋势</h3>
          <TrendChart :data="techTrendData" :loading="loading" height="200px" />
        </div>
        <!-- 业界标杆趋势图 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-900 mb-3">业界标杆监控趋势</h3>
          <TrendChart :data="benchmarkTrendData" :loading="loading" height="200px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getCollectionData } from '@/utils/api'
import DataCard from '@/components/common/DataCard.vue'
import TrendChart from '@/components/charts/TrendChart.vue'

// 响应式数据
const loading = ref(false)
const error = ref('')
const lastUpdate = ref('')

// 技术数据
const techData = ref({
  academicPapers: {
    title: "学术论文",
    icon: "📚",
    status: "loading",
    todayCount: 0,
    totalCount: 0,
    successRate: 0,
    avgQualityScore: 0,
    topKeywords: [],
    trendData: [],
    lastUpdate: ''
  },
  patentData: {
    title: "专利数据",
    icon: "🔬",
    status: "loading",
    todayCount: 0,
    totalCount: 0,
    successRate: 0,
    avgQualityScore: 0,
    topFields: [],
    trendData: [],
    lastUpdate: ''
  },
  openSourceProjects: {
    title: "开源项目",
    icon: "💻",
    status: "loading",
    todayCount: 0,
    totalCount: 0,
    successRate: 0,
    avgStarRating: 0,
    topLanguages: [],
    trendData: [],
    lastUpdate: ''
  },
  techNews: {
    title: "技术新闻",
    icon: "📰",
    status: "loading",
    todayCount: 0,
    totalCount: 0,
    successRate: 0,
    avgImpactScore: 0,
    topSources: [],
    trendData: [],
    lastUpdate: ''
  }
})

// 业界标杆数据
const benchmarkData = ref({
  industryDynamics: {
    title: "标杆动态",
    icon: "🏭",
    status: "loading",
    todayCount: 0,
    totalCount: 0,
    criticalEvents: 0,
    avgImpactScore: 0,
    topCompanies: [],
    trendData: [],
    lastUpdate: ''
  },
  techInnovation: {
    title: "技术创新",
    icon: "🚀",
    status: "loading",
    todayCount: 0,
    totalCount: 0,
    breakthroughCount: 0,
    avgInnovationScore: 0,
    topTechnologies: [],
    trendData: [],
    lastUpdate: ''
  },
  productLaunches: {
    title: "产品发布",
    icon: "📱",
    status: "loading",
    todayCount: 0,
    totalCount: 0,
    majorLaunches: 0,
    avgMarketImpact: 0,
    topCategories: [],
    trendData: [],
    lastUpdate: ''
  },
  talentMovement: {
    title: "人才流动",
    icon: "👥",
    status: "loading",
    todayCount: 0,
    totalCount: 0,
    executiveChanges: 0,
    avgInfluenceScore: 0,
    topCompanies: [],
    trendData: [],
    lastUpdate: ''
  }
})

// 计算属性
const systemStatus = computed(() => {
  if (loading.value) {
    return {
      text: '数据更新中',
      class: 'bg-yellow-100 text-yellow-800',
      dotClass: 'bg-yellow-400'
    }
  }
  
  if (error.value) {
    return {
      text: '连接异常',
      class: 'bg-red-100 text-red-800',
      dotClass: 'bg-red-400'
    }
  }
  
  return {
    text: '系统运行中',
    class: 'bg-green-100 text-green-800',
    dotClass: 'bg-green-400'
  }
})

const days = ['6天前', '5天前', '4天前', '3天前', '2天前', '昨天', '今天']

const techTrendData = computed(() => ({
  labels: days,
  datasets: [
    {
      label: '学术论文',
      data: techData.value.academicPapers.trendData || [],
      borderColor: '#3B82F6',
      backgroundColor: '#3B82F6',
      fill: false,
    },
    {
      label: '专利数据',
      data: techData.value.patentData.trendData || [],
      borderColor: '#10B981',
      backgroundColor: '#10B981',
      fill: false,
    },
    {
      label: '开源项目',
      data: techData.value.openSourceProjects.trendData || [],
      borderColor: '#8B5CF6',
      backgroundColor: '#8B5CF6',
      fill: false,
    },
    {
      label: '技术新闻',
      data: techData.value.techNews.trendData || [],
      borderColor: '#F59E0B',
      backgroundColor: '#F59E0B',
      fill: false,
    }
  ]
}));

const benchmarkTrendData = computed(() => ({
  labels: days,
  datasets: [
    {
      label: '标杆动态',
      data: benchmarkData.value.industryDynamics.trendData || [],
      borderColor: '#6366F1',
      backgroundColor: '#6366F1',
      fill: false,
    },
    {
      label: '技术创新',
      data: benchmarkData.value.techInnovation.trendData || [],
      borderColor: '#EC4899',
      backgroundColor: '#EC4899',
      fill: false,
    },
    {
      label: '产品发布',
      data: benchmarkData.value.productLaunches.trendData || [],
      borderColor: '#06B6D4',
      backgroundColor: '#06B6D4',
      fill: false,
    },
    {
      label: '人才流动',
      data: benchmarkData.value.talentMovement.trendData || [],
      borderColor: '#EAB308',
      backgroundColor: '#EAB308',
      fill: false,
    }
  ]
}));

// 数据获取函数
const fetchData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('开始获取Collection数据...')
    const response = await getCollectionData()
    
    if (response.success) {
      console.log('数据获取成功:', response.data)
      
      // 更新技术数据
      if (response.data.techData) {
        Object.keys(response.data.techData).forEach(key => {
          if (techData.value[key]) {
            techData.value[key] = {
              ...techData.value[key],
              ...response.data.techData[key],
              status: 'active'
            }
          }
        })
      }
      
      // 更新业界标杆数据
      if (response.data.benchmarkData) {
        Object.keys(response.data.benchmarkData).forEach(key => {
          if (benchmarkData.value[key]) {
            benchmarkData.value[key] = {
              ...benchmarkData.value[key],
              ...response.data.benchmarkData[key],
              status: 'active'
            }
          }
        })
      }
      
      lastUpdate.value = new Date(response.lastUpdated).toLocaleString('zh-CN')
      console.log('数据更新完成')
      
    } else {
      throw new Error(response.error || '数据获取失败')
    }
    
  } catch (err) {
    console.error('获取数据失败:', err)
    error.value = err.message || '网络连接失败，请检查网络设置'
    
    // 使用默认数据
    loadDefaultData()
    
  } finally {
    loading.value = false
  }
}

// 加载默认数据
const loadDefaultData = () => {
  console.log('加载默认数据...')
  
  // 设置默认的技术数据
  techData.value = {
    academicPapers: {
      title: "学术论文",
      icon: "📚",
      status: "active",
      todayCount: 45,
      totalCount: 1250,
      successRate: 98.5,
      avgQualityScore: 8.2,
      topKeywords: ["AI", "5G", "量子计算"],
      trendData: [30, 35, 42, 38, 45, 52, 48],
      lastUpdate: new Date().toISOString()
    },
    patentData: {
      title: "专利数据",
      icon: "🔬",
      status: "active",
      todayCount: 78,
      totalCount: 3420,
      successRate: 96.8,
      avgQualityScore: 7.9,
      topFields: ["通信技术", "人工智能", "半导体"],
      trendData: [65, 70, 75, 72, 78, 82, 76],
      lastUpdate: new Date().toISOString()
    },
    openSourceProjects: {
      title: "开源项目",
      icon: "💻",
      status: "active",
      todayCount: 23,
      totalCount: 890,
      successRate: 94.2,
      avgStarRating: 1250,
      topLanguages: ["Python", "JavaScript", "Go"],
      trendData: [18, 20, 25, 21, 23, 28, 24],
      lastUpdate: new Date().toISOString()
    },
    techNews: {
      title: "技术新闻",
      icon: "📰",
      status: "active",
      todayCount: 156,
      totalCount: 5670,
      successRate: 99.1,
      avgImpactScore: 7.5,
      topSources: ["TechCrunch", "MIT Tech Review", "IEEE"],
      trendData: [120, 135, 148, 142, 156, 162, 158],
      lastUpdate: new Date().toISOString()
    }
  }
  
  // 设置默认的业界标杆数据
  benchmarkData.value = {
    industryDynamics: {
      title: "标杆动态",
      icon: "🏭",
      status: "active",
      todayCount: 32,
      totalCount: 1180,
      criticalEvents: 5,
      avgImpactScore: 8.1,
      topCompanies: ["Google", "Microsoft", "Apple"],
      trendData: [25, 28, 35, 30, 32, 38, 34],
      lastUpdate: new Date().toISOString()
    },
    techInnovation: {
      title: "技术创新",
      icon: "🚀",
      status: "active",
      todayCount: 18,
      totalCount: 650,
      breakthroughCount: 3,
      avgInnovationScore: 8.7,
      topTechnologies: ["量子计算", "生成式AI", "6G通信"],
      trendData: [12, 15, 20, 16, 18, 22, 19],
      lastUpdate: new Date().toISOString()
    },
    productLaunches: {
      title: "产品发布",
      icon: "📱",
      status: "active",
      todayCount: 8,
      totalCount: 340,
      majorLaunches: 2,
      avgMarketImpact: 7.8,
      topCategories: ["AI芯片", "云服务", "移动设备"],
      trendData: [5, 6, 9, 7, 8, 10, 9],
      lastUpdate: new Date().toISOString()
    },
    talentMovement: {
      title: "人才流动",
      icon: "👥",
      status: "active",
      todayCount: 12,
      totalCount: 450,
      executiveChanges: 3,
      avgInfluenceScore: 8.3,
      topCompanies: ["OpenAI", "Meta", "Tesla"],
      trendData: [8, 10, 14, 11, 12, 15, 13],
      lastUpdate: new Date().toISOString()
    }
  }
  
  lastUpdate.value = new Date().toLocaleString('zh-CN')
}

// 手动刷新数据
const refreshData = () => {
  fetchData()
}

let refreshInterval = null

// 组件挂载时初始化
onMounted(() => {
  console.log('Collection页面挂载，开始获取数据...')
  fetchData()
  
  // 设置定时刷新（每5分钟）
  refreshInterval = setInterval(fetchData, 300000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
