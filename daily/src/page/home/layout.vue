<script setup>
import SystemButtonBar from './components/button/SystemButtonBar/SystemButtonBar.vue';
import Home from './Home.vue';

</script>
<!-- 左右分栏布局 -->
<template>
  <!-- 左上侧是系统级别功能   导入导出  国际化语言切换  登录信息  退出登录-->
   <!-- 右侧是分为文档选择和文档编辑，   -->
    <!-- 文档选择： 文档类型和文档名称 -->
     <!-- 文档编辑， 具体的文档类型各异 -->
      <div class="floating-bar">
          <SystemButtonBar></SystemButtonBar>
      </div>
      <div class="body">
        <Home></Home>
      </div>
      
</template>

<style>

.body{
  width: 100vw;
  height: 100vh;
  background-color: rgb(244, 246, 248);
}

/* 让第一个盒子不占位：悬浮在视口左上角 */
.floating-bar{
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1000;
}
</style>
