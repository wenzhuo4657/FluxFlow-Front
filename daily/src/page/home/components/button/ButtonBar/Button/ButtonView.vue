<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { EventBus, Events } from '@/envBus/envBus'
import { getAllTypes, TypeData } from '@/services/request'
import { ArrowDown } from '@element-plus/icons-vue'
import { SessionStorage } from '@/constants/storage'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// 组件映射键类型

const types = ref<TypeData[]>([])
const label = ref<string>(t('view'))
 

 function  changedTypeId(target:TypeData){
  label.value=target.name
  EventBus.$emit(Events.Button_type, target.id)//通知类型发生变化
  EventBus.$emit(Events.Button_view,target.name)//通知视图发生变化
  sessionStorage.setItem(SessionStorage.VIEW_TYPE_ID, String(target.id))
}

async function fetchTypes() {
  try {
    const list: TypeData[] = await getAllTypes();
    changedTypeId(list[0])

    if (Array.isArray(list)) {
      types.value = list;
      
      // 恢复上次类型选择（仅广播类型，视图由 banner 自行恢复）
      try {
        const saved = String(sessionStorage.getItem(SessionStorage.VIEW_TYPE_ID))
        if (saved) {
          const t = types.value.find(x => x.id === saved)
          if (t) {
            changedTypeId(t)
          }
        }
      } catch {}
    }
  } catch (err) {
    console.error('Failed to load types:', err)
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
    changedTypeId(target)
  }
}

onMounted(()=>{
  fetchTypes()
})
</script>

<template>
  <div class="button-view">
    <el-dropdown @command="onCommand">
      <el-button type="success" plain>
        {{ label }}
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
