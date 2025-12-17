<script setup="ts">
    import { ref } from 'vue'
    import NoteWindow from '@/page/home/components/content/window.vue'
    // 便签窗口状态
const showNoteWindow = ref(true)
const noteContent = ref(`你好`)


// todo 监听noteContent变化，每五秒自动保存一次
</script>

<template>

<div>
       <!-- 便签窗口 -->

        <NoteWindow
          v-if="showNoteWindow"
          v-model:content="noteContent"
          title="Sticky note"
          @close="showNoteWindow = false"
        />
</div>

</template>
