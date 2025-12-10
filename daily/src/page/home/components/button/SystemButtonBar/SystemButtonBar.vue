<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/storage/auth'
import { storeToRefs } from 'pinia'
import Logout from './Button/Logout.vue'
import Language from './Button/Language.vue'
import DataImport from './Button/DataImport.vue'
import DataDownLoad from './Button/DataDownLoad.vue'


// 展开/收起控制
const expanded = ref(false)
const toggleExpanded = () => {
  expanded.value = !expanded.value
}

// 用户信息（从 Pinia 取出保持响应性）
const auth = useAuthStore()
const { user } = storeToRefs(auth)

const resolveName = (obj) => {
  if (!obj || typeof obj !== 'object') return ''
  const names = [
    obj.username,
    obj.name,
    obj.nickname,
    obj.nickName,
    obj.login,
    obj.user_name,
    obj.userName,
    obj.displayName,
  ]
  const found = names.find(v => typeof v === 'string' && v.trim())
  if (found) return found
  if (obj.user && typeof obj.user === 'object') return resolveName(obj.user)
  if (obj.profile && typeof obj.profile === 'object') return resolveName(obj.profile)
  return ''
}

const displayName = computed(() => {
  const val = user.value
  const name = resolveName(val)
  return name || '未登录'
})

const resolveAvatar = (obj) => {
  if (!obj || typeof obj !== 'object') return ''
  const pics = [
    obj.avatar,
    obj.avatarUrl,
    obj.avatar_url,
    obj.picture,
    obj.photo,
    obj.image,
  ]
  const found = pics.find(v => typeof v === 'string' && v.trim())
  if (found) return found
  if (obj.user && typeof obj.user === 'object') return resolveAvatar(obj.user)
  if (obj.profile && typeof obj.profile === 'object') return resolveAvatar(obj.profile)
  return ''
}

const avatarUrl = computed(() => {
  const val = user.value
  return resolveAvatar(val) || 'https://avatars.githubusercontent.com/u/117806849?v=4'
})
const onAvatarError = (e) => {
  e.target.src = 'https://avatars.githubusercontent.com/u/117806849?v=4'
}
</script>

<template>
    <!-- 按钮条：第一个为用户头像，点击可展开/收起其他选项 -->
    <div class="box">
        <!-- 顶部用户行（头像 + 用户名） -->
        <div class="user-row" role="button" tabindex="0" :aria-expanded="expanded" @click="toggleExpanded" @keydown.enter.prevent="toggleExpanded" title="点击头像展开/收起">
          <div class="avatar">
            <img :src="avatarUrl" alt="用户头像" @error="onAvatarError" />
          </div>
          <transition name="fade-slide">
            <div v-show="expanded" class="user-name-inline" :title="displayName">{{ displayName }}</div>
          </transition>
        </div>

        <!-- 其他按钮（跟随展开/收起） -->
        <transition name="expand">
          <div v-show="expanded" class="actions">
            <div class="action">
              <DataDownLoad></DataDownLoad>
            </div>
            <div class="action">
              <DataImport></DataImport>
      
            </div>
            <div class="action">
              <Language></Language>
            </div>
            <div class="action">
              <Logout></Logout>
            </div>
          </div>
        </transition>

    </div>

    
</template>
<style>
.box{
    width: 10vw;
    display: flex;
    flex-direction: column;
    border-top-right-radius: 30%;
 
}
.box  > div{ display: inline-block; }
.actions .action{ height: 5vh; }
.user-row{
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
}
.user-row:hover{ filter: brightness(0.95); }
.avatar{
    width: 5vh;
    height: 5vh;
    border-radius: 50%;
    overflow: hidden;
    background: #f0f0f0;
    box-shadow: 0 0 0 2px rgba(255,255,255,0.6) inset;
}
.avatar img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.user-name-inline{
    font-size: 12px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 进出场动效 */
.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity .2s ease, transform .2s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-2px); }

.expand-enter-active, .expand-leave-active { transition: max-height .25s ease, opacity .2s ease; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
.expand-enter-to, .expand-leave-from { max-height: 60vh; opacity: 1; }
.actions { overflow: hidden; }
</style>
