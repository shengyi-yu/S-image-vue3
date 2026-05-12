<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer class="footer">
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
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
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
  transition: background var(--transition-base);
}

[data-theme="dark"] #basicLayout .header {
  background: rgba(30, 30, 46, 0.9);
}

#basicLayout .content {
  padding: var(--space-6);
  background: var(--color-bg-secondary);
  min-height: calc(100vh - var(--header-height) - 60px);
}

#basicLayout .content-wrapper {
  max-width: var(--content-max-width);
  margin: 0 auto;
  width: 100%;
}

#basicLayout .footer {
  background: transparent;
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
