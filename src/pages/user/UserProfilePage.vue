<template>
  <div id="userProfilePage">
    <div class="profile-container">
      <!-- 左侧头像区 -->
      <div class="profile-avatar-section">
        <div class="avatar-wrapper" @click="triggerUpload">
          <a-avatar :size="120" :src="previewAvatar || loginUserStore.loginUser.userAvatar" class="avatar-img" />
          <div class="avatar-overlay">
            <CameraOutlined style="font-size: 24px; color: #fff" />
            <span class="avatar-hint">更换头像</span>
          </div>
        </div>
        <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" style="display: none"
          @change="handleFileChange" />
        <div class="avatar-tip">支持 jpg / png / webp，不超过 2M</div>
      </div>

      <!-- 右侧表单区 -->
      <div class="profile-form-section">
        <h2 class="form-title">个人中心</h2>
        <p class="form-subtitle">管理你的个人信息</p>

        <a-form layout="vertical" :model="formState" @finish="handleSubmit" class="profile-form">
          <a-form-item label="账号">
            <a-input :value="loginUserStore.loginUser.userAccount" disabled />
          </a-form-item>

          <a-form-item label="昵称" name="userName"
            :rules="[{ required: true, message: '请输入昵称' }, { max: 20, message: '昵称不超过20个字符' }]">
            <a-input v-model:value="formState.userName" placeholder="请输入昵称" allow-clear :maxlength="20"
              show-count />
          </a-form-item>

          <a-form-item label="个人简介" name="userProfile">
            <a-textarea v-model:value="formState.userProfile" placeholder="介绍一下自己吧"
              :autoSize="{ minRows: 3, maxRows: 6 }" allow-clear />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" size="large" class="submit-btn" :loading="saving">
              保存修改
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { CameraOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { uploadAvatarUsingPost, updateMyProfileUsingPost } from '@/api/userController'

const loginUserStore = useLoginUserStore()

const formState = reactive({
  userName: '',
  userProfile: '',
})

const saving = ref(false)
const previewAvatar = ref('')
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// 回显当前用户信息
onMounted(() => {
  const user = loginUserStore.loginUser
  formState.userName = user.userName ?? ''
  formState.userProfile = user.userProfile ?? ''
})

// 触发文件选择
const triggerUpload = () => {
  fileInput.value?.click()
}

// 选择文件后上传头像
const handleFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // 校验格式
  const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
  if (!isImage) {
    message.error('仅支持 jpg、png、webp 格式')
    input.value = ''
    return
  }

  // 校验大小
  if (file.size / 1024 / 1024 > 2) {
    message.error('头像大小不能超过 2M')
    input.value = ''
    return
  }

  uploading.value = true
  try {
    const res = await uploadAvatarUsingPost({}, file)
    if (res.data.code === 0 && res.data.data?.url) {
      previewAvatar.value = res.data.data.url
      message.success('头像上传成功')
    } else {
      message.error('头像上传失败：' + res.data.message)
    }
  } catch (err: any) {
    message.error('头像上传失败：' + err.message)
  } finally {
    uploading.value = false
    input.value = ''
  }
}

// 提交表单
const handleSubmit = async () => {
  saving.value = true
  try {
    const params: API.UserUpdateMyRequest = {
      userName: formState.userName,
      userProfile: formState.userProfile,
    }
    // 如果上传了新头像，一起提交
    if (previewAvatar.value) {
      params.userAvatar = previewAvatar.value
    }

    const res = await updateMyProfileUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      // 更新全局用户状态
      loginUserStore.setLoginUser(res.data.data)
      previewAvatar.value = ''
      message.success('修改成功')
    } else {
      message.error('修改失败：' + res.data.message)
    }
  } catch (err: any) {
    message.error('修改失败：' + err.message)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
#userProfilePage {
  min-height: calc(100vh - var(--header-height) - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: var(--color-bg-secondary);
}

.profile-container {
  display: flex;
  width: 100%;
  max-width: 800px;
  min-height: 480px;
  background: var(--color-bg-primary);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border-light);
}

/* === 左侧头像区 === */
.profile-avatar-section {
  width: 280px;
  padding: var(--space-12) var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-tertiary);
  border-right: 1px solid var(--color-border-light);
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  width: 120px;
  height: 120px;
}

.avatar-img {
  width: 120px;
  height: 120px;
  display: block;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-hint {
  color: #fff;
  font-size: var(--font-size-xs);
  margin-top: var(--space-1);
}

.avatar-tip {
  margin-top: var(--space-4);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-align: center;
}

/* === 右侧表单区 === */
.profile-form-section {
  flex: 1;
  padding: var(--space-10) var(--space-10);
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  margin-bottom: var(--space-8);
}

.profile-form {
  width: 100%;
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
  .profile-container {
    flex-direction: column;
    max-width: 440px;
  }

  .profile-avatar-section {
    width: 100%;
    padding: var(--space-8) var(--space-6);
    border-right: none;
    border-bottom: 1px solid var(--color-border-light);
  }

  .profile-form-section {
    padding: var(--space-8) var(--space-6);
  }
}

/* === 暗色主题 === */
[data-theme="dark"] .profile-container {
  border-color: var(--color-border);
}

[data-theme="dark"] .profile-avatar-section {
  background: #21252b;
  border-right-color: #3e4451;
}
</style>
