# 用户模块API文档

基础URL: `/api/users/`

## 注册用户

**接口**：`/api/users/register/`

**方法**：`POST`

**描述**：注册新用户

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |
| email | String | 是 | 电子邮箱 |
| nickname | String | 否 | 昵称 |
| phone | String | 否 | 手机号码 |
| gender | String | 否 | 性别(male/female/other) |
| birth_date | Date | 否 | 出生日期(YYYY-MM-DD) |
| bio | String | 否 | 个人简介 |

**成功响应**：

```json
{
  "id": 1,
  "username": "username",
  "email": "user@example.com",
  "nickname": "nickname",
  "avatar": null,
  "bio": "",
  "phone": "",
  "gender": "other",
  "birth_date": null
}
```

**失败响应**：

```json
{
  "username": ["用户名已存在"],
  "email": ["该邮箱已被注册"]
}
```

## 用户登录

**接口**：`/api/users/login/`

**方法**：`POST`

**描述**：用户登录获取token

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |

**成功响应**：

```json
{
  "refresh": "刷新token字符串",
  "access": "访问token字符串",
  "user": {
    "id": 1,
    "username": "username",
    "email": "user@example.com",
    "nickname": "nickname",
    "avatar": "avatar_url",
    "bio": "",
    "phone": "",
    "gender": "other",
    "birth_date": null
  }
}
```

**失败响应**：

```json
{
  "error": "用户名或密码错误"
}
```

## Token刷新

**接口**：`/api/users/token/refresh/`

**方法**：`POST`

**描述**：刷新访问token

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| refresh | String | 是 | 刷新token |

**成功响应**：

```json
{
  "access": "新的访问token字符串"
}
```

**失败响应**：

```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

## 获取用户信息

**接口**：`/api/users/profile/`

**方法**：`GET`

**描述**：获取当前登录用户的详细信息

**请求头**：

```
Authorization: Bearer {access_token}
```

**成功响应**：

```json
{
  "id": 1,
  "username": "username",
  "email": "user@example.com",
  "nickname": "nickname",
  "avatar": "avatar_url",
  "bio": "个人简介",
  "phone": "13800138000",
  "gender": "male",
  "birth_date": "1990-01-01"
}
```

**失败响应**：

```json
{
  "detail": "Token无效或已过期"
}
```

## 修改用户信息

**接口**：`/api/users/profile/`

**方法**：`PUT/PATCH`

**描述**：更新当前登录用户的信息

**请求头**：

```
Authorization: Bearer {access_token}
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| nickname | String | 否 | 昵称 |
| bio | String | 否 | 个人简介 |
| phone | String | 否 | 手机号码 |
| gender | String | 否 | 性别(male/female/other) |
| birth_date | Date | 否 | 出生日期(YYYY-MM-DD) |

**成功响应**：

```json
{
  "id": 1,
  "username": "username",
  "email": "user@example.com",
  "nickname": "新昵称",
  "avatar": "avatar_url",
  "bio": "新个人简介",
  "phone": "13800138000",
  "gender": "male",
  "birth_date": "1990-01-01"
}
```

## 上传用户头像

**接口**：`/api/users/upload-avatar/`

**方法**：`PUT/POST`

**描述**：上传或更新用户头像

**请求头**：

```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| avatar | File | 是 | 头像图片文件(JPG/PNG/GIF/WebP,大小<2MB) |

**成功响应**：

```json
{
  "message": "头像上传成功",
  "avatar_url": "http://example.com/media/avatars/user_1.jpg"
}
```

**失败响应**：

```json
{
  "error": "头像文件大小不能超过2MB"
}
```

或

```json
{
  "error": "只支持JPG、PNG、GIF、WebP格式的图片"
}
``` 