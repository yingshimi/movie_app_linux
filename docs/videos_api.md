# 视频模块API文档

基础URL: `/api/videos/`

## 视频管理接口

### 获取视频列表

**接口**：`/api/videos/videos/`

**方法**：`GET`

**描述**：获取所有视频列表，支持分页、排序和筛选

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| page | Integer | 否 | 分页页码 |
| category | Integer | 否 | 按分类ID筛选 |
| status | String | 否 | 按状态筛选(draft/published/private) |
| user | Integer | 否 | 按用户ID筛选 |
| search | String | 否 | 搜索标题或描述 |
| ordering | String | 否 | 排序字段(created_at/-created_at/views/-views/likes/-likes) |

**成功响应**：

```json
{
  "count": 100,
  "next": "http://example.com/api/videos/videos/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "视频标题",
      "description": "视频描述",
      "cover_image": "视频封面URL",
      "video_file": "视频文件URL",
      "duration": 120,
      "views": 1000,
      "likes": 50,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z",
      "status": "published",
      "user": {
        "id": 1,
        "username": "username"
      },
      "category": {
        "id": 1,
        "name": "分类名称"
      }
    },
    // ...更多视频
  ]
}
```

### 获取单个视频详情

**接口**：`/api/videos/videos/{id}/`

**方法**：`GET`

**描述**：获取指定ID的视频详情

**成功响应**：

```json
{
  "id": 1,
  "title": "视频标题",
  "description": "视频描述",
  "cover_image": "视频封面URL",
  "video_file": "视频文件URL",
  "duration": 120,
  "views": 1000,
  "likes": 50,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z",
  "status": "published",
  "user": {
    "id": 1,
    "username": "username"
  },
  "category": {
    "id": 1,
    "name": "分类名称"
  }
}
```

### 上传新视频

**接口**：`/api/videos/videos/`

**方法**：`POST`

**描述**：上传新视频

**请求头**：

```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| title | String | 是 | 视频标题 |
| description | String | 否 | 视频描述 |
| cover_image | File | 是 | 视频封面图片 |
| video_file | File | 是 | 视频文件 |
| duration | Integer | 否 | 视频时长(秒) |
| status | String | 否 | 视频状态(draft/published/private)，默认为draft |
| category | Integer | 否 | 分类ID |

**成功响应**：

```json
{
  "id": 1,
  "title": "视频标题",
  "description": "视频描述",
  "cover_image": "视频封面URL",
  "video_file": "视频文件URL",
  "duration": 120,
  "views": 0,
  "likes": 0,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "status": "draft",
  "user": {
    "id": 1,
    "username": "username"
  },
  "category": {
    "id": 1,
    "name": "分类名称"
  }
}
```

### 更新视频

**接口**：`/api/videos/videos/{id}/`

**方法**：`PUT/PATCH`

**描述**：更新指定ID的视频信息

**请求头**：

```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**请求参数**：与上传接口相同，但所有字段均为可选

### 删除视频

**接口**：`/api/videos/videos/{id}/`

**方法**：`DELETE`

**描述**：删除指定ID的视频

**请求头**：

```
Authorization: Bearer {access_token}
```

### 视频点赞

**接口**：`/api/videos/videos/{id}/like/`

**方法**：`POST`

**描述**：对指定视频进行点赞

**请求头**：

```
Authorization: Bearer {access_token}
```

**成功响应**：

```json
{
  "id": 1,
  "title": "视频标题",
  "likes": 51,
  // ...其他视频信息
}
```

### 增加视频观看次数

**接口**：`/api/videos/videos/{id}/view/`

**方法**：`POST`

**描述**：增加指定视频的观看次数

**请求头**：

```
Authorization: Bearer {access_token}
```

**成功响应**：

```json
{
  "id": 1,
  "title": "视频标题",
  "views": 1001,
  // ...其他视频信息
}
```

## TMDB数据接口

### 获取TMDB影视数据列表

**接口**：`/api/videos/tmdb/`

**方法**：`GET`

**描述**：获取TMDB电影/电视剧数据列表

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| search | String | 否 | 按标题搜索 |

**成功响应**：

```json
[
  {
    "id": 1,
    "mid": "123456",
    "title": "电影标题",
    "mtitle": "原始标题",
    "basic_info": {
      "title": "电影标题",
      "original_title": "原始标题",
      "release_date": "2023-01-01",
      "poster_path": "/poster.jpg",
      "backdrop_path": "/backdrop.jpg",
      "overview": "剧情简介"
    },
    "detailed_info": {},
    "tag": {},
    "create_time": "2023-01-01T00:00:00Z"
  },
  // ...更多电影
]
```

### 获取单个TMDB影视详情

**接口**：`/api/videos/tmdb/{id}/`

**方法**：`GET`

**描述**：获取指定ID的TMDB电影/电视剧详情

**成功响应**：

