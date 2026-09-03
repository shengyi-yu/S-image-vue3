<template>
  <div id="chatPage">
    <a-card class="chat-card" :bordered="false">
      <template #title>
        <div class="chat-title">
          <robot-outlined /> AI 智能助手
        </div>
      </template>
      <div class="chat-body" ref="chatBodyRef">
        <div v-if="!messages.length" class="chat-empty">
          <robot-outlined class="empty-icon" />
          <p class="empty-title">你好！我是 AI 助手</p>
          <p class="empty-tips">可以聊天、搜索图片、分析图片</p>
          <p class="empty-tips">试试说："帮我找猫的图片"，或"分析一张图片"</p>
        </div>
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="chat-msg"
          :class="msg.role === 'user' ? 'msg-user' : 'msg-ai'"
        >
          <div class="msg-bubble">
            <template v-if="msg.role === 'user'">{{ msg.content }}</template>
            <template v-else>
              <!-- AI 回复：拆成文本 + 图片片段渲染 -->
              <template v-for="(seg, segIndex) in splitContent(msg.content)" :key="segIndex">
                <span v-if="seg.type === 'text'">{{ seg.value }}</span>
                <div v-else class="msg-image">
                  <a-image :src="seg.value" :width="180" class="msg-image-preview" />
                  <a-button
                    size="small"
                    class="save-btn"
                    :disabled="savedImages.has(seg.value)"
                    @click="doSaveImage(seg.value)"
                  >
                    {{ savedImages.has(seg.value) ? '已存入' : '存入我的空间' }}
                  </a-button>
                </div>
              </template>
            </template>
          </div>
        </div>
        <div v-if="loading" class="chat-msg msg-ai">
          <div class="msg-bubble loading-bubble">
            <a-spin size="small" />&nbsp; 思考中...
          </div>
        </div>
      </div>
      <div class="chat-input">
        <a-input-search
          v-model:value="input"
          placeholder="输入消息，回车发送"
          enter-button="发送"
          size="large"
          @search="doSend"
        />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { RobotOutlined } from '@ant-design/icons-vue'
import { chatUsingPost } from '@/api/aiController'
import { uploadPictureByUrlUsingPost } from '@/api/pictureController'
import { addSpaceUsingPost, listSpaceVoByPageUsingPost } from '@/api/spaceController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

interface ContentSegment {
  type: 'text' | 'image'
  value: string
}

const loginUserStore = useLoginUserStore()
const messages = ref<ChatMessage[]>([])
const input = ref('')
const loading = ref(false)
const chatBodyRef = ref<HTMLElement>()

// 已存入图库的图片 URL（避免重复保存）
const savedImages = reactive(new Set<string>())

// 匹配回复中的图片 URL（jpg/jpeg/png/gif/webp/bmp，含查询参数）
const IMAGE_URL_RE = /(https?:\/\/[^\s"'<>]+?\.(?:jpg|jpeg|png|gif|webp|bmp)(?:\?[^\s"'<>]*)?)/gi

/**
 * 把 AI 回复拆成文本/图片片段，让图片能渲染成缩略图卡片
 */
const splitContent = (content?: string): ContentSegment[] => {
  const text = content ?? ''
  const segments: ContentSegment[] = []
  let lastIndex = 0
  const re = new RegExp(IMAGE_URL_RE.source, 'gi')
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'image', value: match[0] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) })
  }
  return segments.length ? segments : [{ type: 'text', value: text }]
}

/**
 * 把聊天里的图片存入当前用户的私有空间（复用后端的 URL 上传接口，转存到 COS 并自动生成 AI 标签）
 * 规则：每人只有一个私有空间；没有则自动创建一个"我的空间"
 */
const doSaveImage = async (url: string) => {
  try {
    // 1. 查找当前用户的私有空间
    const spaceRes = await listSpaceVoByPageUsingPost({
      userId: loginUserStore.loginUser.id,
      current: 1,
      pageSize: 1,
    })
    let spaceId: number | undefined
    if (spaceRes.data.code === 0 && spaceRes.data.data?.records?.length) {
      spaceId = spaceRes.data.data.records[0].id
    }
    // 2. 没有空间则自动创建（后端限制每人只能创建一个空间）
    if (!spaceId) {
      const addRes = await addSpaceUsingPost({ spaceName: '我的空间', spaceLevel: 0 })
      if (addRes.data.code === 0) {
        spaceId = addRes.data.data
      } else {
        message.error('创建空间失败：' + (addRes.data.message || '未知错误'))
        return
      }
    }
    // 3. 存入私有空间
    const res = await uploadPictureByUrlUsingPost({ fileUrl: url, spaceId })
    if (res.data.code === 0) {
      savedImages.add(url)
      message.success('已存入我的空间')
    } else {
      message.error('存入失败：' + (res.data.message || '未知错误'))
    }
  } catch (e: any) {
    message.error('存入失败：' + (e?.message || '网络错误'))
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
}

const doSend = async () => {
  const text = input.value.trim()
  if (!text || loading.value) {
    return
  }
  messages.value.push({ role: 'user', content: text })
  input.value = ''
  loading.value = true
  scrollToBottom()
  try {
    const res = await chatUsingPost({
      message: text,
      // 用登录用户 id 作为会话 id，保证不同用户的对话相互隔离
      threadId: String(loginUserStore.loginUser.id ?? 'default'),
    })
    if (res.data.code === 0 && res.data.data) {
      messages.value.push({ role: 'ai', content: res.data.data })
    } else {
      messages.value.push({ role: 'ai', content: '出错了：' + (res.data.message || '未知错误') })
    }
  } catch (e: any) {
    messages.value.push({ role: 'ai', content: '请求失败：' + (e?.message || '网络错误') })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
#chatPage {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-4);
  height: calc(100vh - var(--header-height) - var(--space-12));
}

.chat-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-xl);
  background: var(--color-bg-primary);
}

.chat-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  overflow: hidden;
}

.chat-title {
  font-weight: var(--font-weight-semibold);
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.chat-empty {
  text-align: center;
  color: var(--color-text-tertiary);
  margin-top: 12%;
}

.empty-icon {
  font-size: 48px;
  color: var(--color-primary);
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.empty-tips {
  font-size: var(--font-size-sm);
  margin: var(--space-1) 0;
}

.chat-msg {
  display: flex;
}

.msg-user {
  justify-content: flex-end;
}

.msg-ai {
  justify-content: flex-start;
}

.msg-bubble {
  max-width: 75%;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  white-space: pre-wrap;
  word-break: break-word;
}

.msg-user .msg-bubble {
  background: var(--gradient-primary);
  color: #fff;
  border-bottom-right-radius: var(--radius-md);
}

.msg-ai .msg-bubble {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border-bottom-left-radius: var(--radius-md);
}

.loading-bubble {
  color: var(--color-text-tertiary);
}

/* === 消息里的图片卡片 === */
.msg-image {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.msg-image-preview {
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.save-btn {
  font-size: var(--font-size-xs);
}

.chat-input {
  padding-top: var(--space-3);
}
</style>
