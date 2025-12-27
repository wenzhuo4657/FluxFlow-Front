<script setup lang="ts">
import Banner from '@/page/home/typeDaily/banner.vue'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import StickyNote from './StickyNote/StickyNote.vue'
import { SessionStorage } from '@/constants/storage'
import { watch } from 'vue'
import { EventBus, Events } from '@/envBus/envBus'

const { t } = useI18n()

/**
 *    
 * 
 *    主页显示格式为 
      

      从缓存中获取菜单选择和文档选择

      1, 如果没有，暂时留白
      2，如果仅有菜单选择，调用文档列表组件
      3，如果两者皆存在，尝试调用banner组件，动态渲染文档

      ps： 
      1，如果出错，需要回退
      2，如果仅存在文档id，这是一个错误的情况，不去处理他
    
 */

 const model=ref<number>(0)

onMounted(
  ()=>{
    refresh();
     EventBus.$on(Events.Refresh_Home, refresh)

  }
)

// TODO ,事件总线当中的事件需要重新整理，适应当前ui
// ps ： 关于事件发送，需要注释所需数据，避免先发送事件，后处理数据，导致接受方没有及时获取数据

function refresh(){
  //1,刷新显示model的值
  const typeID=sessionStorage.getItem(SessionStorage.VIEW_TYPE_ID)
  const docsID=sessionStorage.getItem(SessionStorage.VIEW_DOCS_ID)

  // 根据缓存中的值决定显示模式
  if (!typeID && !docsID) {
    // 如果没有，暂时留白
    model.value = 1
  } else if (typeID && !docsID) {
    // 如果仅有菜单选择，调用文档列表组件
    model.value = 2
  } else if (typeID && docsID) {
    // 如果两者皆存在，尝试调用banner组件，动态渲染文档
    model.value = 3
  } else {
    // 如果仅存在文档id（错误情况），留白
    model.value = 1
  }
}


watch(model, () => {
  location.reload
}
)

</script>

<template>

    <div class="any">
    
      <!-- 默认 -->
      <div  v-if="model==1">
          {{t('title')}}
      </div>

      <!-- 渲染文档列表 -->
      <div  v-if="model==2">
           文档列表
      </div>

      <!-- 渲染指定文档内容 -->
       <div  v-if="model==3">
            文档内容
       </div>
  </div>

</template>

<style scoped>
.bar{
  justify-items: center;
  display: grid;
  grid-template-rows:  10vh 10vh;
}

.any{
  display: grid;
  grid-template-rows:  20vh 80vh;
  background: rgb(222, 215, 171);
  justify-items: center;

}
.banner{
  display: block;
  width: 80vw;
  overflow: auto; 
}
</style>

