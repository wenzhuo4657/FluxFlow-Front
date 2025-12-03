# DailyWeb API 接口文档

## 项目概述

DailyWeb 是一个基于 Spring Boot 的日报系统后端 API，提供用户认证、内容类型管理、日记条目操作等功能。

### 技术栈
- **框架**: Spring Boot 3.4.5
- **认证**: Sa-Token + GitHub OAuth
- **数据库**: SQLite + MyBatis
- **验证**: Jakarta Validation

### 基础信息
- **Base URL**: `http://localhost:8080` (开发环境)
- **API 前缀**: `/api`
- **认证方式**: Sa-Token Bearer Token
- **请求格式**: JSON
- **响应格式**: JSON

### 通用响应格式

**成功响应:**
```json
{
  "success": true,
  "data": {
    // 响应数据
  }
}
```

**错误响应:**
```json
{
  "success": false,
  "message": "错误信息"
}
```

### 认证说明

除登录相关接口外，所有 API 都需要在请求头中携带认证 Token：

```
Authorization: Bearer <token>
```

Token 来自 GitHub OAuth 登录成功后返回。

---

## 1. 认证接口 (AuthController)

### 基础路径: `/api/oauth`

#### 1.1 GitHub OAuth 登录重定向

重定向用户到 GitHub 授权页面。

**请求方式**: `GET`

**接口路径**: `/api/oauth/render/github`

**请求参数**: 无

**响应说明**: 直接重定向到 GitHub 授权页面

**示例**:
```
GET /api/oauth/render/github
```

---

#### 1.2 GitHub OAuth 回调处理

处理 GitHub 授权回调，登录成功后会重定向到前端。

**请求方式**: `GET`

**接口路径**: `/api/oauth/callback/github`

**请求参数**: GitHub OAuth 自动传递 (state, code)

**响应说明**: 登录成功后重定向到前端页面，携带 token 和用户信息
```
{frontend_url}/auth/callback?token={token}&userInfo={userInfo}
```

其中 `userInfo` 为 URL 编码后的 JSON 字符串，格式如下：
```json
{
  "id": "123456789",
  "username": "github_user",
  "avatar": "https://github.com/avatar.png"
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|-----|------|------|
| id | String | 用户ID（字符串类型，避免精度损失） |
| username | String | 用户名 |
| avatar | String | 头像URL |

**示例**:
```
GET /api/oauth/callback/github?code=xxx&state=yyy
```

---

#### 1.3 用户登出

登出当前用户，使 Token 失效。

**请求方式**: `POST`

**接口路径**: `/api/oauth/logout`

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**: 无

**响应格式**:
```json
true  // 登出成功
false // 登出失败
```

**示例**:
```bash
curl -X POST /api/oauth/logout \
  -H "Authorization: Bearer your_token_here"
```

---

## 2. 类型接口 (TypeController)

### 基础路径: `/api/types`

#### 2.1 获取所有类型列表

获取当前用户的所有内容类型。

**请求方式**: `GET`

**接口路径**: `/api/types/getAllTypes`

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**: 无

**响应格式**:
```json
[
  {
    "id": "1",
    "name": "工作"
  },
  {
    "id": "2",
    "name": "学习"
  }
]
```

**字段说明**:
| 字段 | 类型 | 说明 |
|-----|------|------|
| id | String | 类型ID（字符串类型，避免精度损失） |
| name | String | 类型名称 |

**示例**:
```bash
curl -X GET /api/types/getAllTypes \
  -H "Authorization: Bearer your_token_here"
