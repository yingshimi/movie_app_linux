# 上传模块API文档

基础URL: `/api/upload/`

## 图片上传接口

**接口**：`/api/upload/`

**方法**：`POST`

**描述**：上传图片到服务器

**请求头**：

```
Content-Type: multipart/form-data
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| image | File | 是 | 图片文件(JPG/PNG/GIF/WebP格式，大小<10MB) |

**成功响应**：

```json
{
  "status": "success",
  "message": "图片上传成功",
  "data": {
    "id": 1,
    "image": "上传图片的URL",
    "upload_time": "2023-01-01T00:00:00Z"
  }
}
```

**失败响应**：

```json
{
  "status": "error",
  "message": "图片大小不能超过10MB"
}
```

或

```json
{
  "status": "error",
  "message": "只支持JPG、PNG、GIF和WebP格式的图片"
}
```

**方法**：`GET`

**描述**：获取所有已上传的图片列表

**成功响应**：

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "image": "图片的URL",
      "upload_time": "2023-01-01T00:00:00Z"
    },
    // ...更多图片
  ]
}
```

## 海报上传接口

**接口**：`/api/upload/poster/`

**方法**：`POST`

**描述**：上传电影海报图片

**请求头**：

```
Content-Type: multipart/form-data
```

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| name | File | 是 | 海报图片文件(JPG/PNG/GIF/WebP格式，大小<10MB) |
| m_id | String | 是 | 电影ID |
| title | String | 是 | 海报标题 |
| tag | String | 否 | 海报标签，默认为"default" |

**成功响应**：

```json
{
  "status": "success",
  "message": "海报上传成功",
  "data": {
    "id": 1,
    "name": "海报图片URL",
    "m_id": "123456",
    "title": "海报标题",
    "tag": "default",
    "uploaded_at": "2023-01-01T00:00:00Z"
  }
}
```

**失败响应**：

```json
{
  "status": "error",
  "message": "请上传海报图片"
}
```

或

```json
{
  "status": "error",
  "message": "请提供电影ID"
}
```

或

```json
{
  "status": "error",
  "message": "请提供海报标题"
}
```

或

```json
{
  "status": "error",
  "message": "海报大小不能超过10MB"
}
```

或

```json
{
  "status": "error",
  "message": "只支持JPG、PNG、GIF和WebP格式的图片"
}
```

**方法**：`GET`

**描述**：获取所有已上传的海报列表

**成功响应**：

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "海报图片URL",
      "m_id": "123456",
      "title": "海报标题",
      "tag": "default",
      "uploaded_at": "2023-01-01T00:00:00Z"
    },
    // ...更多海报
  ]
}
``` 