```json
{
  "id": 1,
  "mid": "123456",
  "title": "电影标题",
  "mtitle": "原始标题",
  "basic_info": {
    "title": "电影标题",
    "original_title": "原始标题",
    "release_date": "2023-01-01",
    "poster_path": "/poster.jpg",
    "backdrop_path": "/backdrop.jpg",
    "overview": "剧情简介"
  },
  "detailed_info": {
    // 详细信息
  },
  "tag": {},
  "create_time": "2023-01-01T00:00:00Z"
}
```

### 获取TMDB电影详情

**接口**：`/api/videos/tmdbdata/`

**方法**：`GET`

**描述**：根据电影ID获取详情，支持从TMDB API获取和本地数据库查询

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| movie_id | String | 是 | TMDB电影ID |

**成功响应**：

```json
{
  "id": 1,
  "mid": "123456",
  "title": "电影标题",
  "mtitle": "原始标题",
  "basic_info": {},
  "detailed_info": {},
  "tag": {},
  "create_time": "2023-01-01T00:00:00Z"
}
```

### 搜索TMDB电影

**接口**：`/api/videos/tmdbsearch/`

**方法**：`GET`

**描述**：搜索TMDB电影，支持本地数据库和远程API

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| query | String | 是 | 搜索关键词 |
| year | Integer | 否 | 指定电影年份 |

**成功响应**：

```json
{
  "source": "local", // 或 "tmdb"
  "results": [
    {
      "id": 123456,
      "title": "电影标题",
      "original_title": "原始标题",
      "release_date": "2023-01-01",
      "overview": "剧情简介",
      "poster_path": "/poster.jpg"
    },
    // ...更多结果
  ]
}
```

## 影视片单接口

### 获取片单列表

**接口**：`/api/videos/playlists/`

**方法**：`GET`

**描述**：获取电影/视频片单列表

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| search | String | 否 | 按标题搜索 |
| ordering | String | 否 | 排序字段(created_at/-created_at/view_count/-view_count等) |

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
    },
    "movie_count": 5,
    "watched_count": 2
  },
  // ...更多片单
]
```

### 获取单个片单详情

**接口**：`/api/videos/playlists/{id}/`

**方法**：`GET`

**描述**：获取指定ID的片单详情

**成功响应**：详细的片单信息，格式同上

### 创建新片单

**接口**：`/api/videos/playlists/`

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

**成功响应**：新创建的片单详情

### 更新片单

**接口**：`/api/videos/playlists/{id}/`

**方法**：`PUT/PATCH`

**描述**：更新指定ID的片单信息

**请求参数**：与创建接口相同，但所有字段均为可选

### 删除片单

**接口**：`/api/videos/playlists/{id}/`

**方法**：`DELETE`

**描述**：删除指定ID的片单

### 片单点赞

**接口**：`/api/videos/playlists/{id}/like/`

**方法**：`POST`

**描述**：对指定片单进行点赞

### 关注片单

**接口**：`/api/videos/playlists/{id}/follow/`

**方法**：`POST`

**描述**：关注指定片单

## 片单项目接口

### 获取片单项目列表

**接口**：`/api/videos/playlist-items/`

**方法**：`GET`

**描述**：获取片单中的项目列表

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| playlist | Integer | 否 | 按片单ID筛选 |
| watched | Boolean | 否 | 按是否已观看筛选 |
| ordering | String | 否 | 排序字段(order/-order/created_at/-created_at) |

**成功响应**：

```json
[
  {
    "id": 1,
    "playlist": 1,
    "movie": 1,
    "video": null,
    "youtube_video": null,
    "yinsifan_film": null,
    "content_type": "tmdb",
    "order": 1,
    "watched": false,
    "created_at": "2023-01-01T00:00:00Z",
    "content_object": {
      // TMDB电影详情
    }
  },
  // ...更多项目
]
```

### 获取单个片单项目

**接口**：`/api/videos/playlist-items/{id}/`

**方法**：`GET`

**描述**：获取指定ID的片单项目详情

### 添加片单项目

**接口**：`/api/videos/playlist-items/`

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
| movie | Integer | 否 | TMDB电影ID |
| video | Integer | 否 | 视频ID |
| youtube_video | Integer | 否 | YouTube视频ID |
| yinsifan_film | Integer | 否 | 音丝范影视ID |
| content_type | String | 是 | 内容类型(tmdb/video/youtube/yinsifan) |
| order | Integer | 否 | 排序位置 |
| watched | Boolean | 否 | 是否已观看，默认为false |

**说明**：根据content_type，需要提供对应的ID字段

### 更新片单项目

**接口**：`/api/videos/playlist-items/{id}/`

**方法**：`PUT/PATCH`

**描述**：更新指定ID的片单项目

### 删除片单项目

**接口**：`/api/videos/playlist-items/{id}/`

**方法**：`DELETE`

**描述**：从片单中删除指定项目

### 标记观看状态

**接口**：`/api/videos/playlist-items/{id}/toggle_watched/`

**方法**：`POST`

**描述**：切换片单项目的观看状态

**成功响应**：

```json
{
  "id": 1,
  "watched": true,
  // ...其他项目信息
}
```

### 重新排序片单项目

**接口**：`/api/videos/playlist-items/reorder/`

**方法**：`POST`

**描述**：重新排序片单中的项目

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| items | Array | 是 | 项目ID和顺序的数组 |

**请求示例**：

```json
{
  "items": [
    {"id": 1, "order": 3},
    {"id": 2, "order": 1},
    {"id": 3, "order": 2}
  ]
}
```

## 影视预告片接口

### 获取预告片列表

**接口**：`/api/videos/trailers/`

**方法**：`GET`

**描述**：获取影视预告片列表

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| search | String | 否 | 按标题搜索 |
| ordering | String | 否 | 排序字段(up_time/-up_time/create_time/-create_time) |

### 获取单个预告片

**接口**：`/api/videos/trailers/{id}/`

**方法**：`GET`

**描述**：获取指定ID的预告片详情

## 音丝范影视接口

### 获取音丝范影视列表

**接口**：`/api/videos/yinsifan/films/`

**方法**：`GET`

**描述**：获取音丝范影视列表

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| search | String | 否 | 按名称搜索 |
| douban_id | Integer | 否 | 按豆瓣ID筛选 |
| ordering | String | 否 | 排序字段(created_at/-created_at) |

### 获取单个音丝范影视详情

**接口**：`/api/videos/yinsifan/films/{id}/`

**方法**：`GET`

**描述**：获取指定ID的音丝范影视详情

### 获取音丝范影视清晰度列表

**接口**：`/api/videos/yinsifan/definitions/`

**方法**：`GET`

**描述**：获取音丝范影视清晰度列表

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| film | Integer | 否 | 按影视ID筛选 |
| quality | String | 否 | 按清晰度筛选 |

## AList影视获取接口

### 获取AList目录内容

**接口**：`/api/videos/get_alist/`

**方法**：`POST`

**描述**：获取AList服务器上的目录内容

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| path | String | 是 | 目录路径 |
| password | String | 否 | 密码(如需) |
| page | Integer | 否 | 页码 |
| per_page | Integer | 否 | 每页数量 |
| refresh | Boolean | 否 | 是否刷新缓存 |

### 获取AList文件信息

**接口**：`/api/videos/get_file/`

**方法**：`POST`

**描述**：获取AList服务器上的文件信息及播放链接

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| path | String | 是 | 文件路径 |
| password | String | 否 | 密码(如需) |

## YouTube视频接口

### 获取YouTube视频列表

**接口**：`/api/videos/youtube/`

**方法**：`GET`

**描述**：获取当前用户的YouTube视频下载列表

**请求头**：

```
Authorization: Bearer {access_token}
```

### 获取YouTube视频信息

**接口**：`/api/videos/youtube/get_video_info/`

**方法**：`POST`

**描述**：获取YouTube视频的详细信息

**请求头**：

```
Authorization: Bearer {access_token}
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| url | String | 是 | YouTube视频链接 |

