import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import Collection from '../views/Collection.vue'
import Analysis from '../views/Analysis.vue'
import Action from '../views/Action.vue'
import Reports from '../views/Reports.vue'

const routes = [
  { path: '/', name: 'Overview', component: Overview, meta: { title: '概览总览' } },
  { path: '/collection', name: 'Collection', component: Collection, meta: { title: '数据采集' } },
  { path: '/analysis', name: 'Analysis', component: Analysis, meta: { title: '情报分析' } },
  { path: '/action', name: 'Action', component: Action, meta: { title: '行动建议' } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { title: '报告中心' } }
]

const router = createRouter({
  history: createWebHistory('/tech-insight/'),
  routes
})

export default router
