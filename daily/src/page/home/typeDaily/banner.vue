<script setup lang="ts">
import dailyBanner from '@/page/home/typeDaily/daily/dailyBanner.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { SessionStorage } from '@/constants/storage';
import { useI18n } from 'vue-i18n'
import { getBackgroundUrl } from '@/services/request';
import { useCounterStore } from '@/storage/DocsView';
import { watch } from 'vue';

const store = useCounterStore();

// 监听 store 中的 currentTypeName 变化，根据类型名称切换视图
watch(() => store.getCurrentTypeName, (newTypeName) => {
  console.log('Current Type Name:', newTypeName);
  if (newTypeName) {
    // 根据类型名称映射到相应的ComponentMapKey
    // 这里需要根据实际业务逻辑进行映射
    // 例如，如果newTypeName包含'daily'，则切换到dailyBase视图
    let newView: ComponentMapKey = "dailyBase"; // 默认值
    
    if (newTypeName.toLowerCase().includes('plan_i')) {
      newView = "Plan_I";
    } else if (newTypeName.toLowerCase().includes('plan_ii')) {
      newView = "Plan_II";
    } else if (newTypeName.toLowerCase().includes('daily')) {
      newView = "dailyBase";
    }
    
    handleEditorToggle(newView);
  }
}, { immediate: true });

// vue组件生命周期：组件挂载完成后执
onMounted(() => {
    try {
      const saved = sessionStorage.getItem(SessionStorage.VIEW_CURRENT)
      if (saved && saved in compMap) {
        // @ts-ignore
        current.value = saved as ComponentMapKey
      } else {
        // 如果没有保存的值，确保设置默认值并触发存储
        current.value = "dailyBase";
        sessionStorage.setItem(SessionStorage.VIEW_CURRENT, "dailyBase");
      }
    } catch {}
    
    // 刷新背景图片
    getBackgroundUrl();
});

// vue组件生命周期：在组件实例被卸载之前调用
onBeforeUnmount(() => {
  
});

const handleEditorToggle = (nextState: ComponentMapKey) => {
  current.value = nextState
  try {
    sessionStorage.setItem(SessionStorage.VIEW_CURRENT, String(current.value))
  } catch {}
}

type ComponentMapKey = 'dailyBase' | 'Plan_I' | 'Plan_II';

const current = ref<ComponentMapKey>("dailyBase"); // 控制显示哪个
const compMap = {
  dailyBase: dailyBanner,
} as const;
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
