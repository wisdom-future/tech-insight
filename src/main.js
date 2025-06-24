import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

console.log('Starting Vue application...')

const app = createApp(App)
app.use(router)
app.mount('#app')

console.log('Vue application mounted successfully')
