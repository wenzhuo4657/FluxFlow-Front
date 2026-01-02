<script setup lang="ts">
import dailyBanner from '@/page/home/typeDaily/daily/dailyBanner.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { SessionStorage } from '@/constants/storage';
import { useI18n } from 'vue-i18n'
import { getBackgroundUrl } from '@/services/request';
import { watch } from 'vue';
import { useCounterStore } from '@/storage/DocsView';


const store = useCounterStore();

// 定义索引值
type ComponentMapKey = 'dailyBase';

const current = ref<ComponentMapKey>("dailyBase"); // 控制显示哪个

const compMap = {
  dailyBase: dailyBanner,
} as const;

const handleEditorToggle = (nextState: ComponentMapKey) => {
  current.value = nextState
}

// 监听 store 中的 currentView 变化，根据类型名称切换视图
watch(() => store.currentView, (newTypeName) => {
  console.log('Current Type Name:', newTypeName);
  if (newTypeName) {
    let newView: ComponentMapKey = "dailyBase"; // 默认值
    
    if (newTypeName.includes('dailyBase')) {
      console.log('成功1024');
      newView = "dailyBase";
    }
    
    handleEditorToggle(newView);
  }
}, { immediate: true });


// vue组件生命周期：组件挂载完成后执
onMounted(() => {
    
    // 刷新背景图片
    getBackgroundUrl();
});

// vue组件生命周期：在组件实例被卸载之前调用
onBeforeUnmount(() => {
  
});
</script>
<template>
  <div class=" banner-image  banner-size">
          <component :is="compMap[current]" />  
  </div>
</template>

<style>
.banner-image{
  background-image: var(--cdn-url);  

  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
}

.banner-size{
  width: 100%;
  height: 100%;
}


</style>
