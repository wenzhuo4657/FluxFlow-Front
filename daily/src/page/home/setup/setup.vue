<script setup lang="ts">
import ButtonView from './button/button/ButtonView.vue';
import ButtonBar from './button/ButtonBar.vue';
import UserBar from './button/UserBar.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()




// 是否隐藏当前元素  true: 不隐藏  ， false： 隐藏
const sidebarOpen=defineModel('sidebarOpen')


</script>
<template>
    <div class="setup-container" v-if="sidebarOpen">
        <!-- 菜单栏分为两类
             一：实际内容： 文档预览（充当默认）、配置、文档类型列表、
             二: 用户信息： 展示用户信息、登出按钮
              -->

        <div class="main-content">
            <!-- 这里放置主内容：文档预览、文档类型列表、配置等 -->
             <!-- <ButtonBar></ButtonBar> -->
            <!--  1， 预览组件，默认路由选项 -->
             <div class="sidebar-item" >
                预览
             </div>

             <!-- 2,配置组件 -->
             <div class="sidebar-item">
                配置
             </div>
             <!-- 3， 文档类型组件，展示文档类型 -->
             <div  class="viewType-banner">
                <ButtonView></ButtonView>
             </div>

        </div>
        <UserBar  class="bottom"></UserBar>
    </div>

</template>
<style>

/**
布局解释： 

  ┌─────────────────────────────┐
  │   .setup-container          │  height: 100%
  │   (flex 容器，column 方向)   │
  │  ┌───────────────────────┐  │
  │  │                       │  │
  │  │  .main-content        │  │  flex: 1
  │  │  (弹性扩展，填充空间)   │  │  ← 占据所有剩余空间！
  │  │                       │  │
  │  └───────────────────────┘  │
  │  ┌───────────────────────┐  │
  │  │  SystemButtonBar      │  │  自然内容高度
  │  │  (固定在底部)          │  │  ← 被"推"到底部！
  │  └───────────────────────┘  │


 */
.setup-container {
    height: 100%;  /*  高度100% ，绝对不允许溢出！*/
    width: 100%;
    display: flex;
    flex-direction: column;
 
}

.main-content {
    height: 70%;
    background-color: rgb(248, 243, 243);
    display: flex;
    flex-direction: column;
}

.sidebar-item{
    height: 10%;
    width: 100%;
    padding-top: 2%;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);    /* 阴影*/

}

.viewType-banner{
    height: 70%;
}


.bottom {
    height: 30%;
    width: 100%;
}


</style>