<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { EventBus, Events } from '@/envBus/envBus'
import { getAllTypes, TypeData } from '@/services/request'
import { ArrowDown } from '@element-plus/icons-vue'
import { SessionStorage } from '@/constants/storage'

// 组件映射键类型
type ComponentMapKey = 'dailyBase' | 'Plan_I' | 'Plan_II'

const types = ref<TypeData[]>([])


async function fetchTypes() {
  try {
    const list: TypeData[] = await getAllTypes();

    if (Array.isArray(list)) {
      types.value = list;
      // 恢复上次类型选择（仅广播类型，视图由 banner 自行恢复）
      try {
        const saved = String(sessionStorage.getItem(SessionStorage.VIEW_TYPE_ID))
        if (saved) {
          const t = types.value.find(x => x.id === saved)
          if (t) {
            const name = String(t?.name ?? '').toLowerCase()
            const viewMap: Record<string, ComponentMapKey> = {
              dailybase: 'dailyBase',
              checklist: 'Plan_I',
              plan_i: 'Plan_I',
              plan_ii: 'Plan_II'
            }
            const key = viewMap[name] || 'dailyBase'
            EventBus.$emit(Events.Button_type, { id: t.id, key, name: t.name })
          }
        }
      } catch {}
    }
  } catch (err) {
    console.error('Failed to load types:', err)
  }
}

function emitViewByType(t: TypeData) {
  const name = String(t?.name ?? '').toLowerCase()
  const viewMap: Record<string, ComponentMapKey> = {
    dailybase: 'dailyBase',
    checklist: 'Plan_I',
    plan_i: 'Plan_I',
    plan_ii: 'Plan_II',
  }
  const key = viewMap[name] || 'dailyBase'
  EventBus.$emit(Events.Button_view, key)
  EventBus.$emit(Events.Button_type, { id: t.id, key, name: t.name })

  // 确保保存有效的 typeId
  if (t.id !== null && t.id !== undefined) {
    try {
      sessionStorage.setItem(SessionStorage.VIEW_TYPE_ID, String(t.id))
      console.log('Saved typeId:', t.id)
    } catch (e) {
      console.error('Failed to save typeId:', e)
    }
  }
}

function onCommand(cmd: number | string) {
  let target: TypeData | undefined
  const idNum = Number(cmd)
  if (!Number.isNaN(idNum)) {
    target = types.value.find(t => t.id === String(idNum))
  }
  if (!target && typeof cmd === 'string') {
    target = types.value.find(t => t.name === cmd)
  }
  if (target) {
    emitViewByType(target)
  }
}

onMounted(fetchTypes)
</script>

<template>
  <div class="button-view">
    <el-dropdown @command="onCommand">
      <el-button type="success" plain>
        {{ $t('view') }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="it in types"
            :key="it.id"
            :command="it.id"
          >
            {{ it.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  
</template>

<style scoped>
.button-view { display: flex; }
</style>
