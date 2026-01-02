import { defineStore } from 'pinia'
import { ref, computed, Ref } from 'vue'
import { LocalStorage } from '@/constants/storage'
import { logout as apiLogout } from '@/services/login'
import router from '@/router'
import { useCounterStore } from '@/storage/DocsView'

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
  

  const logout = async () => {
    try {
      // 调用后端登出接口
      await apiLogout()
    } catch (error) {
      console.error('Logout API call failed:', error)
      // 即使后端调用失败，也要清理本地状态
    }
    
    // 清理本地状态
    token.value = ''
    user.value = null

    localStorage.removeItem(LocalStorage.TOKEN)
    localStorage.removeItem(LocalStorage.USER_INFO)
    
    // 清除 DocsView 状态
    const docsViewStore = useCounterStore()
    docsViewStore.clearState()

    router.push('/')
  }



  // 返回对外暴露的属性和方法
  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    logout
  }
})