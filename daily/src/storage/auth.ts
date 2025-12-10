import { defineStore } from 'pinia'
import { ref, computed, Ref } from 'vue'
import { LocalStorage } from '@/constants/storage'

// 用户信息类型定义
export interface UserInfo {
  id?: string
  username?: string
  email?: string
  avatar?: string
  name?: string
  [key: string]: any
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const token: Ref<string> = ref(localStorage.getItem(LocalStorage.TOKEN) || '')
  const user: Ref<UserInfo | null> = ref(JSON.parse(localStorage.getItem(LocalStorage.USER_INFO) || 'null'))

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem(LocalStorage.TOKEN, newToken)
  }

  const setUser = (userInfo: UserInfo | null) => {
    user.value = userInfo
    localStorage.setItem(LocalStorage.USER_INFO, JSON.stringify(userInfo))
  }
  

  const logout = () => {
    token.value = ''
    user.value = null

    localStorage.removeItem(LocalStorage.TOKEN)
    localStorage.removeItem(LocalStorage.USER_INFO)
    // 可以在这里调用后端的登出接口
  }

  // 在应用启动时调用，用于恢复登录状态
  const initializeAuth = () => {
    // 状态已在 ref 初始化时从 localStorage 读取
  }

  // 返回对外暴露的属性和方法
  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    logout,
    initializeAuth
  }
})