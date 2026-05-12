<template>
  <div id="globalHeader" :class="{ 'is-transparent': props.transparent }">
    <a-row :wrap="false" align="middle">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <div class="logo-wrapper">
              <img src="../assets/logo.png" alt="logo" class="logo" />
            </div>
            <div class="title">Sheng-image</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          class="nav-menu"
          @click="doMenuClick"
        />
      </a-col>
      <a-col flex="160px">
        <div class="header-actions">
          <!-- 主题切换 -->
          <a-tooltip :title="themeStore.isDark ? '切换亮色' : '切换暗色'">
            <button class="theme-toggle" @click="themeStore.toggleTheme()">
              <span v-if="themeStore.isDark">🌙</span>
              <span v-else>☀️</span>
            </button>
          </a-tooltip>

          <!-- 用户状态 -->
          <div class="user-login-status">
            <div v-if="loginUserStore.loginUser.id">
              <a-dropdown>
                <a-space class="user-info">
                  <a-avatar
                    :size="32"
                    :src="loginUserStore.loginUser.userAvatar"
                    class="user-avatar"
                  />
                  <span class="user-name">{{ loginUserStore.loginUser.userName ?? '游客' }}</span>
                </a-space>
                <template #overlay>
                  <a-menu class="user-dropdown">
                    <a-menu-item @click="doLogout">
                      <LogoutOutlined />
                      <span style="margin-left: 8px">退出登录</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <div v-else>
              <a-space>
                <a-button href="/user/register" class="landing-btn">注册</a-button>
                <a-button type="primary" href="/user/login" class="landing-btn-primary">登录</a-button>
              </a-space>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import {
  HomeOutlined,
  LogoutOutlined,
  PictureOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { message, type MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { useThemeStore } from '@/stores/useThemeStore'

const props = defineProps<{
  transparent?: boolean
}>()

import { userLogoutUsingPost } from '@/api/userController'

const loginUserStore = useLoginUserStore()
const themeStore = useThemeStore()

// 菜单列表
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '首页',
    title: '首页',
  },
  {
    key: '/pictures',
    icon: () => h(PictureOutlined),
    label: '图片库',
    title: '图片库',
  },
  {
    key: '/admin/userManage',
    icon: () => h(UserOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/pictureManage',
    icon: () => h(PictureOutlined),
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/add_picture',
    icon: () => h(PlusOutlined),
    label: '创建图片',
    title: '创建图片',
  },
]

// 过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    if (menu?.key && String(menu.key).startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}

// 展示在菜单的路由数组
const items = computed<MenuProps['items']>(() => filterMenus(originItems))

const router = useRouter()

const doMenuClick = ({ key }: { key: string }) => {
  router.push({ path: key })
}

const current = ref<string[]>([])

router.afterEach((to) => {
  current.value = [to.path]
})

const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出成功')
    router.push('/user/login')
  } else {
    message.error('退出登录失败' + res.data.message)
  }
}
</script>

<style scoped>
#globalHeader {
  width: 100%;
}

.title-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.logo-wrapper {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 导航菜单 */
.nav-menu {
  border: none !important;
  background: transparent;
}

.nav-menu :deep(.ant-menu-item) {
  border-radius: var(--radius-md);
  margin: 0 var(--space-1);
  transition: all var(--transition-fast);
}

.nav-menu :deep(.ant-menu-item:hover) {
  background: var(--color-primary-bg);
}

.nav-menu :deep(.ant-menu-item-selected) {
  background: var(--color-primary-bg);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

/* 右侧操作区 */
.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
}

/* 主题切换按钮 */
.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-bg-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
  transform: scale(1.1);
}

/* 用户信息 */
.user-info {
  cursor: pointer;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.user-info:hover {
  background: var(--color-bg-tertiary);
}

.user-avatar {
  border: 2px solid var(--color-primary-bg);
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.user-dropdown {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-1);
}

.user-dropdown :deep(.ant-menu-item) {
  border-radius: var(--radius-md);
  margin: 2px 0;
}

/* ============================================
   Transparent Mode (Landing Page)
   ============================================ */
#globalHeader.is-transparent .title {
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

#globalHeader.is-transparent .nav-menu :deep(.ant-menu-item) {
  color: rgba(255, 255, 255, 0.8) !important;
}

#globalHeader.is-transparent .nav-menu :deep(.ant-menu-item:hover) {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

#globalHeader.is-transparent .nav-menu :deep(.ant-menu-item-selected) {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

#globalHeader.is-transparent .theme-toggle {
  color: rgba(255, 255, 255, 0.8);
}

#globalHeader.is-transparent .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

#globalHeader.is-transparent .user-name {
  color: #ffffff;
}

#globalHeader.is-transparent .user-info:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Landing page 透明按钮 */
#globalHeader.is-transparent .landing-btn {
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  color: #ffffff !important;
  backdrop-filter: blur(4px);
}

#globalHeader.is-transparent .landing-btn:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.7) !important;
}

#globalHeader.is-transparent .landing-btn-primary {
  background: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
  box-shadow: 0 2px 12px rgba(97, 175, 239, 0.4);
}
</style>
