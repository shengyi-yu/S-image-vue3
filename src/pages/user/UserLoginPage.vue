<template>
  <div id="userLoginPage">
    <div class="login-container">
      <!-- 左侧品牌区 -->
      <div class="login-brand">
        <div class="brand-content">
          <div class="brand-logo">
            <img src="@/assets/logo.png" alt="logo" />
          </div>
          <h1 class="brand-title">Sheng-image</h1>
          <p class="brand-desc">企业级智能协同云图库</p>
          <div class="brand-features">
            <div class="feature-item">
              <span class="feature-icon">🎨</span>
              <span>海量高清图片资源</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔍</span>
              <span>智能分类与搜索</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">☁️</span>
              <span>云端安全存储</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-wrapper">
        <div class="form-header">
          <h2 class="form-title">欢迎回来</h2>
          <p class="form-subtitle">登录你的账号继续使用</p>
        </div>

        <a-form
          :model="formState"
          autocomplete="off"
          @finish="handleSubmit"
          class="login-form"
        >
          <a-form-item
            name="userAccount"
            :rules="[{ required: true, message: '请输入账号' }]"
          >
            <a-input
              v-model:value="formState.userAccount"
              placeholder="请输入账号"
              size="large"
              class="form-input"
            >
              <template #prefix>
                <UserOutlined style="color: var(--color-text-tertiary)" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="userPassword"
            :rules="[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码不能小于8位' },
            ]"
          >
            <a-input-password
              v-model:value="formState.userPassword"
              placeholder="请输入密码"
              size="large"
              class="form-input"
            >
              <template #prefix>
                <LockOutlined style="color: var(--color-text-tertiary)" />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="form-options">
            <span class="tips">
              没有账号？
              <router-link to="/user/register">去注册</router-link>
            </span>
          </div>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              class="submit-btn"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userLoginUsingPost } from '@/api/userController'
import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

const loginUserStore = useLoginUserStore()

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const handleSubmit = async (values: any) => {
  try {
    const res = await userLoginUsingPost(values)
    if (res.data.code === 0 && res.data.data) {
      await loginUserStore.fetchLoginUser()
      message.success('登录成功')
      router.push({
        path: '/',
        replace: true,
      })
    } else {
      message.error('登录失败' + res.data.message)
    }
  } catch (e) {
    message.error('登录失败' + (e as Error).message)
  }
}
</script>

<style scoped>
#userLoginPage {
  min-height: calc(100vh - var(--header-height) - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: var(--color-bg-secondary);
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 520px;
  background: var(--color-bg-primary);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border-light);
}

/* === 左侧品牌区 === */
.login-brand {
  flex: 1;
  background: var(--gradient-hero);
  padding: var(--space-12);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-brand::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
}

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.brand-logo {
  width: 72px;
  height: 72px;
  margin: 0 auto var(--space-6);
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.brand-logo img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.brand-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
}

.brand-desc {
  font-size: var(--font-size-md);
  opacity: 0.85;
  margin-bottom: var(--space-8);
}

.brand-features {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-base);
  opacity: 0.9;
}

.feature-icon {
  font-size: var(--font-size-xl);
}

/* === 右侧表单区 === */
.login-form-wrapper {
  flex: 1;
  padding: var(--space-12) var(--space-10);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: var(--space-8);
}

.form-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.form-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-tertiary);
}

.login-form {
  width: 100%;
}

.form-input {
  height: 48px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
}

.form-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-6);
}

.tips {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.tips a {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  border: none;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  transition: all var(--transition-base);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

/* === 响应式 === */
@media (max-width: 768px) {
  .login-brand {
    display: none;
  }

  .login-container {
    max-width: 440px;
  }

  .login-form-wrapper {
    padding: var(--space-8) var(--space-6);
  }
}
</style>