```

---

#### 2.2 根据类型获取文档列表

获取指定类型下的所有文档列表。

**请求方式**: `POST`

**接口路径**: `/api/types/getContentIdsByTypes`

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体 (Request Body)**:
```json
{
  "id": "1"
}
```

**字段说明**:
| 字段 | 类型 | 是否必填 | 说明 |
|-----|------|---------|------|
| id | String | 是 | 类型ID（使用字符串传输） |

**响应格式**:
```json
[
  {
    "id": "101",
    "name": "2024年1月日报"
  },
  {
    "id": "102",
    "name": "2024年2月日报"
  }
]
```

**字段说明**:
| 字段 | 类型 | 说明 |
|-----|------|------|
| id | String | 文档ID（字符串类型，避免精度损失） |
| name | String | 文档名称 |

**示例**:
```bash
curl -X POST /api/types/getContentIdsByTypes \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"id": "1"}'
```

---

## 3. 项目条目接口 (ItemController)

### 基础路径: `/api/item`

#### 3.1 获取日记条目

根据文档ID和类型获取该文档下的所有条目。

**请求方式**: `POST`

**接口路径**: `/api/item/get`

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体 (Request Body)**:
```json
{
  "docsId": "101",
  "type": 1
}
```

**字段说明**:
| 字段 | 类型 | 是否必填 | 说明 |
|-----|------|---------|------|
| docsId | String | 是 | 文档ID（使用字符串传输） |
| type | Integer | 是 | 条目类型 |

**响应格式**:
```json
{
  "success": true,
  "data": [
    {
      "index": "1001",
      "content": "今日完成的任务...",
      "title": "标题",
      "expand": "扩展信息"
    }
  ]
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|-----|------|------|
| index | String | 条目ID（字符串类型，避免精度损失） |
| content | String | 条目内容 |
| title | String | 条目标题 |
| expand | String | 扩展信息（根据类型动态变化） |

**示例**:
```bash
curl -X POST /api/item/get \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"docsId": "101", "type": 1}'
```

---

#### 3.2 新增日记条目

向指定文档添加新的条目。

**请求方式**: `POST`

**接口路径**: `/api/item/insert`

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体 (Request Body)**:
```json
{
  "docsId": "101",
  "type": 1
}
```

**字段说明**:
| 字段 | 类型 | 是否必填 | 说明 |
|-----|------|---------|------|
| docsId | String | 是 | 文档ID（使用字符串传输） |
| type | Integer | 是 | 条目类型 |

**响应格式**:
```json
{
  "success": true  // 操作是否成功
}
```

**示例**:
```bash
curl -X POST /api/item/insert \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"docsId": "101", "type": 1}'
```

---

#### 3.3 更新日记条目

更新指定条目的内容。

**请求方式**: `POST`

**接口路径**: `/api/item/update`

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体 (Request Body)**:
```json
{
  "index": "1001",
  "content": "更新后的内容..."
}
```

**字段说明**:
| 字段 | 类型 | 是否必填 | 说明 |
|-----|------|---------|------|
| index | String | 是 | 条目ID（使用字符串传输） |
| content | String | 是 | 条目新内容 |

**响应格式**:
```json
{
  "success": true  // 操作是否成功
}
```

**示例**:
```bash
curl -X POST /api/item/update \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"index": "1001", "content": "更新后的内容..."}'
```

---

#### 3.4 更新检查清单标题

更新检查清单类型的条目标题。

**请求方式**: `POST`

**接口路径**: `/api/item/field/checklist/title`

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体 (Request Body)**:
```json
{
  "index": "1002",
  "title": "新的检查清单标题"
}
```

**字段说明**:
| 字段 | 类型 | 是否必填 | 说明 |
|-----|------|---------|------|
| index | String | 是 | 条目ID（使用字符串传输） |
| title | String | 是 | 检查清单标题 |

**响应格式**:
```json
{
  "success": true  // 操作是否成功
}
```

**示例**:
```bash
curl -X POST /api/item/field/checklist/title \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"index": "1002", "title": "新的检查清单标题"}'
```

---

#### 3.5 完成检查清单

标记检查清单项为已完成状态。

**请求方式**: `POST`

**接口路径**: `/api/item/field/checklist/finish`

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体 (Request Body)**:
```json
{
  "id": "1002"
}
```

**字段说明**:
| 字段 | 类型 | 是否必填 | 说明 |
|-----|------|---------|------|
| id | String | 是 | 检查清单项ID（使用字符串传输） |

**响应格式**:
```json
{
  "success": true  // 操作是否成功
}
```

**示例**:
```bash
curl -X POST /api/item/field/checklist/finish \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"id": "1002"}'
```

---

## 错误代码说明

| HTTP状态码 | 说明 |
|-----------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token无效或缺失） |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 认证流程

1. **GitHub OAuth 登录**:
   - 访问 `/api/oauth/render/github` 重定向到 GitHub
   - 用户授权后，GitHub 回调到 `/api/oauth/callback/github`
   - 系统创建用户并返回 Token
   - 前端接收 Token 和用户信息

2. **使用 Token**:
   - 将 Token 放在请求头 `Authorization: Bearer <token>`
   - Token 有效期 30 天

3. **登出**:
   - 调用 `/api/oauth/logout` 使 Token 失效

---

## 注意事项

1. **所有 ID 类型参数和返回值**都使用 **String 类型**传输/返回
   - **输入参数**: 前端以 String 形式传递，如 `"docsId": "101"`
   - **返回值**: 后端返回 String 类型，如 `"id": "101"`
   - **内部转换**: Controller 层自动完成 String → Long 转换，服务层自动完成 Long → String 转换
   - **避免精度损失**: JavaScript 的 Number 类型最大安全整数为 `2^53 - 1`，使用 String 可避免大 ID 精度丢失

2. **所有 POST/PUT 请求**都需要在请求头设置 `Content-Type: application/json`

3. 除登录接口外，所有接口都需要在请求头携带认证 Token

4. **前端处理**:
   - 接收到 ID 后保持 String 类型使用：`item.id`
   - 如果需要作为数字使用，请使用 `parseInt(id, 10)` 转换为数字
   - OAuth 回调时需要 URL 解码：`decodeURIComponent(userInfo)`

5. **类型转换规则**:
   ```javascript
   // 后端转换流程
   前端请求: "docsId": "101"
         ↓
   Controller: Long docsId = Long.valueOf(request.getDocsId())
         ↓
   Service: 业务处理
         ↓
   Controller: response.setId(dto.getId().toString())
         ↓
   前端接收: { "id": "101" }
   ```

6. 生产环境需要配置 GitHub OAuth 应用和 Gmail SMTP

7. 数据库使用 SQLite，默认路径：`~/daily/beifen/beifen.db`

### 前端示例

**参数传递**:
```javascript
// ✅ 正确：使用字符串
const response = await fetch('/api/item/insert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    docsId: "101",  // 字符串
    type: 1
  })
});
```

**响应处理**:
```javascript
const result = await response.json();
result.data.forEach(item => {
  // ✅ item.index 是字符串
  console.log('ID:', item.index);

  // 需要转换为数字时
  const numericId = parseInt(item.index, 10);
  console.log('Numeric ID:', numericId);
});
```

**OAuth 回调处理**:
```javascript
// 从 URL 中获取参数
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const userInfoEncoded = urlParams.get('userInfo');

// 解码用户信息
const userInfoStr = decodeURIComponent(userInfoEncoded);
const userInfo = JSON.parse(userInfoStr);

console.log('Token:', token);
console.log('User ID:', userInfo.id);  // "123456789" - 字符串
console.log('Username:', userInfo.username);
console.log('Avatar:', userInfoAvatar);

// 如果需要将ID转为数字
const numericUserId = parseInt(userInfo.id, 10);  // 123456789 - 数字
```

---

## 开发环境配置

### 必需环境变量:
```bash
export GITHUB_CLIENT_ID=your_github_client_id
export GITHUB_CLIENT_SECRET=your_github_client_secret
export GMAIL_PASSWORD=your_16_digit_app_password
export domain=http://localhost:8080  # 开发环境
```

### 启动应用:
```bash
cd dailyWeb
mvn spring-boot:run
```

---

## 更新日志

### v2.1.0 (2025-12-03)
- **完善返回类型转换**: 响应层增加包装类，完全避免 Long 类型暴露给前端
- **新增响应包装类**:
  - TypeResponse: 替代 TypeDto 返回类型列表
  - DocsResponse: 替代 DocsDto 返回文档列表
  - UserResponse: 替代 UserDto 在 OAuth 回调中返回用户信息
- **Controller 优化**: 所有 Controller 层自动完成 DTO 到 Response 的转换
- **响应格式标准化**: 统一所有接口返回值的 ID 字段为 String 类型
- **OAuth 回调增强**: userInfo 字段明确格式文档，包含完整的字段说明
- **前端示例补充**: 添加 OAuth 回调处理示例和 URL 解码方法
- **类型转换说明**: 详细说明前后端类型转换流程和避免精度损失的原因

### v2.1.0 变更详情

**接口变化**:
- `/api/types/getAllTypes`: 返回 `List<TypeResponse>` 而非 `List<TypeDto>`
- `/api/types/getContentIdsByTypes`: 返回 `List<DocsResponse>` 而非 `List<DocsDto>`
- `/api/oauth/callback/github`: userInfo 为 `UserResponse` 格式（id 为 String）

**响应示例**:
```json
// GET /api/types/getAllTypes
[
  { "id": "1", "name": "工作" },
  { "id": "2", "name": "学习" }
]

// GET /api/oauth/callback/github (userInfo)
{ "id": "123456789", "username": "user", "avatar": "..." }
```

### v2.0.0 (2025-12-03)
- **重大更新**: 统一所有 HTTP 接口的输入参数和返回值为 String 类型
- **输入参数**: 所有 ID 参数（docsId, index, id 等）改为 String 类型传输
- **返回值**: 所有返回的 ID 字段（TypeDto.id, DocsDto.id, ItemDto.index, UserDto.id）改为 String 类型
- **前端兼容**: 添加前端处理示例和注意事项
- **类型转换**: 在 Controller 层实现 String -> Long 转换，在服务层实现 Long -> String 转换

### v1.0.0 (2025-12-03)
- 统一所有接口参数为 String 类型传输（仅输入参数）
- 新增所有接口的 DTO 类进行参数验证
- 完成认证、类型、条目三大模块 API 文档