### 下载YouTube视频

**接口**：`/api/videos/youtube/{id}/download/`

**方法**：`POST`

**描述**：下载指定ID的YouTube视频

**请求头**：

```
Authorization: Bearer {access_token}
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| format_id | String | 否 | 格式ID |
| format_type | String | 否 | 格式类型(best/audio_only/with_subtitle) |

### 获取下载状态

**接口**：`/api/videos/youtube/{id}/download_status/`

**方法**：`GET`

**描述**：获取YouTube视频的下载状态

**请求头**：

```
Authorization: Bearer {access_token}
```

### 流式播放YouTube视频

**接口**：`/api/videos/youtube/{id}/stream_video/`

**方法**：`GET`

**描述**：流式播放已下载的YouTube视频

### 检查Cookie状态

**接口**：`/api/videos/youtube/check_cookie/`

**方法**：`GET`

**描述**：检查YouTube Cookie状态

**请求头**：

```
Authorization: Bearer {access_token}
```

### 上传Cookie文件

**接口**：`/api/videos/youtube/upload_cookie/`

**方法**：`POST`

**描述**：上传YouTube Cookie文件

**请求头**：

```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| cookie_file | File | 是 | Cookie文件 |

### 从浏览器导出Cookie

**接口**：`/api/videos/youtube/export_browser_cookies/`

**方法**：`POST`

**描述**：从浏览器会话导出YouTube Cookie

**请求头**：

```
Authorization: Bearer {access_token}
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| browser_type | String | 是 | 浏览器类型(chrome/firefox/edge) |
| profile | String | 否 | 浏览器配置文件名 |

## API配置信息接口

**接口**：`/api/videos/config/`

**方法**：`GET`

**描述**：获取API配置信息

**成功响应**：

```json
{
  "api_prefix": "/api",
  "tmdb_image_base_url": "https://image.tmdb.org/t/p/",
  "server_time": "2023-01-01T00:00:00Z",
  "version": "1.0.0"
}
``` 