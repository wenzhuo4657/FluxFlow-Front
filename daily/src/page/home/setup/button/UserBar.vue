<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/storage/auth'
import { storeToRefs } from 'pinia'
import Logout from './Button/Logout.vue'

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
    <div class="system-button-bar">
        <!-- 用户头像 -->
        <div class="user-avatar">
            <img :src="avatarUrl" alt="用户头像" @error="onAvatarError" />
        </div>

        <!-- 用户名 -->
        <div class="user-name" :title="displayName">
            {{ displayName }}
        </div>

        <!-- 登出按钮 -->
        <div class="logout-section">
            <Logout></Logout>
        </div>
    </div>
</template>
<style>
.system-button-bar {
    height: 20%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    margin: 0;
}

/* 用户头像 */
.user-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    overflow: hidden;
    background: #f0f0f0;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    border: 3px solid rgba(255, 255, 255, 0.85);
    flex-shrink: 0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-avatar:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* 用户名 */
.user-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a2a3a;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    line-height: 1.4;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

/* 登出按钮区域 */
.logout-section {
    width: 100%;
    display: flex;
    justify-content: center;
}

/* 确保 Element Plus 按钮可见 */
.logout-section .el-button {
    margin: 8px 0;
}
</style>
