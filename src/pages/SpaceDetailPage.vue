<template>
  <div id="spaceDetailPage">
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2 class="space-heading">{{ space.spaceName }}（私有空间）</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank">
          + 创建图片
        </a-button>
        <a-tooltip
          :title="`占用空间 ${formatSize(Math.max(0, space.totalSize ?? 0))} / ${formatSize(space.maxSize)}`"
        >
          <a-progress
            class="space-progress"
            type="circle"
            :percent="Math.min(100, Math.max(0, (space.totalSize * 100) / space.maxSize)).toFixed(1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>

    <div style="margin-bottom: 16px;"></div>
    <!-- 图片列表 -->
    <PictureList :dataList="dataList" :loading="loading" showOp :onReload="fetchData" />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
      @change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { getSpaceVoByIdUsingGet } from '@/api/spaceController'
import { listPictureVoByPageUsingPost } from '@/api/pictureController'
import { formatSize } from '@/utils'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import PictureList from '@/components/PictureList.vue'

const props = defineProps<{
  id: string | number
}>()
const space = ref<API.SpaceVO>({})

// 获取空间详情
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情失败：' + e.message)
  }
}

onMounted(() => {
  fetchSpaceDetail()
})

// 数据
const dataList = ref([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const onPageChange = (page, pageSize) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams,
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#spaceDetailPage {
  max-width: 1400px;
  margin: 0 auto;
  color: var(--color-text-primary);
}

.space-heading {
  color: var(--color-text-primary);
  margin: 0;
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
.space-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  line-height: var(--line-height-tight);
}

.space-intro {
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

/* === 暗色主题 === */
[data-theme="dark"] #spaceDetailPage {
  color: #e5e5e5;
}

[data-theme="dark"] .space-heading {
  color: #e5e5e5;
}

[data-theme="dark"] .ant-pagination {
  color: #abb2bf;
}

[data-theme="dark"] .ant-pagination-item a {
  color: #abb2bf;
}

[data-theme="dark"] .ant-pagination-item-active {
  background: rgba(97, 175, 239, 0.2);
  border-color: #61afef;
}

[data-theme="dark"] .ant-tooltip-inner {
  color: #e5e5e5;
}

[data-theme="dark"] .ant-tooltip-arrow-content {
  background-color: rgba(0, 0, 0, 0.85);
}

[data-theme="dark"] .ant-progress-circle .ant-progress-text {
  color: #e5e5e5 !important;
  fill: #e5e5e5 !important;
}

[data-theme="dark"] .ant-progress-circle svg text {
  fill: #e5e5e5 !important;
}

[data-theme="dark"] .ant-progress-text {
  color: #e5e5e5 !important;
}

[data-theme="dark"] .space-progress :deep(.ant-progress-text) {
  color: #e5e5e5 !important;
}

[data-theme="dark"] .space-progress :deep(svg text) {
  fill: #e5e5e5 !important;
}
</style>
