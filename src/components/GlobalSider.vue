<template>
  <div id="globalSider">
    <a-layout-sider v-if="loginUserStore.loginUser.id" class="sider" width="200" theme="light"
    breakpoint="lg">
      <a-menu
        mode="inline"
        v-model:selectedKeys="current"
        :items="items"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import {
  HomeOutlined,
  PictureOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { type MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()

// 菜单列表
const originItems = [
  {
    key: '/pictures',
    icon: () => h(HomeOutlined),
    label: '公共图库',
  },
  {
    key: '/my_space',
    icon: () => h(UserOutlined),
    label: '我的空间',
  },
]

// 过滤非管理员菜单
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

const items = computed<MenuProps['items']>(() => filterMenus(originItems))

const router = useRouter()
const current = ref<string[]>([])

router.afterEach((to) => {
  current.value = [to.path]
})

const doMenuClick = ({ key }: { key: string }) => {
  router.push({ path: key })
}
</script>

<style scoped>
#globalSider .sider {
  background: var(--color-bg-primary);
  border-right: 1px solid var(--color-border-light);
  position: fixed;
  left: 0;
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
  z-index: 10;
}

#globalSider :deep(.ant-layout-sider) {
  height: 100%;
}

#globalSider :deep(.ant-menu) {
  border-inline-end: none;
  padding-top: var(--space-2);
  background: transparent;
}

[data-theme="dark"] #globalSider .sider {
  background: #21252b;
  border-right-color: #3e4451;
}

[data-theme="dark"] #globalSider :deep(.ant-menu) {
  background: transparent;
}

[data-theme="dark"] #globalSider :deep(.ant-menu-item) {
  color: #abb2bf;
}

[data-theme="dark"] #globalSider :deep(.ant-menu-item:hover) {
  background: #2c313a;
  color: #61afef;
}

[data-theme="dark"] #globalSider :deep(.ant-menu-item-selected) {
  background: rgba(97, 175, 239, 0.15);
  color: #61afef;
}
</style>
