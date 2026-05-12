import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 默认暗色主题
  const isDark = ref(true)

  // 初始化：从 localStorage 读取
  const initTheme = () => {
    const saved = localStorage.getItem('sheng-image-theme')
    if (saved) {
      isDark.value = saved === 'dark'
    }
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    localStorage.setItem('sheng-image-theme', isDark.value ? 'dark' : 'light')
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // 监听变化自动应用
  watchEffect(() => {
    applyTheme()
  })

  return { isDark, toggleTheme, initTheme }
})
