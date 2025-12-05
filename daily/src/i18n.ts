import { createI18n } from 'vue-i18n'
import { LocalStorage } from '@/constants/storage'

const messages = {
  en: {
    title: 'Prologue and New Chapter',
    hello: 'Hello',
    switch: 'Switch to Chinese',
    edit:'edit/preview',
    view:'view select',
    export:'export',
    import:'import',
    todo:'待办',
    finishs:'已完成',
    
  },
  zh: {
    title: '序幕与新章',
    hello: '你好',
    switch: '切换到英文',
    edit:'编辑/预览',
    view:'视图选择',
    export:'导出',
    import:'导入',
    todo:'todo',
    finishs:'finishs',
    
  },
}

// 从本地存储或浏览器语言恢复
const saved = localStorage.getItem(LocalStorage.LOCALE)
const guess = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
const locale = saved || guess

export const i18n = createI18n({
  legacy: false,           // 用 Composition API
  locale,
  fallbackLocale: 'en',
  messages,
})
