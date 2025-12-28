# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个日报程序的前端项目，使用 Vue 3 + Vite 构建，主要用于编辑和管理日报内容。项目支持富文本编辑、Markdown 渲染、多语言和用户认证等功能。

## 项目结构

主要代码在 `daily/` 目录下：

```
daily/
├── src/
│   ├── page/              # 页面组件
│   │   ├── home/         # 主页面
│   │   │   ├── components/    # 通用组件（内容组件、按钮组件等）
│   │   │   ├── typeDaily/     # 日报相关组件
│   │   │   ├── StickyNote/    # 便签组件
│   │   │   ├── setup/         # 设置页面（包含导入导出、语言切换等）
│   │   │   ├── layout.vue     # 布局组件
│   │   │   └── login/         # 登录组件
│   │   └── oauth/         # OAuth 认证回调页面
│   ├── services/          # API 服务层
│   │   ├── login.ts       # 登录/OAuth相关API
│   │   └── request.ts     # 日报条目CRUD API
│   ├── storage/           # Pinia状态管理
│   │   └── auth.ts        # 认证状态store
│   ├── lib/               # 工具库
│   │   └── http.ts        # Axios封装，含拦截器和认证处理
│   ├── envBus/            # 环境变量总线
│   ├── constants/         # 常量定义（如localStorage keys）
│   ├── router/            # 路由配置
│   ├── i18n.ts            # 国际化配置（支持中英文）
│   ├── main.js            # 应用入口
│   └── App.vue            # 根组件
├── public/                # 静态资源
├── package.json
└── vite.config.js
```

## 开发命令

所有命令需在 `daily/` 目录下执行：

```bash
cd daily
npm install              # 安装依赖
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run buildx           # 构建生产版本（带 /md-web/ 基础路径）
npm run preview          # 预览构建结果
```

**Node.js版本要求**: 20.19.0 或 >=22.12.0

## 技术栈

- **前端框架**: Vue 3.5.18 (Composition API)
- **构建工具**: Vite 7.0.6
- **UI 组件库**: Element Plus 2.11.5
- **状态管理**: Pinia 3.0.3
- **路由**: Vue Router 4.6.3
- **富文本编辑**: Tiptap 3.7.1
- **Markdown**: markdown-it 14.1.0 + markdown-it-anchor + markdown-it-toc-done-right
- **HTTP 客户端**: Axios 1.12.2
- **国际化**: Vue i18n 11.1.12 (支持中英文)
- **代码高亮**: highlight.js 11.11.1
- **XSS防护**: DOMPurify 3.2.7

## 核心架构

### HTTP层与认证

- HTTP客户端在 `src/lib/http.ts` 中通过 `initHttp(userStore)` 初始化
- 请求拦截器自动添加 `satoken: Bearer <token>` 头
- 响应拦截器统一处理错误码（4xx/5xx）和401自动登出
- 错误提示有防重复机制（5秒内相同错误只显示一次）
- 认证token通过Pinia store (`src/storage/auth.ts`) 和localStorage双重存储

### 路由与鉴权

- 路由配置在 `src/router/index.ts`
- 使用 `meta.requiresAuth` 标记需要认证的路由
- 路由守卫自动检查token，未认证用户重定向到登录页
- 根路径 `/` 根据token状态自动重定向到 `/home` 或 `/login`

### 状态管理

- 认证状态使用Pinia store (`src/storage/auth.ts`)
- 状态自动从localStorage恢复，并在变更时同步到localStorage
- 提供 `setToken`, `setUser`, `logout` 等action

### API服务层

- 所有API调用在 `src/services/` 目录
- `request.ts`: 日报条目CRUD（getMdByType, addItemByType, updateItemByType等）
- `login.ts`: OAuth登录/登出
- 使用TypeScript接口定义请求/响应类型
- 所有API返回统一的 `ApiResponse<T>` 结构 `{ code, message, data }`

