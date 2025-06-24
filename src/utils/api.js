import axios from 'axios'

// 🔧 配置区域 - 将被环境变量替换
const API_BASE_URL = 'GOOGLE_APPS_SCRIPT_URL_PLACEHOLDER'

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    console.log('API请求:', config.url, config.params)
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log('API响应:', response.data)
    return response
  },
  error => {
    console.error('响应错误:', error)
    return Promise.reject(error)
  }
)

// 📊 获取数据采集状态
export const getCollectionData = async () => {
  try {
    const response = await api.get('', {
      params: { action: 'getCollectionData' }
    })
    return response.data
  } catch (error) {
    console.error('获取Collection数据失败:', error)
    throw error
  }
}

// 📈 获取概览数据
export const getOverviewData = async () => {
  try {
    const response = await api.get('', {
      params: { action: 'getOverviewData' }
    })
    return response.data
  } catch (error) {
    console.error('获取Overview数据失败:', error)
    throw error
  }
}

// 🧠 获取分析数据
export const getAnalysisData = async () => {
  try {
    const response = await api.get('', {
      params: { action: 'getAnalysisData' }
    })
    return response.data
  } catch (error) {
    console.error('获取Analysis数据失败:', error)
    throw error
  }
}

// 🎯 获取行动建议数据
export const getActionData = async () => {
  try {
    const response = await api.get('', {
      params: { action: 'getActionData' }
    })
    return response.data
  } catch (error) {
    console.error('获取Action数据失败:', error)
    throw error
  }
}

// 📋 获取报告数据
export const getReportsData = async () => {
  try {
    const response = await api.get('', {
      params: { action: 'getReportsData' }
    })
    return response.data
  } catch (error) {
    console.error('获取Reports数据失败:', error)
    throw error
  }
}

// 🔧 获取系统状态
export const getSystemStatus = async () => {
  try {
    const response = await api.get('', {
      params: { action: 'getSystemStatus' }
    })
    return response.data
  } catch (error) {
    console.error('获取系统状态失败:', error)
    throw error
  }
}

export async function getRawData(table, type) {
  // 这里的 URL 和参数根据你后端 Apps Script 实际接口设定
  // 假设你的 API 支持 ?table=Raw_Industry_Dynamics&type=today 这样的参数
  const url = `https://${GOOGLE_APPS_SCRIPT_URL}?action=getRawData&table=${encodeURIComponent(table)}&type=${encodeURIComponent(type)}`;
  const res = await fetch(url);
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || '原始数据获取失败');
  }

  // 假设后端返回 { data: [...], columns: [...] }
  return {
    data: json.data.records || [],
    columns: json.data.columns || (json.data.records && json.data.records.length > 0
      ? Object.keys(json.data.records[0]).map(k => ({ prop: k, label: k }))
      : []
    )
  };
}

export default api
