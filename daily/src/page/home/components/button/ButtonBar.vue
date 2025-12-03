<script setup lang="ts">
import { EventBus, Events } from '@/envBus/envBus';

import { ref } from 'vue';
import ButtonView from './elButton/ButtonView.vue';
import ButtonContentName from './elButton/ButtonContentName.vue';










</script>

<template>
  <div class="buttonBar">

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
