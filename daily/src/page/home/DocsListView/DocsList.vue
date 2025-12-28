<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EventBus, Events } from '@/envBus/envBus'
import { getTypesWithItems, ContentData } from '@/services/request'

import { ArrowDown } from '@element-plus/icons-vue'
import { SessionStorage } from '@/constants/storage'

// 功能内容

const items = ref<ContentData[]>([])
const label = ref<string>('选择内容')
const currentTypeId = ref<string >('')



 
//处理文档id变更之后的行为
function changedDocsID(target:ContentData){
  label.value=target.name
  sessionStorage.setItem(SessionStorage.VIEW_DOCS_ID,target.id)
}




  // 调用api获取当前用户在当前类型下的文档集合,并变更响应变量
async function loadByTypeId(typeId: string) {
  // 验证 typeId 是否有效
  if (!typeId || typeId === 'null' || typeId === 'undefined') {
    console.log('Invalid typeId, skipping API call:', typeId)
    return
  }

  console.log('Loading content for typeId:', typeId)

  try {
      const list:ContentData[] = await getTypesWithItems({ id: typeId })
      items.value = list

      // 重置展示文案
      label.value = '选择内容'
      try {
        const saved = String(sessionStorage.getItem(SessionStorage.VIEW_DOCS_ID) || '')
        // 如果存在缓存，则恢复上次内容选择（如果兼容当前类型）
        if (saved && saved !== 'null' && saved !== 'undefined') {
          const target = items.value.find(it => it.id === saved)
          if (target) {
            changedDocsID(target)
      
          }
        }else{
          // 没有缓存，默认选择第一个元素
          changedDocsID(items.value[0])
        }
      } catch {

      }
 
  } catch (e) {
    console.error('Failed to load content names:', e)
    items.value = []
  }
}





// 监听 currentTypeId 变化，自动加载内容
watch(currentTypeId, (newTypeId, oldTypeId) => {
  if (newTypeId && newTypeId !== oldTypeId) {
    console.log('currentTypeId changed from', oldTypeId, 'to', newTypeId)
    loadByTypeId(newTypeId)
  }
})

onMounted(() => {
  EventBus.$on(Events.Refresh_type, onTypeChanged)
})


onBeforeUnmount(() => {
  EventBus.$off(Events.Refresh_type, onTypeChanged)
})

// 接收type变更的函数
function onTypeChanged(payload:  string) {
  const typeId = typeof payload === 'string' ? payload : 'null'

  // 验证 typeId 是否有效
  if (!typeId || typeId === 'null' || typeId === 'undefined') {
    console.log('Invalid typeId in onTypeChanged:', typeId)
    return
  }

  console.log('Type changed, new typeId:', typeId)

  // 只需要修改 currentTypeId，watch 会自动调用 loadByTypeId
  currentTypeId.value = typeId
}


// 下拉列表的点击函数
function onCommand(cmd: number | string) {
  let target: ContentData | undefined
  const idStr = String(cmd)
  target = items.value.find(it => it.id === idStr)
  if (!target && typeof cmd === 'string') {
    target = items.value.find(it => it.name === cmd)
  }
  if (target) {
    changedDocsID(target)
    // 用户手动点击时，才切换到 Banner 视图
    EventBus.$emit(Events.Refresh_Home, 3)
  }
}
</script>

<template>

      <el-scrollbar class="button-view">
            <div class="container">
            <el-button
            v-for="it in items"
            :key="it.id"
            class="item"
            @click="onCommand(it.id)"
          >
            {{ it.name }}
          </el-button>
          </div>
  </el-scrollbar>

</template>

<style scoped>

.button-view {
  height: 100%;
  width: 100%;
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
}

.item {
  width: 80px;
  height: 120px;
}
</style>
