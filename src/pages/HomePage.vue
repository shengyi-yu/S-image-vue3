<template>
  <div id="homePage">
    <!-- 搜索区域 -->
    <div class="search-section">
      <h1 class="search-title">发现精彩图片</h1>
      <p class="search-subtitle">海量高清图片，免费下载使用</p>
      <div class="search-bar">
        <a-input-search
          placeholder="搜索图片名称、分类、标签..."
          v-model:value="searchParams.searchText"
          enter-button="搜索"
          size="large"
          @search="doSearch"
        />
      </div>
    </div>

    <!-- 分类 + 标签 -->
    <div class="filter-section">
      <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
        <a-tab-pane key="all" tab="全部" />
        <a-tab-pane
          v-for="category in categoryList"
          :key="category"
          :tab="category"
        />
      </a-tabs>
      <div class="tag-bar">
        <span class="tag-label">标签：</span>
        <a-space :size="[0, 8]" wrap>
          <a-checkable-tag
            v-for="(tag, index) in tagList"
            :key="tag"
            v-model:checked="selectedTagList[index]"
            class="tag-item"
            @change="doSearch"
          >
            {{ tag }}
          </a-checkable-tag>
        </a-space>
      </div>
    </div>

    <!-- 图片列表 -->
    <a-list
      style="width: 100%"
      :grid="{ gutter: 20, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }"
      :data-source="dataList"
      :pagination="pagination"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <a-card
            hoverable
            class="picture-card"
            @click="doClickPicture(picture)"
          >
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
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { computed, onMounted, reactive, onActivated } from 'vue'

// 数据
const dataList = ref([])
const total = ref(0)
const loading = ref(true)
const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<string[]>([])

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
  } else {
    message.error('加载分类标签失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    onChange: (page: number, pageSize: number) => {
      searchParams.current = page
      searchParams.pageSize = pageSize
      fetchData()
    },
  }
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  const params = {
    ...searchParams,
    tags: [] as string[],
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

const router = useRouter()

const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

// 页面加载时请求一次
onMounted(() => {
  getTagCategoryOptions()
  fetchData()
})

// 页面被激活（返回、切回来）时重新加载
onActivated(() => {
  fetchData()
})
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
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-xs);
  border: 1px solid var(--color-border-light);
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

.picture-card :deep(.ant-card-body) {
  padding: var(--space-3) var(--space-4);
}

.picture-card :deep(.ant-card-cover) {
  margin: 0;
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
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 50%
  );
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
</style>
