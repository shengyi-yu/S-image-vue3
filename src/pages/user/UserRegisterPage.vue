<template>
  <div id="userRegisterPage">
    <div class="register-container">
      <!-- 左侧品牌区 -->
      <div class="register-brand">
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

      <!-- 右侧注册表单 -->
      <div class="register-form-wrapper">
        <div class="form-header">
          <h2 class="form-title">创建账号</h2>
          <p class="form-subtitle">注册后即可使用全部功能</p>
        </div>

        <a-form
          :model="formState"
          autocomplete="off"
          @finish="handleSubmit"
          class="register-form"
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

          <a-form-item
            name="checkPassword"
            :rules="[
              { required: true, message: '请输入确认密码' },
              { min: 8, message: '确认密码不能小于8位' },
            ]"
          >
            <a-input-password
              v-model:value="formState.checkPassword"
              placeholder="请输入确认密码"
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
              已有账号？
              <router-link to="/user/login">去登录</router-link>
            </span>
          </div>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              class="submit-btn"
            >
              注册
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userRegisterUsingPost } from '@/api/userController'
import router from '@/router'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const handleSubmit = async (values: any) => {
  try {
    if (values.userPassword !== values.checkPassword) {
      message.error('两次输入密码不一致！')
      return
    }
    const res = await userRegisterUsingPost(values)
    if (res.data.code === 0 && res.data.data) {
      message.success('注册成功')
      router.push({
        path: '/user/login',
        replace: true,
      })
    } else {
      message.error('注册失败' + res.data.message)
    }
  } catch (e) {
    message.error('注册失败' + (e as Error).message)
  }
}
</script>

<style scoped>
#userRegisterPage {
  min-height: calc(100vh - var(--header-height) - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: var(--color-bg-secondary);
}

.register-container {
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
.register-brand {
  flex: 1;
  background: var(--gradient-hero);
  padding: var(--space-12);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.register-brand::before {
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
.register-form-wrapper {
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

.register-form {
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
  .register-brand {
    display: none;
  }

  .register-container {
    max-width: 440px;
  }

  .register-form-wrapper {
    padding: var(--space-8) var(--space-6);
  }
}
</style>
