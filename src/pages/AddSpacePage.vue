<template>
  <div id="addSpacePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '修改空间' : '创建空间' }}
    </h2>

    <!-- 空间信息表单 -->
    <a-form name="basic" layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item name="spaceName" label="空间名称">
        <a-input v-model:value="spaceForm.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item label="空间级别" name="spaceLevel">
        <a-select
          v-model:value="spaceForm.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请输入空间级别"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading" style="width: 100%"
          >提交</a-button
        >
      </a-form-item>
    </a-form>
    <!-- 空间级别介绍 -->
    <a-card title="空间级别介绍">
      <a-typography-paragraph>
        * 目前仅支持开通普通版，如需升级空间，请联系管理员
        <a-typography-text code>laning77@163.com</a-typography-text>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
        {{ spaceLevel.text }}： 大小 {{ formatSize(spaceLevel.maxSize) }}， 数量
        {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  addSpaceUsingPost,
  editSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost,
} from '@/api/spaceController'
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { SPACE_LEVEL_OPTIONS } from '@/constants/space'
import { formatSize } from '@/utils'

const router = useRouter()

const space = ref<API.SpaceVO>()
const loading = ref(false)

const spaceForm = reactive<API.SpaceAddRequest | API.SpaceEditRequest>({})

const spaceLevelList = ref<API.SpaceLevel[]>([])
// 提交表单
const handleSubmit = async (values: any) => {
  try {
    const spaceId = space.value?.id
    loading.value = true
    let res
    if(spaceId){
      // 更新操作
      res = await updateSpaceUsingPost({
        id: spaceId,
        ...spaceForm,
      })
    } else{
      // 创建操作
      res = await addSpaceUsingPost({
        ...spaceForm,
      })
    }
    // 操作成功
    if (res.data.code === 0 && res.data.data) {
      message.success('操作成功')
      router.push({
        path: `/space/${res.data.data}`,
      })
    } else {
      message.error('操作失败' + res.data.message)
    }
  } catch (e) {
    message.error('操作失败' + (e as Error).message)
  }
  loading.value = false
}

const route = useRoute()

// 获取老数据
const getOldSpace = async () => {
  // 获取数据
  const id = route.query?.id as string
  if (id) {
    const res = await getSpaceVoByIdUsingGet({
      id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      space.value = data
      spaceForm.spaceName = data.spaceName
      spaceForm.spaceLevel = data.spaceLevel
    }
  }
}

// 获取空间级别列表
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else{
    message.error('获取空间级别列表失败' + res.data.message)
  }
}

onMounted(() => {
  getOldSpace()
  fetchSpaceLevelList()
})
</script>

<style scoped>
#addSpacePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
