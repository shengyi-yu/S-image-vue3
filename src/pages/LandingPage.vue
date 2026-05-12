<template>
  <div id="landingPage">
    <!-- 全屏视频背景 -->
    <div class="video-container">
      <video
        ref="videoRef"
        class="hero-video"
        autoplay
        muted
        loop
        playsinline
        :poster="posterUrl"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <!-- 渐变遮罩 -->
      <div class="video-overlay"></div>
    </div>

    <!-- 内容层 -->
    <div class="hero-content">
      <div class="hero-inner">
        <h1 class="hero-title">Sheng-image</h1>
        <p class="hero-subtitle">探索、发现、分享 — 你的云端图片库</p>
        <div class="hero-actions">
          <a-button type="primary" size="large" class="action-btn" @click="goToGallery">
            <template #icon><PictureOutlined /></template>
            进入图片库
          </a-button>
          <a-button size="large" class="action-btn action-btn-outline" @click="goToUpload">
            <template #icon><UploadOutlined /></template>
            上传图片
          </a-button>
        </div>
      </div>

      <!-- 底部滚动提示 -->
      <div class="scroll-hint" @click="goToGallery">
        <span>向下滚动</span>
        <DownOutlined class="scroll-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PictureOutlined, UploadOutlined, DownOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const videoRef = ref<HTMLVideoElement>()
const posterUrl = ''

const goToGallery = () => {
  router.push('/pictures')
}

const goToUpload = () => {
  router.push('/add_picture')
}
</script>

<style scoped>
#landingPage {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* === 视频容器 === */
.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

/* === 内容层 === */
.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #ffffff;
  padding: 0 var(--space-6);
}

.hero-inner {
  animation: fadeInUp 1s ease-out;
}

.hero-title {
  font-size: 72px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: var(--space-4);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  color: #ffffff !important;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 20px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: var(--space-10);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;
}

/* === 按钮组 === */
.hero-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  height: 52px;
  padding: 0 var(--space-8);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  min-width: 160px;
}

.action-btn.ant-btn-primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(97, 175, 239, 0.4);
}

.action-btn.ant-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(97, 175, 239, 0.5);
}

.action-btn-outline {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 2px solid rgba(255, 255, 255, 0.6) !important;
  color: #ffffff !important;
  backdrop-filter: blur(4px);
}

.action-btn-outline:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: #ffffff !important;
  transform: translateY(-2px);
}

/* === 滚动提示 === */
.scroll-hint {
  position: absolute;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: color var(--transition-fast);
  animation: bounce 2s infinite;
}

.scroll-hint:hover {
  color: rgba(255, 255, 255, 0.9);
}

.scroll-icon {
  font-size: 18px;
}

/* === 动画 === */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

/* === 响应式 === */
@media (max-width: 768px) {
  .hero-title {
    font-size: 42px;
  }

  .hero-subtitle {
    font-size: 16px;
    margin-bottom: var(--space-8);
  }

  .action-btn {
    height: 46px;
    padding: 0 var(--space-6);
    min-width: 140px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