### 国际化

- 配置在 `src/i18n.ts`
- 支持中英文切换，语言偏好保存在localStorage
- 使用 `$t('key')` 或 `t('key')` (Composition API) 获取翻译文本

### 富文本编辑

- 基于Tiptap编辑器，支持Markdown语法
- 组件位置: `src/page/home/typeDaily/daily/ItemViewAndEdit.vue`
- 支持Markdown渲染和预览（`markdownView.vue`）

## 环境变量配置

```env
VITE_API_BASE=${DAILY_WEB_API_URL}      # 后端API地址（不含/api后缀）
VITE_BACKGROUD=${DAILY_WEB_BACKGROUND_URL}  # 背景图片URL
```

背景图片在应用启动时通过 `getBackgroundUrl()` API获取并设置CSS变量 `--cdn-url`。

## 部署说明

- 生产环境部署路径: `/md-web/`
- 使用 `npm run buildx` 构建带基础路径的版本
- 需要配置Nginx反向代理将 `/md-web/api/*` 转发到后端API

## Subagents（专业代理）

项目配置了自定义的 Subagents 来协助特定任务。这些代理具有专门的技能和工具集：

### 可用的 Subagents

#### 1. **code-reviewer-pro** - 代码审查专家
- **用途**: 对代码进行全面的审查，包括质量、安全性、可维护性和最佳实践
- **何时使用**:
  - 编写或修改重要代码后需要审查时
  - 提交 PR 前需要质量检查时
  - 需要发现潜在的安全漏洞或性能问题时
- **模型**: haiku（快速审查）
- **输出**: 结构化的审查报告，包含关键问题、警告和建议

#### 2. **frontend-developer** - 前端开发工程师
- **用途**: 构建健壮、高性能且可访问的 Vue/React 组件
- **何时使用**:
  - 开发新的 UI 功能或组件时
  - 重构现有前端代码时
  - 解决复杂的前端挑战（状态管理、性能优化等）
- **模型**: sonnet（平衡速度和质量）
- **专长**: Vue 3 Composition API、TypeScript、Element Plus、响应式设计

#### 3. **ui-designer** - UI 设计师
- **用途**: 创建视觉吸引力强、直观且用户友好的界面设计
- **何时使用**:
  - 设计新的用户界面或组件时
  - 改进现有 UI 的视觉设计和用户体验时
  - 需要创建设计系统或样式指南时
- **模型**: sonnet
- **专长**: 视觉设计、交互设计、设计系统、可访问性

#### 4. **typescript-pro** - TypeScript 专家
- **用途**: 架构、编写和重构可扩展、类型安全的应用程序
- **何时使用**:
  - 进行架构设计或复杂类型系统设计时
  - 重构大型代码库以提高类型安全性时
  - 需要解决复杂的 TypeScript 类型问题时
- **模型**: sonnet
- **专长**: 高级类型系统、架构设计、性能调优

### 使用 Subagents

通过 Task 工具调用这些 subagents：

```markdown
# 示例：代码审查
请使用 code-reviewer-pro 代理审查以下文件的代码质量...

# 示例：前端开发
请使用 frontend-developer 代理帮我实现一个新的日报编辑组件...

# 示例：UI 设计
请使用 ui-designer 代理为设置页面设计一个更直观的布局...

# 示例：TypeScript 架构
请使用 typescript-pro 代理帮我重构类型定义，提高类型安全性...
```

这些 subagents 会根据任务需要自动使用相应的工具和 MCP 集成来完成工作。

## 开发注意事项

1. 路径别名 `@` 指向 `src` 目录
2. 使用Composition API风格编写Vue组件
3. API响应的大数字ID字段使用string类型以避免精度损失
4. 401错误会自动清除登录状态并跳转登录页
5. 所有请求/响应使用JSON格式，文件上传除外
6. 在复杂任务中优先使用相应的 subagent 以获得更专业的结果