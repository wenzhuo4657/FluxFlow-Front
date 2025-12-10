import { createI18n } from 'vue-i18n'
import { LocalStorage } from '@/constants/storage'

const messages = {
  en: {
    title: 'record',
    hello: 'Hello',
    switch: 'Switch to Chinese',
    view:'view select',
    export:'export',
    import:'import',
    todo:'待办',
    finishs:'已完成',
    logout: "sign out",
    addItem: "add item",
    editItem: "edit item",
    deleteItem: "delete item",
    saveItem: "save item"
    
  },
  zh: {
    title: '记录',
    hello: '你好',
    switch: '切换到英文',
    view:'视图选择',
    export:'导出',
    import:'导入',
    todo:'todo',
    finishs:'finishs',
    logout: "登出",
    addItem: "添加项",
    editItem: "编辑",
    deleteItem: "删除",
    saveItem: "保存"
    
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
