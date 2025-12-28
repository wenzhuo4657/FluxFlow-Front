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
    saveItem: "save item",
    index:"index",
    configuration: "configuration",
    quickActions: "flow",
    // Index page
    welcome: "Welcome to Daily Notes",
    welcomeDesc: "Manage your daily records efficiently and stay organized",
    documentTypes: "Document Types",
    recentDocs: "Recent Documents",
    settings: "Settings",
    totalTypes: "Total Types",
    totalDocs: "Total Docs",
    totalItems: "Total Items",
    quickAction: "Quick Actions",
    tipTitle: "Tips",
    tipContent: "Use the quick actions above to navigate through different sections"
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
    saveItem: "保存",
    index: "首页",
    configuration: "配置",
    quickActions: "flow",
    // Index page
    welcome: "欢迎使用日报系统",
    welcomeDesc: "高效管理您的日报记录，保持井井有条",
    documentTypes: "文档类型",
    recentDocs: "最近文档",
    settings: "设置",
    totalTypes: "类型总数",
    totalDocs: "文档总数",
    totalItems: "条目总数",
    quickAction: "快速操作",
    tipTitle: "小贴士",
    tipContent: "使用上方的快速操作可以在不同视图间切换"
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
