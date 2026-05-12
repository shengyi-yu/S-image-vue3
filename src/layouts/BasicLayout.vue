<template>
  <div id="basicLayout" :class="{ 'is-landing': isLanding }">
    <a-layout style="min-height: 100vh">
      <a-layout-header :class="['header', { 'header-landing': isLanding }]">
        <GlobalHeader :transparent="isLanding" />
      </a-layout-header>
      <a-layout-content :class="['content', { 'content-landing': isLanding }]">
        <router-view />
      </a-layout-content>
      <a-layout-footer v-if="!isLanding" class="footer">
        <div class="footer-inner">
          <span class="footer-brand">Sheng-image</span>
          <span class="footer-divider">·</span>
          <span>© {{ new Date().getFullYear() }} 图片管理系统</span>
          <span class="footer-divider">·</span>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-icp"
          >
            冀ICP备2025129355号
          </a>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import GlobalHeader from '@/components/GlobalHeader.vue'

const route = useRoute()
const isLanding = computed(() => route.path === '/')
</script>

<style scoped>
/* === 默认 Header === */
#basicLayout .header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  line-height: var(--header-height);
  padding-inline: var(--space-8);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-xs);
  transition: all var(--transition-base);
}

[data-theme="dark"] #basicLayout .header {
  background: #21252b;
  border-bottom-color: #3e4451;
}

/* === Landing Page Header：全透明 === */
#basicLayout .header-landing {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
}

/* === 默认 Content === */
#basicLayout .content {
  padding: var(--space-6);
  background: var(--color-bg-secondary);
  min-height: calc(100vh - var(--header-height) - 60px);
}

/* === Landing Content：全屏无约束 === */
#basicLayout .content-landing {
  padding: 0;
  background: #000;
  min-height: 100vh;
}

/* === Footer === */
[data-theme="dark"] #basicLayout .footer {
  background: #1e1e2e;
}

[data-theme="dark"] #basicLayout :deep(.ant-layout-footer) {
  background: #1e1e2e !important;
}

#basicLayout :deep(.ant-layout-footer) {
  background: var(--color-bg-secondary) !important;
}

#basicLayout .footer {
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border-light);
  padding: var(--space-5) var(--space-8);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

#basicLayout .footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

#basicLayout .footer-brand {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

#basicLayout .footer-divider {
  color: var(--color-border);
}

#basicLayout .footer-icp {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

#basicLayout .footer-icp:hover {
  color: var(--color-primary);
}
</style>
