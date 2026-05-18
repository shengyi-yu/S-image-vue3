<template>
  <div class="picture-upload">
    <a-upload
    list-type="picture-card"
    :show-upload-list="false"
    :customRequest="handleUpload"
    :before-upload="beforeUpload"
    >
    <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">点击或拖拽上传图片</div>
    </div>
  </a-upload>
  </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { uploadPictureUsingPost } from '@/api/pictureController'

interface Props {
  picture?: API.PictureVO
  spaceId?: string | number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()


const loading = ref<boolean>(false)

// 上传图片
const handleUpload = async ({ file }: any) => {
  loading.value = true
  const params: API.PictureUploadRequest = props.picture ? { id: props.picture.id} : { }
  params.spaceId = props.spaceId
  const res = await uploadPictureUsingPost(params, { }, file)
  if(res.data.code === 0 && res.data.data){
    message.success('上传成功')
    props.onSuccess?.(res.data.data)
  } else {
    message.error('上传失败,' + res.data.message)
  }
  loading.value = false
}

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  // 校验图片格式
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
  if (!isJpgOrPng) {
    message.error('图片上传格式错误，推荐使用jpg，webp 或 png 格式')
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片上传大小不能超过2M')
  }
  return isJpgOrPng && isLt2M
}
</script>
<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-width: 152px;
  min-height: 152px;
}

.picture-upload img{
  max-width: 100%;
  max-height: 480px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
