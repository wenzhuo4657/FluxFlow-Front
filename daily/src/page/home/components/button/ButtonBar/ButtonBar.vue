<script setup lang="ts">
import { EventBus, Events } from '@/envBus/envBus.ts';

import { ref } from 'vue';
import ButtonView from './Button/ButtonView.vue';
import ButtonContentName from './Button/ButtonDocsId.vue';










</script>

<template>
  <div class="buttonBar">

    <!-- 以下两个按钮用于维护用户选择的文档和视图，具体来说是指storage.ts的三个变量，它们可以在会话存储空间中看到
       /** 当前选择的视图类型 (dailyBase, checklist, Plan_I, Plan_II) */
  VIEW_CURRENT: 'view.current',

  /** 当前选择的类型ID (number) */
  VIEW_TYPE_ID: 'view.typeId',

  /** 当前选择的文档ID (string) */
  VIEW_DOCS_ID: 'view.docsId',
     
    -->

    <ButtonView></ButtonView>
    <ButtonContentName></ButtonContentName>


<!-- 重构项目 -->

    <!-- TODO 懒加载 -->
     <!-- 目前的预览和编辑都不会等待md文档接口返回，这是非常致命的缺陷 -->
  </div>
</template>

<style>

.buttonBar{
     justify-items: center;
     display: flex;
     gap: 10px; 

}


</style>
