<script setup lang="ts">
import { SessionStorage } from '@/constants/storage';
import { EventBus } from '@/envBus/envBus';
import { addItemByType, getMdByType, ItemData } from '@/services/request';
import { GetItemsRequest } from '@/type/requestDto/GetItemsRequest';
import { InsertItemRequest } from '@/type/requestDto/InsertItemRequest';
import { ref, watch, onMounted, onUnmounted, onBeforeMount, computed } from 'vue';
import ItemViewAndEdit from './ItemViewAndEdit.vue';




// 文档id
const docsId = ref<string>(String(sessionStorage.getItem(SessionStorage.VIEW_DOCS_ID) || ''))
// 文档内容
const res = ref<ItemData[]>([])
// 当前渲染的文档item
const current=ref<ItemData>()

onMounted(() => {
  EventBus.$on(SessionStorage.VIEW_DOCS_ID, dynamicDocsId)
  loadDocsId(docsId.value)
})

onUnmounted(() => {
  EventBus.$off(SessionStorage.VIEW_DOCS_ID, dynamicDocsId)
  
})

/**
 *  和EventBus配合,动态更新docsId，
 */
function dynamicDocsId(newDocsId: string) {
  docsId.value = newDocsId
}


/**
 * 监听docsId变化，调用渲染函数
 */
watch(docsId, async (newDocsId, oldDocsId) => {
  loadDocsId(newDocsId)


})


// 根据文档id加载渲染内容res
async function loadDocsId(id:string){

  const typeId = sessionStorage.getItem(SessionStorage.VIEW_TYPE_ID) || '';
  if (typeId == '') {
    alert("请选择文档")
    return
  }
  const data: GetItemsRequest = { docsId: id, type: typeId };
  const result = await getMdByType(data);
  res.value = result;
  current.value=res.value[0]

}



/**
 * 变更current的函数
 */
function chooseItem(item:ItemData){
  current.value=item
}

async function InsertItem(){
  
  const typeId = sessionStorage.getItem(SessionStorage.VIEW_TYPE_ID) || '';
  const data:InsertItemRequest={ docsId:docsId.value,type:typeId}
  const res=await addItemByType(data);
  if(res==true){
     location.reload() 
  }else{
     alert("异常错误")
  }

}


/**
 * 计算逆序的res，用于排序
 */
const reversedRes = computed(() => {
  return [...res.value].reverse()
})



</script>

<template>
  <div  class="split">
    <!-- 左右分栏，左侧功能按钮，右侧渲染内容 -->
      <div class="split_title">
        <!-- 按扭区 -->
        <!-- 1，新增 -->
      <button 
          @click="InsertItem"
          class="button-reset">
        新增</button>
     

    

        <!-- title区：选择item，交给编辑区域，默认为最新 -->
      <button
        v-for="it in reversedRes"
        :key="it.index"
        @click="chooseItem(it)"
        :class="{ 'selector': current && current.index === it.index }"
      >
      
        <strong >{{ it.title }}</strong>
      </button>
    


      </div>
      <div   class="split_content">
        <!-- 引入外部组件进行编辑和渲染，将item交给他 -->
        <div v-if="current"  class="editor-wrap">
          <ItemViewAndEdit  v-model:item="current"></ItemViewAndEdit>
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

.selector{
  background-color: bisque;

}








</style>
