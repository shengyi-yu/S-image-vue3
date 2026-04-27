<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh;">
      <a-layout-header class="header">
        <GlobalHeader/>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view/>
      </a-layout-content>
      <a-layout-footer class="footer">
        <div class="container">
          <p>© 2025 Sheng-image 图片管理系统 | 版权所有</p>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>



<script setup lang="ts">
import  GlobalHeader from '@/components/GlobalHeader.vue';
</script>

<style scoped>
#basicLayout .header {
  padding-inline: 80px;
  background: white;
  color: unset;
  margin-bottom: 16px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
#basicLayout .content {
  padding: 24px;
  background: linear-gradient(to right, #fefefe, #ffffff);

  margin-bottom: 80px; /* 留出空间给固定的页脚 */
}
</style>
