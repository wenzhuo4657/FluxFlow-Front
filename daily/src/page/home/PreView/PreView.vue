<script setup lang="ts">
import { ItemData, today, TodayRes, ContentData, getTypesWithItems } from '@/services/request';
import { computed, onMounted, ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// ==================== 文档关联相关 ====================

/** 可选文档列表 */
const availableDocs = ref<ContentData[]>([])

/** 已选择的文档 ID 列表 */
const selectedDocIds = ref<string[]>([])

/** 已选择的文档对象列表（用于显示） */
const selectedDocs = computed(() => {
  return availableDocs.value.filter(doc => selectedDocIds.value.includes(doc.id))
})

/**
 * 加载文档列表
 */
async function loadDocuments() {
  try {
    const docs: ContentData[] = await getTypesWithItems({ id: "0" })
    availableDocs.value = docs
  } catch (error) {
    console.error("Failed to load documents:", error)
  }
}

// ==================== 数据加载相关 ====================
const base = ref<ItemData[]>([])
const plans = ref<Plan[]>([])

/**
 * Plan 接口 - 定义计划数据结构
 * @property task_ID - 任务ID
 * @property title - 任务标题
 * @property data_end - 截止日期
 * @property content - 任务内容
 * @property connection - 关联的日报条目
 */
interface Plan {
  task_ID: string;
  title: string;
  data_end: string | null;
  content: string;
  connection: string | null | ItemData;
}

onMounted(() => {
  loadData()
  loadDocuments()
})

/**
 * 解析 expand 字符串，将形如 "title:xxx data_end:xxx" 的字符串转换为对象
 * @param expand - expand 字段的原始字符串
 * @returns 解析后的部分 Plan 对象
 */
function parseExpand(expand: string): Partial<Plan> {
  const fields: Partial<Plan> = {};
  if (!expand) return fields;

  const parts = expand.split(' ');
  for (const part of parts) {
    const [key, ...valParts] = part.split(':');
    const value = valParts.join(':');

    if (!key) continue;

    switch (key) {
      case 'title':
        fields.title = value;
        break;
      case 'data_end':
        fields.data_end = value === 'null' ? null : value;
        break;
      case 'connection':
        fields.connection = value === 'null' ? null : value;
        break;
    }
  }
  return fields;
}

/**
 * 将 ItemData 转换为 Plan 对象
 * @param item - 日报条目数据
 * @returns 转换后的 Plan 对象
 */
function convertToPlan(item: ItemData): Plan {
  const parsed = parseExpand(item.expand || '');
  return {
    task_ID: item.index,
    title: parsed.title || item.title || '',
    data_end: parsed.data_end || null,
    content: item.content || '',
    connection: parsed.connection || null
  };
}

/**
 * 加载今日数据
 * 包含基础条目和计划条目，并处理关联关系
 */
async function loadData() {
  try {
    // 1. 获取原始数据
    const data: TodayRes = await today();
    base.value = data.baseItem || [];
    const mappedPlans = data.planItem.map(convertToPlan);

    // 2. 解析关联关系，建立 base 和 plan 的关联
    const usedIds = new Set<string>();
    plans.value = mappedPlans.map(plan => {
      if (typeof plan.connection === 'string') {
        const linkedItem = base.value.find(item => item.index === plan.connection);
        if (linkedItem) {
          usedIds.add(linkedItem.index)
          plan.connection = linkedItem || plan.connection
        }
      }
      return plan;
    });

    // 3. 过滤掉已被关联的 base 条目
    base.value = base.value.filter(item => !usedIds.has(item.index));

  } catch (error) {
    console.error("Failed to load today's data:", error);
  }
}

// ==================== 文档关联选择相关 ====================

/** 输入框内容 */
const content = ref('')

/** 是否显示文档建议弹窗 */
const showSuggestions = ref(false)

/** 是否处于文档选择模式 */
const isSelectingTag = ref(false)

/** el-input 组件引用 */
const inputRef = ref()

/** 虚拟触发器引用，用于定位弹窗位置 */
const suggestionTriggerRef = ref()

/** 当前选中的标签索引（键盘上下键导航用） */
const selectedIndex = ref(0)

/**
 * 获取原生 textarea 元素
 * @returns textarea DOM 元素或 null
 */
const getTextareaElement = (): HTMLTextAreaElement | null => {
  if (!inputRef.value) return null
  return inputRef.value.$el?.querySelector('textarea') || null
}

/**
 * 获取当前光标位置的单词
 * 用于判断是否触发展开文档建议
 * @returns 当前单词和其在文本中的起始位置
 */
const getCurrentWord = () => {
  const textarea = getTextareaElement()
  if (!textarea) return { word: '', index: 0 }

  const cursorPos = textarea.selectionStart
  const beforeText = content.value.slice(0, cursorPos)
  const match = beforeText.match(/\S*$/)

  if (!match || match[0] === '') {
    return { word: '', index: cursorPos }
  }

  // 计算单词的起始位置：光标位置减去匹配的单词长度
  const wordStart = cursorPos - match[0].length
  return { word: match[0], index: wordStart }
}

/**
 * 过滤后的文档列表（根据输入的关键词）
 */
const filteredTags = computed(() => {
  const { word } = getCurrentWord()
  // 只有以 # 开头才触发文档建议
  if (!word.startsWith('#')) return []
  const query = word.slice(1).toLowerCase()
  return availableDocs.value.filter(doc =>
    doc.name.toLowerCase().includes(query) &&
    !selectedDocIds.value.includes(doc.id) // 过滤已选择的文档
  )
})

/**
 * 计算光标在 textarea 中的像素位置
 * 用于正确定位文档建议弹窗
 * @returns 包含 x, y 坐标的对象，失败返回 null
 */
const getCursorPixelPosition = () => {
  const textarea = getTextareaElement()
  if (!textarea) return null

  const { word, index } = getCurrentWord()
  const cursorPos = textarea.selectionStart

  // 创建临时 span 元素来测量文本宽度
  const span = document.createElement('span')
  const textStyle = window.getComputedStyle(textarea)

  // 复制 textarea 的字体样式
  span.style.font = textStyle.font
  span.style.fontSize = textStyle.fontSize
  span.style.fontFamily = textStyle.fontFamily
  span.style.fontWeight = textStyle.fontWeight
  span.style.letterSpacing = textStyle.letterSpacing
  span.style.whiteSpace = 'pre-wrap'
  span.style.position = 'absolute'
  span.style.visibility = 'hidden'
  span.style.top = '0'
  span.style.left = '0'

  // 获取从行首到光标位置的文本
  const textBeforeCursor = content.value.slice(0, index)
  span.textContent = textBeforeCursor

  document.body.appendChild(span)
  const textWidth = span.offsetWidth
  document.body.removeChild(span)

  // 计算位置
  const rect = textarea.getBoundingClientRect()
  const paddingLeft = parseFloat(textStyle.paddingLeft)
  const borderTop = parseFloat(textStyle.borderTopWidth)
  const paddingTop = parseFloat(textStyle.paddingTop)
  const lineHeight = parseFloat(textStyle.lineHeight)
  const scrollTop = textarea.scrollTop

  // 计算当前行号（考虑滚动和换行）
  const lines = textBeforeCursor.split('\n')
  const currentLineIndex = lines.length - 1
  const currentLineText = lines[currentLineIndex]

  // Y 坐标：考虑行号、行高、内边距、边框和滚动
  const y = rect.top + borderTop + paddingTop + (currentLineIndex * lineHeight) - scrollTop

  // X 坐标：当前行文本宽度 + 左内边距
  span.textContent = currentLineText
  document.body.appendChild(span)
  const lineWidth = span.offsetWidth
  document.body.removeChild(span)

  const x = rect.left + paddingLeft + lineWidth

  return { x, y, rect }
}

/**
 * 退出文档选择模式
 */
const exitTagSelection = () => {
  isSelectingTag.value = false
  showSuggestions.value = false
  selectedIndex.value = 0
}

/**
 * 处理键盘事件
 * - # 触发文档建议
 * - 上下键导航选择
 * - Enter/Tab 确认选择
 * - Escape 关闭建议
 * - 空格 退出选择模式
 * @param e - 键盘事件
 */
const handleKeydown = (e: KeyboardEvent) => {
  const { word } = getCurrentWord()

  // 空格键：退出文档选择模式
  if (e.key === ' ' && isSelectingTag.value) {
    exitTagSelection()
    return
  }

  // # 触发建议（仅在非选择模式下，不依赖是否有匹配结果）
  if (!isSelectingTag.value && word.startsWith('#')) {
    const position = getCursorPixelPosition()
    if (position) {
      // 创建虚拟触发器用于定位弹窗
      suggestionTriggerRef.value = {
        getBoundingClientRect: () => ({
          x: position.x,
          y: position.y + parseFloat(window.getComputedStyle(getTextareaElement()!).lineHeight),
          width: 0,
          height: 0,
          top: position.y + parseFloat(window.getComputedStyle(getTextareaElement()!).lineHeight),
          left: position.x,
          right: position.x,
          bottom: position.y + parseFloat(window.getComputedStyle(getTextareaElement()!).lineHeight)
        })
      }
      showSuggestions.value = true
      isSelectingTag.value = true
      selectedIndex.value = 0
    }
  }

  // 上下键选择
  if (showSuggestions.value) {
    if (e.key === 'ArrowDown') {
      selectedIndex.value = (selectedIndex.value + 1) % filteredTags.value.length
      e.preventDefault()
    }
    if (e.key === 'ArrowUp') {
      selectedIndex.value = (selectedIndex.value - 1 + filteredTags.value.length) %
        filteredTags.value.length
      e.preventDefault()
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      selectDoc(filteredTags.value[selectedIndex.value])
      e.preventDefault()
    }
    if (e.key === 'Escape') {
      exitTagSelection()
    }
  }
}

/**
 * 处理输入事件
 * 实时更新文档建议状态
 */
const handleInput = () => {
  const { word } = getCurrentWord()

  // 如果当前单词不再以 # 开头，退出选择模式
  if (!word.startsWith('#')) {
    exitTagSelection()
    return
  }

  // 如果在选择模式下且当前单词以 # 开头，保持建议显示（用于过滤文档）
  // 但不重新计算位置，避免弹窗抖动
  if (isSelectingTag.value && word.startsWith('#')) {
    // 保持弹窗显示，无论是否有匹配结果
    showSuggestions.value = true
  }
}

/**
 * 选择文档并添加到关联列表（限制一次只能选择一个文档）
 * @param doc - 选中的文档对象
 */
const selectDoc = (doc: ContentData) => {
  // 替换已选择的文档（单选模式）
  selectedDocIds.value = [doc.id]

  // 重置选择索引，保持 isSelectingTag 为 true 以支持连续选择
  selectedIndex.value = 0

  // 关闭弹窗（因为单选模式下选择后不需要再选）
  showSuggestions.value = false
  exitTagSelection()

  // 聚焦输入框，保持 # 符号以便继续输入过滤
  nextTick(() => {
    const textarea = getTextareaElement()
    if (textarea) {
      textarea.focus()
    }
  })
}

/**
 * 移除已选择的文档
 * @param docId - 要移除的文档 ID
 */
const removeDoc = (docId: string) => {
  const index = selectedDocIds.value.indexOf(docId)
  if (index > -1) {
    selectedDocIds.value.splice(index, 1)
  }
}

/**
 * 保存内容
 */
const handleSave = () => {
  console.log('保存内容:', content.value)
  console.log('关联文档 ID:', selectedDocIds.value)
  console.log('完整数据:', {
    content: content.value,
    selectedDocIds: selectedDocIds.value
  })
}

/**
 * 格式化日期
 * @param dateStr - 日期字符串
 * @returns 格式化后的日期字符串
 */
const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div class="editor-container">
    <!-- 主输入框区域 -->
    <div class="input-wrapper">
      <el-input
        ref="inputRef"
        v-model="content"
        type="textarea"
        :rows="3"
        :autosize="{ minRows: 3, maxRows: 10 }"
        placeholder="输入内容，输入 # 触发文档关联选择"
        class="main-input"
        @keydown="handleKeydown"
        @input="handleInput"
      />
    </div>

    <!-- 文档建议弹窗 -->
    <el-popover
      v-model:visible="showSuggestions"
      :virtual-ref="suggestionTriggerRef"
      trigger="click"
      virtual-triggering
      placement="bottom-start"
      :show-arrow="false"
      :offset="4"
      popper-class="tag-suggestion-popover"
    >
      <div v-if="filteredTags.length > 0" class="suggestion-list">
        <div
          v-for="(doc, index) in filteredTags"
          :key="doc.id"
          :class="{ 'selected': index === selectedIndex }"
          class="suggestion-item"
          @click="selectDoc(doc)"
          @mouseenter="selectedIndex = index"
        >
          <span class="tag-icon">#</span>
          <span class="tag-name">{{ doc.name }}</span>
        </div>
      </div>
      <div v-else class="no-suggestion">
        暂无匹配的文档
      </div>
    </el-popover>

    <!-- 底部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-content">
        <div class="toolbar-hint">
          <span class="hint-icon">💡</span>
          <span>输入 <kbd>#</kbd> 选择关联文档</span>
        </div>
        <!-- 已选择的文档标签 -->
        <div v-if="selectedDocs.length > 0" class="selected-docs">
          <div
            v-for="doc in selectedDocs"
            :key="doc.id"
            class="doc-tag"
          >
            <span class="doc-tag-name">{{ doc.name }}</span>
            <span class="doc-tag-remove" @click="removeDoc(doc.id)">×</span>
          </div>
        </div>
      </div>
      <el-button type="primary" @click="handleSave">
        保存
      </el-button>
    </div>

    <!-- 数据预览区域 -->
    <div class="preview-section">
      <!-- 基础条目预览 -->
      <div v-if="base.length > 0" class="preview-block">
        <div class="preview-header">
          <h3 class="preview-title">
            <span class="title-icon">📝</span>
            基础条目
            <el-tag size="small" type="info">{{ base.length }}</el-tag>
          </h3>
        </div>
        <div class="preview-grid">
          <el-card
            v-for="item in base"
            :key="item.index"
            class="preview-card base-card"
            shadow="hover"
          >
            <template #header>
              <div class="card-header">
                <span class="card-title">{{ item.title || '无标题' }}</span>
              </div>
            </template>
            <div class="card-content">
              {{ item.content || '无内容' }}
            </div>
          </el-card>
        </div>
      </div>

      <!-- 计划条目预览 -->
      <div v-if="plans.length > 0" class="preview-block">
        <div class="preview-header">
          <h3 class="preview-title">
            <span class="title-icon">📅</span>
            计划条目
            <el-tag size="small" type="success">{{ plans.length }}</el-tag>
          </h3>
        </div>
        <div class="preview-grid">
          <el-card
            v-for="plan in plans"
            :key="plan.task_ID"
            class="preview-card plan-card"
            shadow="hover"
          >
            <template #header>
              <div class="card-header">
                <span class="card-title">{{ plan.title || '无标题' }}</span>
                <el-tag
                  v-if="plan.data_end"
                  size="small"
                  type="warning"
                  effect="plain"
                  class="deadline-tag"
                >
                  截止: {{ formatDate(plan.data_end) }}
                </el-tag>
              </div>
            </template>
            <div class="card-content">
              {{ plan.content || '无内容' }}
            </div>
            <div v-if="plan.connection && typeof plan.connection === 'object'" class="connection-info">
              <div class="connection-label">📎 当日事项</div>
              <div class="connection-text">{{ plan.connection.content || '无内容' }}</div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="base.length === 0 && plans.length === 0" class="empty-state">
        <el-empty description="暂无数据" :image-size="80" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

/* 输入框包装器 */
.input-wrapper {
  position: relative;
}

/* 主输入框样式 */
.main-input {
  width: 100%;
}

.main-input :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  resize: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.main-input :deep(.el-textarea__inner:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
  outline: none;
}

/* 标签建议列表 */
.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.suggestion-item:hover {
  background: #f5f7fa;
}

.suggestion-item.selected {
  background: #409eff;
  color: white;
}

.tag-icon {
  font-size: 12px;
  opacity: 0.7;
}

.tag-name {
  font-size: 13px;
}

.no-suggestion {
  padding: 8px 12px;
  color: #909399;
  font-size: 13px;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 8px;
  border-top: 1px solid #ebeef5;
  gap: 12px;
}

.toolbar-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.toolbar-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #909399;
}

