<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EventBus, Events } from '@/envBus/envBus'
import { getTypesWithItems } from '@/services/request'
import type { ContentNameDto } from '@/type/ContentNameDto'
import { ArrowDown } from '@element-plus/icons-vue'

const STORAGE_TYPE_ID = 'view.typeId'
const STORAGE_CN_ID = 'view.contentNameId'

const items = ref<ContentNameDto[]>([])
const label = ref<string>('选择内容')
const currentTypeId = ref<string | null>(null)

async function loadByTypeId(typeId: string) {
  // 验证 typeId 是否有效
  if (!typeId || typeId === 'null' || typeId === 'undefined') {
    console.log('Invalid typeId, skipping API call:', typeId)
    return
  }

  console.log('Loading content for typeId:', typeId)

  try {
    const json = await getTypesWithItems({id: typeId})
    const list = Array.isArray(json) ? json : json?.data
    if (Array.isArray(list)) {
      items.value = list as ContentNameDto[]
      // 重置展示文案
      label.value = '选择内容'
      // 恢复上次内容选择（如果兼容当前类型）
      try {
        const saved = Number(sessionStorage.getItem(STORAGE_CN_ID))
        if (!Number.isNaN(saved)) {
          const target = items.value.find(it => it.id === saved)
          if (target) {
            label.value = target.name
            EventBus.$emit(Events.Button_contentName, { id: target.id, name: target.name })
          }
        }
      } catch {}
    } else {
      items.value = []
    }
  } catch (e) {
    console.error('Failed to load content names:', e)
    items.value = []
  }
}

function onTypeChanged(payload: { id: number; key?: string; name?: string } | number) {
  const typeId = typeof payload === 'number' ? payload : payload?.id

  // 验证 typeId 是否有效
  if (!typeId && typeId !== 0) {
    console.log('Invalid typeId in onTypeChanged:', typeId)
    return
  }

  const typeIdStr = String(typeId)
  console.log('Type changed, new typeId:', typeIdStr)

  // 只需要修改 currentTypeId，watch 会自动调用 loadByTypeId
  currentTypeId.value = typeIdStr
}

function onCommand(cmd: number | string) {
  const idNum = Number(cmd)
  let target = items.value.find(it => it.id === idNum)
  if (!target && typeof cmd === 'string') {
    target = items.value.find(it => it.name === cmd)
  }
  if (target) {
    label.value = target.name
    EventBus.$emit(Events.Button_contentName, { id: target.id, name: target.name })
    try { sessionStorage.setItem(STORAGE_CN_ID, String(target.id)) } catch {}
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
  EventBus.$on(Events.Button_type, onTypeChanged)
  // 首次进入时尝试根据已保存的类型立即加载
  try {
    const savedType = sessionStorage.getItem(STORAGE_TYPE_ID)

    if (savedType && savedType !== 'null' && savedType !== 'undefined') {
      console.log('Restoring saved typeId:', savedType)
      currentTypeId.value = savedType
      // 注意：这里不需要手动调用 loadByTypeId，因为 watch 会自动触发
    } else {
      console.log('No valid saved typeId found')
    }
  } catch (e) {
    console.error('Failed to restore saved type:', e)
  }
})
onBeforeUnmount(() => {
  EventBus.$off(Events.Button_type, onTypeChanged)
})
</script>

<template>
  <div class="button-content-name">
    <el-dropdown @command="onCommand">
      <el-button type="success" plain>
        {{ label }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="it in items" :key="it.id" :command="it.id">
            {{ it.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.button-content-name { display: flex; }
</style>
