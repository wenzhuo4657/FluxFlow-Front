<script setup lang="ts">
    import { onMounted, ref, watch, onUnmounted } from 'vue'
    import NoteWindow from '@/page/home/components/content/window.vue'
import { ContentData, ItemData, getMdByType, getTypesWithItems, addItemByType, updateItemByType } from '@/services/request'
import { GetItemsRequest } from '@/services/request'
import { GetContentIdsByTypesRequest, InsertItemRequest, UpdateItemRequest } from '@/services/request'
    // 便签窗口状态
const showNoteWindow = ref(true)
const type = ref<string>('3')
const noteContent = ref(`你好`)


// 自动保存相关变量
let saveTimer: NodeJS.Timeout | null = null
const lastSavedContent = ref<string>('')

// 监听noteContent变化，实现自动保存
watch(noteContent, (newContent) => {
  // 如果内容没有变化，不执行保存
  if (newContent === lastSavedContent.value) {
    return
  }

  // 清除之前的定时器
  if (saveTimer) {
    clearTimeout(saveTimer)
  }

  // 设置新的定时器，1秒后保存
  saveTimer = setTimeout(() => {
    saveNoteContent(newContent)
  }, 1000)
}, { deep: true })

// 保存便签内容
const saveNoteContent = async (content: string) => {
  if (!currentItemIndex) {
    console.warn('没有当前便签ID，无法保存')
    return
  }

  try {
    const updateData: UpdateItemRequest = {
      index: currentItemIndex,
      content: content
    }

    const result = await updateItemByType(updateData)
    if (result) {
      lastSavedContent.value = content
      console.log('便签保存成功')
    } else {
      console.error('便签保存失败')
    }
  } catch (error) {
    console.error('保存便签时出错:', error)
  }
}

// 组件卸载时清理定时器并保存当前内容
onUnmounted(() => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }

  // 如果有未保存的内容，立即保存
  if (noteContent.value !== lastSavedContent.value && currentItemIndex) {
    saveNoteContent(noteContent.value)
  }
})




// item获取， 只修改唯一item，缺少时自动添加
let currentItemIndex: string | null = null

onMounted(async () => {
  try {
    // 1. 获取docsId
    const data: GetContentIdsByTypesRequest = { id: type.value }
    const res: ContentData[] = await getTypesWithItems(data)

    if (!res || res.length === 0) {
      console.warn('未找到对应的文档类型')
      return
    }

    const docsId = res[0].id
    console.log('获取到文档ID:', docsId)

    // 2. 获取该文档下的所有便签条目
    const getItemsData: GetItemsRequest = {
      docsId: docsId,
      type: type.value
    }

    const items: ItemData[] = await getMdByType(getItemsData)

    if (items && items.length > 0) {
      // 获取第一个便签的内容
      currentItemIndex = items[0].index
      noteContent.value = items[0].content || `# 便签内容

点击右上角的编辑按钮开始编辑...

## 功能特点
- 📝 支持 Markdown 语法
- 🔄 实时保存
- 🎨 美观界面`
      console.log('已加载便签内容，ID:', currentItemIndex)
    } else {
      // 如果没有便签条目，创建一个新的
      const insertData: InsertItemRequest = {
        docsId: docsId,
        type: type.value
      }

      const insertResult = await addItemByType(insertData)
      if (insertResult) {
        // 重新获取刚创建的条目
        const newItems: ItemData[] = await getMdByType(getItemsData)
        if (newItems && newItems.length > 0) {
          currentItemIndex = newItems[0].index
          noteContent.value = newItems[0].content || `# 新建便签

这是你的第一个便签！

点击编辑按钮开始编写内容...`
          console.log('已创建新便签，ID:', currentItemIndex)
        }
      }
    }
  } catch (error) {
    console.error('初始化便签失败:', error)
    // 设置默认内容
    noteContent.value = `# 便签加载失败

请检查网络连接或稍后重试。`
  }
})
</script>

<template>

<div>
       <!-- 便签窗口 -->

        <NoteWindow
          v-if="showNoteWindow"
          v-model:content="noteContent"
          title="Sticky note"
          @close="showNoteWindow = false"
        />
</div>

</template>
