import { createRouter, createWebHistory } from 'vue-router'
import Collection from '../views/Collection.vue'

const routes = [
  {
    path: '/',
    name: 'Collection',
    component: Collection
  }
]

const router = createRouter({
  history: createWebHistory('/tech-insight/'),
  routes
})

export default router
