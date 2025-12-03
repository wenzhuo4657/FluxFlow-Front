<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

import 'highlight.js/styles/github.css'
import {  updateItemByType,addItemByType, getMdByType } from "@/services/request";
import { EventBus, Events } from '@/envBus/envBus'
import ItemViewAndEdit from '@/page/home/components/typeDaily/daily/ItemViewAndEdit.vue';
import {
  Plus
} from '@element-plus/icons-vue'
import { DailyItem } from '@/type/DailyItem';
import Edit from './commponents/Edit.vue';
import Insert from './commponents/Insert.vue';



const items = ref< DailyItem[]>([])
const current = ref<DailyItem | null>(null)
const selectedTypeId = ref<number>(0)
const selectedContentNameId = ref<number>(0)






// 获取远程服务器上的md文档
async function fetchContent() {
  const json = await getMdByType({ docsId: selectedContentNameId.value ?? 0, type: selectedTypeId.value ?? 0 });
  const list = Array.isArray(json) ? json : json.data;
  if (!Array.isArray(list)) throw new Error('返回不是数组或 data 数组')

  items.value = list.map(({ id, title, content }) => ({ id, title, content }))
  current.value = items.value[0] ?? null
}



// vue组件生命周期：组件挂载完成后执
onMounted(() => {
  try {
    const typeSaved = Number(sessionStorage.getItem('view.typeId'))
    if (!Number.isNaN(typeSaved)) selectedTypeId.value = typeSaved
    const cnSaved = Number(sessionStorage.getItem('view.contentNameId'))
    if (!Number.isNaN(cnSaved)) selectedContentNameId.value = cnSaved
  } catch {}
  fetchContent()
})
// vue组件生命周期：在组件实例被卸载之前调用
onBeforeUnmount(() => {

})


function chooseContent(it){
  current.value=it
  
}

function onTypeChanged(payload){
  const id = typeof payload === 'number' ? payload : payload?.id
  if (typeof id === 'number') {
    selectedTypeId.value = id
  }
}
function onContentNameChanged(payload){
  const id = typeof payload === 'number' ? payload : payload?.id
  if (typeof id === 'number') {
    selectedContentNameId.value = id
    fetchContent()
  }
}

onMounted(() => {
  EventBus.$on(Events.Button_type, onTypeChanged)
  EventBus.$on(Events.Button_contentName, onContentNameChanged)
})
onBeforeUnmount(() => {
  EventBus.$off(Events.Button_type, onTypeChanged)
  EventBus.$off(Events.Button_contentName, onContentNameChanged)
})




</script>

<template>
  <div class="split">
   <div class="split_title">
      <Edit></Edit>
      <Insert></Insert>
      <el-button 
          type="success" plain
          v-for="it in items"
          :key="it.id"
          @click="chooseContent(it)"
          >
           <strong>{{ it.title }}</strong>
      </el-button>
    
    </div>
    <div   class="split_content">
      <div v-if="current"  class="editor-wrap">
        <item-view-and-edit  v-model:id="current.id"  v-model:content="current.content"></item-view-and-edit>
      </div>
      <div v-else>
        <em>加载中...</em>
      </div>
    </div>
   
  </div>
</template>

<style scoped>
.split {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;

}

.split_title{
  width: 20%;
   height: 100%;
   display: flex;        
  flex-direction: column; 
  gap: 8px;
  padding-right: 5%;
  overflow: auto; 
}
.split_title > div{
  display: flex;
  flex-direction: row;
}

.split_content {
  display: flex;
  width: 75%;
  height: 100%;

}


.editor-wrap {
  flex: 1;           
}










</style>
