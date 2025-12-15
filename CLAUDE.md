# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个日报程序的前端项目，使用 Vue 3 + Vite 构建，主要用于编辑和管理日报内容。项目支持富文本编辑、Markdown 渲染、多语言和用户认证等功能。

## 项目结构

```
daily/
├── src/
│   ├── page/              # 页面组件
│   │   ├── home/         # 主页面
│   │   │   ├── components/    # 组件
│   │   │   │   ├── button/    # 按钮组件
│   │   │   │   └── content/   # 内容组件
│   │   │   │   └── typeDaily/ # 日报相关组件
│   │   │   ├── layout.vue     # 布局组件
│   │   │   └── login/         # 登录组件
│   │   └── oauth/         # OAuth 认证页面
│   ├── services/          # API 服务
│   │   ├── login.ts       # 登录服务
│   │   └── request.ts     # 请求服务
│   ├── storage/           # 存储管理
│   │   └── auth.ts        # 认证存储
│   ├── lib/               # 工具库
│   │   └── http.ts        # HTTP 工具
│   ├── envBus/            # 环境变量总线
│   ├── constants/         # 常量定义
│   ├── router/            # 路由配置
│   ├── i18n.ts            # 国际化配置
│   ├── main.js            # 应用入口
│   └── App.vue            # 根组件
├── public/                # 静态资源
├── package.json           # 项目配置
└── vite.config.js         # Vite 配置
```

## 开发命令

### 安装依赖
```bash
cd daily
npm install
```

### 开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 构建生产版本（带基础路径）
```bash
npm run buildx
```

### 预览构建结果
```bash
npm run preview
```

## 技术栈

- **前端框架**: Vue 3.5.18
- **构建工具**: Vite 7.0.6
- **UI 组件库**: Element Plus 2.11.5
- **状态管理**: Pinia 3.0.3
- **路由**: Vue Router 4.6.3
- **富文本编辑**: Tiptap 3.7.1
- **Markdown**: markdown-it 14.1.0
- **HTTP 客户端**: Axios 1.12.2
- **国际化**: Vue i18n 11.1.12
- **代码高亮**: highlight.js 11.11.1

## 环境变量配置

项目需要配置以下环境变量：

```env
VITE_API_BASE=${DAILY_WEB_API_URL}      # 后端API地址，不需要配置后缀/api
VITE_BACKGROUD=${DAILY_WEB_BACKGROUND_URL}  # 背景图片的URL地址
```

## 部署说明

项目部署在 `/md-web/` 路径下，需要配置 Nginx 反向代理到后端 API。具体配置请参考 README.md 文件。

## 开发注意事项

1. 项目使用路径别名 `@` 指向 `src` 目录
2. 支持多语言，使用 Vue i18n
3. 集成了用户认证和授权系统
4. 富文本编辑器基于 Tiptap
5. 支持 Markdown 渲染和预览
6. 项目需要在 Node.js 20.19.0 或 22.12.0+ 版本上运行