# Storage 常量使用指南

## 概述

本项目统一管理所有 `localStorage` 和 `sessionStorage` 的键名，通过常量定义避免魔法字符串，提高代码可维护性。

## 文件位置

`src/constants/storage.ts`

## 使用方法

### 1. 导入常量

```typescript
import { SessionStorage, LocalStorage } from '@/constants/storage';
```

### 2. Session Storage（会话存储）

用于存储会话期间的数据，页面关闭后清除：

```typescript
// 保存数据
sessionStorage.setItem(SessionStorage.VIEW_TYPE_ID, '123')

// 读取数据
const typeId = sessionStorage.getItem(SessionStorage.VIEW_TYPE_ID)

// 删除数据
sessionStorage.removeItem(SessionStorage.VIEW_TYPE_ID)
```

### 3. Local Storage（本地存储）

用于持久化存储，页面关闭后依然保留：

```typescript
// 保存数据
localStorage.setItem(LocalStorage.TOKEN, 'your-token')

// 读取数据
const token = localStorage.getItem(LocalStorage.TOKEN)

// 删除数据
localStorage.removeItem(LocalStorage.TOKEN)
```

## 可用常量

### SessionStorage

| 常量名 | 值 | 用途 |
|--------|----|----|
| `VIEW_CURRENT` | `'view.current'` | 当前选择的视图类型 |
| `VIEW_TYPE_ID` | `'view.typeId'` | 当前选择的类型ID |
| `VIEW_CONTENT_NAME_ID` | `'view.contentNameId'` | 当前选择的内容名称ID |
| `VIEW_DOCS_ID` | `'view.docsId'` | 当前选择的文档ID |

### LocalStorage

| 常量名 | 值 | 用途 |
|--------|----|----|
| `TOKEN` | `'token'` | 用户认证令牌 |
| `USER_INFO` | `'userInfo'` | 用户信息（JSON字符串） |
| `LOCALE` | `'locale'` | 国际化语言设置 |

## 示例

### 场景1：保存用户选择

```typescript
import { SessionStorage } from '@/constants/storage';

// 保存当前选择的类型
function saveTypeId(typeId: number) {
  sessionStorage.setItem(SessionStorage.VIEW_TYPE_ID, String(typeId))
}

// 恢复之前的选择
function restoreTypeId(): number {
  const saved = sessionStorage.getItem(SessionStorage.VIEW_TYPE_ID)
  return saved ? Number(saved) : 0
}
```

### 场景2：认证相关

```typescript
import { LocalStorage } from '@/constants/storage';

// 设置令牌
function setToken(token: string) {
  localStorage.setItem(LocalStorage.TOKEN, token)
}

// 获取令牌
function getToken(): string {
  return localStorage.getItem(LocalStorage.TOKEN) || ''
}

// 清除令牌
function clearToken() {
  localStorage.removeItem(LocalStorage.TOKEN)
}
```

## 优势

1. **避免魔法字符串**：所有键名都有明确的常量定义
2. **易于维护**：需要修改键名时只需修改一个地方
3. **类型安全**：提供 TypeScript 类型支持
4. **统一管理**：集中管理所有存储键名
5. **代码提示**：IDE 提供完整的代码补全

## 注意事项

1. 所有存储的键名都是字符串类型
2. `sessionStorage` 在浏览器会话结束后会自动清除
3. `localStorage` 会持久化保存在浏览器中
4. 存储前请确保数据格式正确（如数字需要转换为字符串）
5. 读取后需要进行类型转换和有效性验证
