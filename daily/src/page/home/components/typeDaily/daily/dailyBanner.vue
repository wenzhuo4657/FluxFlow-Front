<script setup lang="ts">
import { SessionStorage } from '@/constants/storage';

// 接收来自缓存的用户选择， 

const saved = String(sessionStorage.getItem(SessionStorage.VIEW_DOCS_ID))



</script>

<template>
  {{ saved }}
 
</template>

<style scoped>









</style>
