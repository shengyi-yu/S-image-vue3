import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'

import 'ant-design-vue/dist/reset.css'
import '@/styles/design-tokens.css'

import App from './App.vue'
import router from './router'
import '@/access'
import { useThemeStore } from '@/stores/useThemeStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Antd)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')
