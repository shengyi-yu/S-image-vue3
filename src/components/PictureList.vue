<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-list
      style="width: 100%"
      :grid="{ gutter: 20, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <a-card hoverable class="picture-card" @click="doClickPicture(picture)">
            <template #cover>
              <div class="img-wrapper">
                <img
                  :alt="picture.name"
                  :src="picture.thumbnailUrl ?? picture.url"
                  class="img-cover"
                />
                <div class="img-overlay">
                  <div class="overlay-content">
                    <span class="overlay-title">{{ picture.name }}</span>
                    <span class="overlay-action">查看详情</span>
                  </div>
                </div>
              </div>
            </template>
            <a-card-meta>
              <template #title>
                <span class="card-title">{{ picture.name }}</span>
              </template>
              <template #description>
                <div class="card-tags">
                  <a-tag v-if="picture.category" color="blue" class="category-tag">
                    {{ picture.category }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags?.slice(0, 2)" :key="tag" class="tag">
                    {{ tag }}
                  </a-tag>
                  <!-- AI 生成的标签 -->
                  <a-tag
                    v-for="tag in picture.aiTags?.slice(0, 2)"
                    :key="'ai-' + tag"
                    color="purple"
                    class="tag ai-tag"
                  >
                    ✨ {{ tag }}
                  </a-tag>
                </div>
              </template>
            </a-card-meta>
            <div v-if="showOp" class="card-actions">
              <a-space @click.stop="doEdit(picture, $event)">
                <edit-outlined />
                编辑
              </a-space>
              <a-space @click.stop="doDelete(picture, $event)">
                <delete-outlined />
                删除
              </a-space>
            </div>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
})

const router = useRouter()

// 编辑
const doEdit = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  router.push({
    path: '/add_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

// 删除
const doDelete = async (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 让外层刷新
    props?.onReload?.()
  } else {
    message.error('删除失败')
  }
}

const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
</script>

<style scoped>
#homePage {
  margin-bottom: var(--space-6);
}

/* === 搜索区域 === */
.search-section {
  text-align: center;
  padding: var(--space-10) 0 var(--space-8);
}

.search-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
}

/* 暗色标题用白色 */
[data-theme='dark'] .search-title {
  color: #ffffff;
}

.search-subtitle {
  font-size: var(--font-size-md);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-6);
}

.search-bar {
  max-width: 560px;
  margin: 0 auto;
}

.search-bar :deep(.ant-input-search) {
  border-radius: var(--radius-lg) !important;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
  transition: all var(--transition-base);
}

.search-bar :deep(.ant-input-search:focus-within) {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glass);
}

.search-bar :deep(.ant-input) {
  height: 48px;
  font-size: var(--font-size-md);
  padding-left: var(--space-4);
}

.search-bar :deep(.ant-input-search-button) {
  height: 48px;
  width: 80px;
  font-size: var(--font-size-md);
}

/* === 筛选区域 === */
.filter-section {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-xs);
  border: 1px solid var(--color-border-light);
}

/* 暗色主题筛选栏：#21252b 层级 */
[data-theme='dark'] .filter-section {
  background: #21252b;
  border-color: #3e4451;
}

.filter-section :deep(.ant-tabs-nav) {
  margin-bottom: var(--space-3);
}

.filter-section :deep(.ant-tabs-tab) {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.filter-section :deep(.ant-tabs-tab:hover) {
  background: var(--color-primary-bg);
}

.filter-section :deep(.ant-tabs-tab-active) {
  background: var(--color-primary-bg);
  font-weight: var(--font-weight-medium);
}

.tag-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.tag-item {
  border-radius: var(--radius-full) !important;
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

/* 暗色主题标签 */
[data-theme='dark'] .tag-item {
  background: #3e4451;
  border-color: #3e4451;
  color: #abb2bf;
}

[data-theme='dark'] .tag-item:hover {
  background: #3e4451;
  color: #abb2bf;
}

[data-theme='dark'] .tag-item.ant-tag-checkable-checked {
  background: #61afef;
  border-color: #61afef;
  color: #ffffff;
}

.tag-item:hover {
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

/* === 图片卡片 === */
.picture-card {
  border-radius: var(--radius-lg) !important;
  overflow: hidden;
  transition: all var(--transition-base);
}

.picture-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 暗色卡片：#282c34 层级 */
[data-theme='dark'] .picture-card {
  background: #282c34;
  border-color: #3e4451;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

[data-theme='dark'] .picture-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}

[data-theme='dark'] .card-title {
  color: #ffffff;
}

.picture-card :deep(.ant-card-body) {
  padding: var(--space-3) var(--space-4);
}

.picture-card :deep(.ant-card-cover) {
  margin: 0;
}

/* 列表项 flex 等高 */
:deep(.ant-list-item) {
  display: flex;
  align-items: stretch;
}

:deep(.ant-list-item .ant-card) {
  flex: 1;
}

.img-wrapper {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.img-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.picture-card:hover .img-cover {
  transform: scale(1.05);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.picture-card:hover .img-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  padding: var(--space-4);
  width: 100%;
}

.overlay-title {
  color: #fff;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  display: block;
  margin-bottom: var(--space-1);
}

.overlay-action {
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-sm);
}

/* === 卡片内容 === */
.card-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.category-tag {
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
}

.tag {
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
}

/* === 卡片操作按钮 === */
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-light);
}

.card-actions .ant-space {
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.card-actions .ant-space:hover {
  color: var(--color-primary);
}

.card-actions .ant-space:last-child:hover {
  color: #ff4d4f;
}
</style>
