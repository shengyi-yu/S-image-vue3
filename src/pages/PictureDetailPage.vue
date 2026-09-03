<template>
  <div id="pictureDetailPage">
    <a-row :gutter="[24, 24]">
      <!-- 图片展示区 -->
      <a-col :sm="24" :md="16" :xl="18">
        <a-card class="preview-card" :bordered="false">
          <div class="preview-wrapper">
            <a-image class="preview-image" :src="picture.url" :alt="picture.name" />
          </div>
        </a-card>
      </a-col>

      <!-- 图片信息区 -->
      <a-col :sm="24" :md="8" :xl="6">
        <a-card class="info-card" :bordered="false">
          <!-- 作者信息 -->
          <div class="author-section">
            <a-avatar :size="40" :src="picture.user?.userAvatar" class="author-avatar" />
            <div class="author-info">
              <div class="author-name">{{ picture.user?.userName ?? '未知用户' }}</div>
              <div class="upload-time">上传于 {{ formatTime(picture.createTime) }}</div>
            </div>
          </div>

          <a-divider />

          <!-- 图片标题 -->
          <h2 class="picture-title">{{ picture.name ?? '未命名' }}</h2>
          <p class="picture-intro" v-if="picture.introduction">
            {{ picture.introduction }}
          </p>

          <a-divider />

          <!-- 标签和分类 -->
          <div class="meta-section">
            <div class="meta-row" v-if="picture.category">
              <span class="meta-label">分类</span>
              <a-tag color="blue" class="meta-tag">{{ picture.category }}</a-tag>
            </div>
            <div class="meta-row" v-if="picture.tags?.length">
              <span class="meta-label">标签</span>
              <div class="meta-tags">
                <a-tag v-for="tag in picture.tags" :key="tag" class="meta-tag">
                  {{ tag }}
                </a-tag>
              </div>
            </div>
            <!-- AI 分析区块 -->
            <div class="meta-row" v-if="picture.aiTags?.length">
              <span class="meta-label">AI标签</span>
              <div class="meta-tags">
                <a-tag
                  v-for="tag in picture.aiTags"
                  :key="'ai-' + tag"
                  color="purple"
                  class="meta-tag"
                >
                  ✨ {{ tag }}
                </a-tag>
              </div>
            </div>
            <div class="ai-desc" v-if="picture.aiDescription">
              <span class="meta-label">AI描述</span>
              <p class="ai-desc-text">{{ picture.aiDescription }}</p>
            </div>
          </div>

          <a-divider />

          <!-- 图片属性 -->
          <div class="props-section">
            <div class="prop-item" v-if="space">
              <span class="prop-label">所属空间</span>
              <span class="prop-value">
                <a-tag color="purple" class="meta-tag">{{ space.spaceName }}</a-tag>
              </span>
            </div>
            <div class="prop-item">
              <span class="prop-label">格式</span>
              <span class="prop-value">{{ picture.picFormat ?? '-' }}</span>
            </div>
            <div class="prop-item">
              <span class="prop-label">尺寸</span>
              <span class="prop-value">
                {{
                  picture.picWidth && picture.picHeight
                    ? `${picture.picWidth} × ${picture.picHeight}`
                    : '-'
                }}
              </span>
            </div>
            <div class="prop-item">
              <span class="prop-label">宽高比</span>
              <span class="prop-value">{{ picture.picScale ?? '-' }}</span>
            </div>
            <div class="prop-item">
              <span class="prop-label">大小</span>
              <span class="prop-value">{{ formatSize(picture.picSize) }}</span>
            </div>
          </div>

          <a-divider />

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <a-button v-if="canEdit" type="default" block class="action-btn" @click="doEdit">
              <template #icon><EditOutlined /></template>
              编辑
            </a-button>
            <a-button v-if="canEdit" danger block class="action-btn" @click="doDelete">
              <template #icon><DeleteOutlined /></template>
              删除
            </a-button>
            <a-button type="primary" block class="download-btn" @click="doDownload">
              <template #icon><DownloadOutlined /></template>
              免费下载
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/pictureController'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController'
import { downloadImage, formatSize } from '@/utils'
import { message } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import dayjs from 'dayjs'

interface Props {
  id: string | number
}

const picture = ref<API.PictureVO>({})
const space = ref<API.SpaceVO | null>(null)

const props = defineProps<Props>()

const formatTime = (time?: string) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'
}

const FetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: props.id as any,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
      // 如果属于某个空间，获取空间信息
      if (picture.value.spaceId) {
        const spaceRes = await getSpaceVoByIdUsingGet({ id: picture.value.spaceId })
        if (spaceRes.data.code === 0 && spaceRes.data.data) {
          space.value = spaceRes.data.data
        }
      }
    } else {
      message.error('图片获取失败' + res.data.message)
    }
  } catch (e: any) {
    message.error('图片获取失败' + e.message)
  }
}

const loginUserStore = useLoginUserStore()
// 是否具有编辑权限
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser.id) {
    return false
  }
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})

const router = useRouter()
const doEdit = () => {
  router.push({
    path: '/add_picture',
    query: {
      id: picture.value.id,
      spaceId: picture.value.spaceId,
    },
  })
}

const doDownload = () => {
  downloadImage(picture.value.url)
}

const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id: id as any })
  if (res.data.code === 0) {
    message.success('删除成功')
    router.push('/pictures')
  } else {
    message.error('删除失败')
  }
}

onMounted(() => {
  FetchPictureDetail()
})
</script>

<style scoped>
#pictureDetailPage {
  max-width: 1400px;
  margin: 0 auto;
}

/* === 预览卡片 === */
.preview-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.preview-card :deep(.ant-card-body) {
  padding: var(--space-4);
}

.preview-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.preview-image {
  max-height: 600px;
  object-fit: contain;
}

.preview-image :deep(.ant-image-img) {
  max-height: 600px;
  object-fit: contain;
}

/* === 信息卡片 === */
.info-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  position: sticky;
  top: calc(var(--header-height) + var(--space-6));
}

.info-card :deep(.ant-card-body) {
  padding: var(--space-6);
}

.info-card :deep(.ant-divider) {
  margin: var(--space-4) 0;
  border-color: var(--color-border-light);
}

/* === 作者区域 === */
.author-section {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.author-avatar {
  border: 2px solid var(--color-primary-bg);
}

.author-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
}

.upload-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--space-1);
}

/* === 图片标题 === */
.picture-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  line-height: var(--line-height-tight);
}

.picture-intro {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

/* === 标签分类 === */
.meta-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.meta-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.meta-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  min-width: 40px;
  padding-top: 2px;
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.meta-tag {
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
}

/* === AI 分析区块 === */
.ai-desc {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.ai-desc-text {
  margin: 0;
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

/* === 图片属性 === */
.props-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.prop-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prop-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.prop-value {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

/* === 操作按钮 === */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.action-btn {
  height: 44px;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  transform: translateY(-1px);
}

.download-btn {
  height: 48px;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-md);
  background: var(--gradient-primary);
  border: none;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  transition: all var(--transition-base);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

/* === 响应式 === */
@media (max-width: 768px) {
  .info-card {
    position: static;
  }
}
</style>
