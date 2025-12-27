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
 

 function  changedTypeId(target:TypeData){
  sessionStorage.setItem(SessionStorage.VIEW_TYPE_ID, String(target.id))
  
  EventBus.$emit(Events.Refresh_Home,null)

}

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

  <el-scrollbar class="button-view">
         
      
            <el-button
            v-for="it in types"
            :key="it.id"
            class="item"
            @click="onCommand(it.id)"
          >
            {{ it.name }}
          </el-button>
  </el-scrollbar>



       

</template>

<style scoped>
.button-view { 
    height: 100%;
    width: 100%;
}

.item{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 5%;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

</style>
