# 片单模块API文档

基础URL: `/api/playlists/`

## 片单接口

### 获取片单列表

**接口**：`/api/playlists/`

**方法**：`GET`

**描述**：获取所有片单列表

**成功响应**：

```json
[
  {
    "id": 1,
    "title": "片单标题",
    "description": "片单描述",
    "cover_image": "封面图片URL",
    "badge": "影",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-02T00:00:00Z",
    "view_count": 100,
    "like_count": 50,
    "follow_count": 20,
    "is_public": true,
    "playlist_type": "mixed",
    "user": {
      "id": 1,
      "username": "username"
    }
  },
  // ...更多片单
]
```

### 获取单个片单

**接口**：`/api/playlists/{id}/`

**方法**：`GET`

**描述**：获取指定ID的片单详情

**成功响应**：

```json
{
  "id": 1,
  "title": "片单标题",
  "description": "片单描述",
  "cover_image": "封面图片URL",
  "badge": "影",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z",
  "view_count": 100,
  "like_count": 50,
  "follow_count": 20,
  "is_public": true,
  "playlist_type": "mixed",
  "user": {
    "id": 1,
    "username": "username"
  }
}
```

### 创建片单

**接口**：`/api/playlists/`

**方法**：`POST`

**描述**：创建新的片单

**请求头**：

```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| title | String | 是 | 片单标题 |
| description | String | 否 | 片单描述 |
| cover_image | File | 否 | 封面图片 |
| badge | String | 否 | 徽章文字，默认为"影" |
| is_public | Boolean | 否 | 是否公开，默认为true |
| playlist_type | String | 否 | 片单类型(mixed/tmdb/video/youtube/yinsifan)，默认为mixed |

**成功响应**：创建的片单信息，结构同上

### 更新片单

**接口**：`/api/playlists/{id}/`

**方法**：`PUT/PATCH`

**描述**：更新指定ID的片单信息

**请求头**：

```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**请求参数**：与创建接口相同，但所有字段均为可选

**成功响应**：更新后的片单信息

### 删除片单

**接口**：`/api/playlists/{id}/`

**方法**：`DELETE`

**描述**：删除指定ID的片单

**请求头**：

```
Authorization: Bearer {access_token}
```

## 片单项目接口

基础URL: `/api/playlists/items/`

### 获取片单项目列表

**接口**：`/api/playlists/items/`

**方法**：`GET`

**描述**：获取片单中的项目列表

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| playlist | Integer | 否 | 按片单ID筛选 |

**成功响应**：

```json
[
  {
    "id": 1,
    "playlist": 1,
    "content_type": "tmdb",
    "order": 1,
    "watched": false,
    "created_at": "2023-01-01T00:00:00Z",
    "content_object": {
      // TMDB电影或其他类型的内容详情
    }
  },
  // ...更多片单项目
]
```

### 获取单个片单项目

**接口**：`/api/playlists/items/{id}/`

**方法**：`GET`

**描述**：获取指定ID的片单项目详情

**成功响应**：与列表项结构相同

### 添加片单项目

**接口**：`/api/playlists/items/`

**方法**：`POST`

**描述**：向片单添加新项目

**请求头**：

```
Authorization: Bearer {access_token}
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| playlist | Integer | 是 | 片单ID |
| movie | Integer | 否* | TMDB电影ID |
| video | Integer | 否* | 视频ID |
| youtube_video | Integer | 否* | YouTube视频ID |
| yinsifan_film | Integer | 否* | 音丝范影视ID |
| content_type | String | 是 | 内容类型(tmdb/video/youtube/yinsifan) |
| order | Integer | 否 | 排序位置 |
| watched | Boolean | 否 | 是否已观看，默认为false |

**说明**：根据content_type，需要提供对应的关联ID字段

**成功响应**：创建的片单项目信息

### 更新片单项目

**接口**：`/api/playlists/items/{id}/`

**方法**：`PUT/PATCH`

**描述**：更新指定ID的片单项目

**请求头**：

```
Authorization: Bearer {access_token}
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| order | Integer | 否 | 排序位置 |
| watched | Boolean | 否 | 是否已观看 |

**成功响应**：更新后的片单项目信息

### 删除片单项目

**接口**：`/api/playlists/items/{id}/`

**方法**：`DELETE`

**描述**：从片单中删除指定项目

**请求头**：

```
Authorization: Bearer {access_token}
```

### 标记观看状态

**接口**：`/api/playlists/items/{id}/toggle_watched/`

**方法**：`POST`

**描述**：切换片单项目的观看状态

**请求头**：

```
Authorization: Bearer {access_token}
```

**成功响应**：

```json
{
  "id": 1,
  "playlist": 1,
  "watched": true,
  // ...其他项目信息
}
``` 