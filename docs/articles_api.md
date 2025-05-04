# 文章模块API文档

基础URL: `/api/articles/`

## 文章分类接口

### 获取分类列表

**接口**：`/api/articles/categories/`

**方法**：`GET`

**描述**：获取所有文章分类

**成功响应**：

```json
[
  {
    "id": 1,
    "name": "分类名称",
    "description": "分类描述",
    "created_at": "2023-01-01T00:00:00Z"
  },
  // ...更多分类
]
```

### 获取单个分类

**接口**：`/api/articles/categories/{id}/`

**方法**：`GET`

**描述**：获取指定ID的分类详情

**成功响应**：

```json
{
  "id": 1,
  "name": "分类名称",
  "description": "分类描述",
  "created_at": "2023-01-01T00:00:00Z"
}
```

### 创建分类

**接口**：`/api/articles/categories/`

**方法**：`POST`

**描述**：创建新的文章分类

**请求头**：

```
Authorization: Bearer {access_token}
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| name | String | 是 | 分类名称 |
| description | String | 否 | 分类描述 |

**成功响应**：创建的分类信息

### 更新分类

**接口**：`/api/articles/categories/{id}/`

**方法**：`PUT/PATCH`

**描述**：更新指定ID的分类信息

**请求头**：

```
Authorization: Bearer {access_token}
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| name | String | 否 | 分类名称 |
| description | String | 否 | 分类描述 |

**成功响应**：更新后的分类信息

### 删除分类

**接口**：`/api/articles/categories/{id}/`

**方法**：`DELETE`

**描述**：删除指定ID的分类

**请求头**：

```
Authorization: Bearer {access_token}
```

## 文章接口

### 获取文章列表

**接口**：`/api/articles/`

**方法**：`GET`

**描述**：获取文章列表，支持分页和筛选

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| author | String | 否 | 按作者用户名筛选 |
| page | Integer | 否 | 分页页码 |

**成功响应**：

```json
{
  "count": 100,
  "next": "http://example.com/api/articles/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "文章标题",
      "slug": "article-slug",
      "content": "<p>文章HTML内容</p>",
      "cover_img": "文章封面URL",
      "author": {
        "id": 1,
        "username": "username"
      },
      "category": {
        "id": 1,
        "name": "分类名称"
      },
      "tags": [
        {
          "id": 1,
          "name": "标签1"
        }
      ],
      "publish_date": "2023-01-01T00:00:00Z",
      "updated_date": "2023-01-02T00:00:00Z",
      "read_count": 100,
      "like_count": 50,
      "comment_count": 10,
      "status": "published"
    },
    // ...更多文章
  ]
}
```

### 获取单篇文章

**接口**：`/api/articles/{id}/`

**方法**：`GET`

**描述**：获取指定ID的文章详情，同时增加阅读计数

**成功响应**：

```json
{
  "id": 1,
  "title": "文章标题",
  "slug": "article-slug",
  "content": "<p>文章HTML内容</p>",
  "cover_img": "文章封面URL",
  "author": {
    "id": 1,
    "username": "username"
  },
  "category": {
    "id": 1,
    "name": "分类名称"
  },
  "tags": [
    {
      "id": 1,
      "name": "标签1"
    }
  ],
  "publish_date": "2023-01-01T00:00:00Z",
  "updated_date": "2023-01-02T00:00:00Z",
  "read_count": 101,
  "like_count": 50,
  "comment_count": 10,
  "status": "published"
}
```

### 创建文章

**接口**：`/api/articles/`

**方法**：`POST`

**描述**：创建新文章

**请求头**：

```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| title | String | 是 | 文章标题 |
| content | String | 是 | 文章HTML内容 |
| cover_img | File | 否 | 文章封面图片(JPG/PNG/GIF/WebP) |
| category | Integer | 否 | 分类ID |
| tags | Array | 否 | 标签ID数组 |
| status | String | 否 | 文章状态(draft/published/archived)，默认为draft |

**成功响应**：

```json
{
  "id": 1,
  "title": "文章标题",
  "slug": "article-slug",
  "content": "<p>文章HTML内容</p>",
  "cover_img": "文章封面URL",
  "author": {
    "id": 1,
    "username": "username"
  },
  "category": {
    "id": 1,
    "name": "分类名称"
  },
  "tags": [
    {
      "id": 1,
      "name": "标签1"
    }
  ],
  "publish_date": "2023-01-01T00:00:00Z",
  "updated_date": "2023-01-01T00:00:00Z",
  "read_count": 0,
  "like_count": 0,
  "comment_count": 0,
  "status": "draft"
}
```

### 更新文章

**接口**：`/api/articles/{id}/`

**方法**：`PUT/PATCH`

**描述**：更新指定ID的文章

**请求头**：

```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**请求参数**：与创建接口相同，但所有字段均为可选

**成功响应**：更新后的文章信息

### 删除文章

**接口**：`/api/articles/{id}/`

**方法**：`DELETE`

**描述**：删除指定ID的文章

**请求头**：

```
Authorization: Bearer {access_token}
```

**成功响应**：

```json
{
  "detail": "文章已成功删除"
}
```

### 文章点赞

**接口**：`/api/articles/{id}/like/`

**方法**：`POST`

**描述**：对指定文章进行点赞

**请求头**：

```
Authorization: Bearer {access_token}
```

**成功响应**：

```json
{
  "id": 1,
  "title": "文章标题",
  "like_count": 51,
  // ...其他文章信息
}
``` 