.hint-icon {
  font-size: 14px;
}

.toolbar-hint kbd {
  display: inline-block;
  padding: 2px 6px;
  font-size: 11px;
  font-family: inherit;
  color: #606266;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  box-shadow: 0 1px 0 #dcdfe6;
}

/* 已选择的文档标签 */
.selected-docs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.doc-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  font-size: 12px;
  color: #409eff;
  transition: all 0.2s;
}

.doc-tag:hover {
  background: #d9ecff;
}

.doc-tag-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
  font-size: 16px;
  line-height: 1;
}

.doc-tag-remove:hover {
  background: rgba(64, 158, 255, 0.2);
}

/* 预览区域 */
.preview-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.preview-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-header {
  padding: 0 4px;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.title-icon {
  font-size: 18px;
}

/* 预览网格布局 */
.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .preview-grid {
    grid-template-columns: 1fr;
  }
}

/* 卡片样式 */
.preview-card {
  transition: all 0.3s ease;
}

.preview-card:hover {
  transform: translateY(-2px);
}

.preview-card :deep(.el-card__header) {
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.preview-card :deep(.el-card__body) {
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.card-content {
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 120px;
  overflow-y: auto;
}

/* 滚动条样式 */
.card-content::-webkit-scrollbar {
  width: 4px;
}

.card-content::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 2px;
}

.card-content::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.card-content::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}

/* 基础卡片特定样式 */
.base-card :deep(.el-card__header) {
  background: linear-gradient(to right, #f0f9ff, #fafafa);
  border-left: 3px solid #409eff;
}

/* 计划卡片特定样式 */
.plan-card :deep(.el-card__header) {
  background: linear-gradient(to right, #f0f9ff, #fafafa);
  border-left: 3px solid #67c23a;
}

.deadline-tag {
  flex-shrink: 0;
}

/* 关联信息 */
.connection-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #dcdfe6;
}

.connection-label {
  font-size: 12px;
  font-weight: 600;
  color: #909399;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: block;
}

.connection-text {
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
  white-space: pre-wrap;
  word-break: break-word;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  border-left: 2px solid #409eff;
  max-height: 120px;
  overflow-y: auto;
}

/* 关联内容滚动条样式 */
.connection-text::-webkit-scrollbar {
  width: 4px;
}

.connection-text::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 2px;
}

.connection-text::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.connection-text::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}

/* 空状态 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}
</style>
