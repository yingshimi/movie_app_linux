# 评论模块API文档

基础URL: `/api/comments/`

## 评论接口

### 获取评论列表

**接口**：`/api/comments/`

**方法**：`GET`

**描述**：获取评论列表，默认返回所有顶级评论（无父评论的评论）

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| video_id | Integer | 否 | 按视频ID筛选评论 |
| article_id | Integer | 否 | 按文章ID筛选评论 |

**说明**：video_id和article_id不能同时使用

**成功响应**：

```json
[
  {
    "id": 1,
    "content": "评论内容",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "likes": 10,
    "user": {
      "id": 1,
      "username": "username",
      "avatar": "头像URL"
    },
    "video": {
      "id": 1,
      "title": "视频标题"
    },
    "article": null,
    "parent": null,
    "replies_count": 5
  },
  // ...更多评论
]
```

### 获取单个评论详情

**接口**：`/api/comments/{id}/`

**方法**：`GET`

**描述**：获取指定ID的评论详情

**成功响应**：

```json
{
  "id": 1,
  "content": "评论内容",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "likes": 10,
  "user": {
    "id": 1,
    "username": "username",
    "avatar": "头像URL"
  },
  "video": {
    "id": 1,
    "title": "视频标题"
  },
  "article": null,
  "parent": null,
  "replies_count": 5
}
```

### 获取评论回复

**接口**：`/api/comments/{id}/replies/`

**方法**：`GET`

**描述**：获取指定评论的所有回复

**成功响应**：

```json
[
  {
    "id": 2,
    "content": "回复内容",
    "created_at": "2023-01-01T01:00:00Z",
    "updated_at": "2023-01-01T01:00:00Z",
    "likes": 5,
    "user": {
      "id": 2,
      "username": "user2",
      "avatar": "头像URL"
    },
    "video": {
      "id": 1,
      "title": "视频标题"
    },
    "article": null,
    "parent": 1
  },
  // ...更多回复
]
```

### 发布新评论

**接口**：`/api/comments/`

**方法**：`POST`

**描述**：发布新评论或回复

**请求头**：

```
Authorization: Bearer {access_token}
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| content | String | 是 | 评论内容 |
| video | Integer | 否* | 视频ID |
| article | Integer | 否* | 文章ID |
| parent | Integer | 否 | 父评论ID，用于回复其他评论 |

**说明**：
- video和article字段不能同时提供
- 至少需要提供video或article中的一个，除非是对已有评论的回复

**成功响应**：

```json
{
  "id": 3,
  "content": "新评论内容",
  "created_at": "2023-01-02T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z",
  "likes": 0,
  "user": {
    "id": 1,
    "username": "username",
    "avatar": "头像URL"
  },
  "video": {
    "id": 1,
    "title": "视频标题"
  },
  "article": null,
  "parent": null
}
```

### 更新评论

**接口**：`/api/comments/{id}/`

**方法**：`PUT/PATCH`

**描述**：更新指定ID的评论内容

**请求头**：

```
Authorization: Bearer {access_token}
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| content | String | 是 | 评论内容 |

**成功响应**：更新后的评论信息

### 删除评论

**接口**：`/api/comments/{id}/`

**方法**：`DELETE`

**描述**：删除指定ID的评论

**请求头**：

```
Authorization: Bearer {access_token}
```

**说明**：用户只能删除自己发布的评论

### 评论点赞

**接口**：`/api/comments/{id}/like/`

**方法**：`POST`

**描述**：对指定评论进行点赞

**请求头**：

```
Authorization: Bearer {access_token}
```

**成功响应**：

```json
{
  "status": "success",
  "likes": 11
}
``` 