<script setup lang="ts">
import Banner from '@/page/home/typeDaily/banner.vue'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import StickyNote from './StickyNote/StickyNote.vue'
import { SessionStorage } from '@/constants/storage'
import { watch } from 'vue'
import { EventBus, Events } from '@/envBus/envBus'
import DocsList from './DocsListView/DocsList.vue'
import Configuration from './Configuration/Configuration.vue'
import Index from './index/index.vue'



const { t } = useI18n()


 const model=ref<number>(0)

onMounted(
  ()=>{
    refresh(1);
     EventBus.$on(Events.Refresh_Home, refresh)

  }
)


function refresh(newval: number){
  console.log(newval)
  model.value=newval
}


watch(model, () => {
  location.reload
}
)

</script>

<template>
      <StickyNote></StickyNote>
    <div class="any">

    
      <!-- 默认 -->
      <div  v-if="model==1">
         <Index></Index>
      </div>

      <!-- 渲染文档列表 -->
      <div  v-if="model==2">
        <DocsList></DocsList>
      </div>

      <!-- 渲染指定文档内容 -->
       <div  v-if="model==3">
            <Banner></Banner>
       </div>

       <!-- 渲染预览 -->
        <div v-if="model==4">
            渲染预览
        </div>

       <!-- 渲染配置 -->
        <div v-if="model==5">
          <Configuration></Configuration>
        </div>

  </div>

</template>

<style scoped>


.any{
  height: 100%;
  width: 100%;
}

.any > div{
  height: 100%;
  width: 100%;
}

</style>

