import request from '@/static/api/requests.js'

/**
 * 获取文章列表
 * @param {Object} params - 查询参数
 * @returns {Promise} - 请求Promise对象
 */
export function getArticles(params) {
  return request({
    url: 'api/articles/',
    method: 'GET',
    params
  })
}

/**
 * 获取文章详情
 * @param {number} id - 文章ID
 * @returns {Promise} - 请求Promise对象
 */
export function getArticle(id) {
  return request({
    url: `api/articles/${id}/`,
    method: 'GET'
  })
}

/**
 * 创建新文章
 * @param {File} coverImage - 文章封面图片
 * @param {Object} articleData - 文章数据
 * @param {string} articleData.title - 文章标题
 * @param {string} articleData.content - 文章内容
 * @param {string} [articleData.summary] - 文章摘要
 * @param {string} [articleData.category] - 文章分类
 * @param {Array} [articleData.tags] - 文章标签
 * @param {boolean} [articleData.is_published] - 是否发布
 * @returns {Promise} - 请求Promise对象
 */
export function createArticle(coverImage, articleData) {
  const formData = new FormData();
  
  // 添加封面图片
  if (coverImage) {
    formData.append('cover_image', coverImage);
  }
  
  // 添加文章数据
  Object.keys(articleData).forEach(key => {
    if (articleData[key] !== undefined && articleData[key] !== null) {
      if (key === 'tags' && Array.isArray(articleData[key])) {
        formData.append(key, JSON.stringify(articleData[key]));
      } else {
        formData.append(key, articleData[key]);
      }
    }
  });
  
  return request({
    url: 'api/upload/article/',
    method: 'POST',
    data: formData,
    header: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * 更新文章
 * @param {number} id - 文章ID
 * @param {FormData|Object} data - 更新的文章数据
 * @returns {Promise} - 请求Promise对象
 */
export function updateArticle(id, data) {
  const headers = {}
  
  // 如果是FormData类型，设置对应的Content-Type
  if (data instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data'
  }
  
  return request({
    url: `api/articles/${id}/`,
    method: 'PATCH',
    headers,
    data
  })
}

/**
 * 删除文章
 * @param {number} id - 要删除的文章ID
 * @returns {Promise} - 请求Promise对象
 */
export function deleteArticle(id) {
  return request({
    url: `api/articles/${id}/`,
    method: 'DELETE'
  })
}

/**
 * 文章点赞/取消点赞
 * @param {number} id - 文章ID
 * @returns {Promise} - 请求Promise对象
 */
export function likeArticle(id) {
  return request({
    url: `api/articles/${id}/like/`,
    method: 'POST'
  })
}

/**
 * 获取文章评论
 * @param {number} articleId - 文章ID
 * @param {Object} params - 查询参数
 * @returns {Promise} - 请求Promise对象
 */
export function getArticleComments(articleId, params) {
  return request({
    url: `api/articles/${articleId}/comments/`,
    method: 'GET',
    params
  })
}

/**
 * 添加文章评论
 * @param {number} articleId - 文章ID
 * @param {Object} data - 评论数据
 * @returns {Promise} - 请求Promise对象
 */
export function addArticleComment(articleId, data) {
  return request({
    url: `api/articles/${articleId}/comments/`,
    method: 'POST',
    data
  })
}

/**
 * 删除文章评论
 * @param {number} articleId - 文章ID
 * @param {number} commentId - 评论ID
 * @returns {Promise} - 请求Promise对象
 */
export function deleteArticleComment(articleId, commentId) {
  return request({
    url: `api/articles/${articleId}/comments/${commentId}/`,
    method: 'DELETE'
  })
}

/**
 * 收藏/取消收藏文章
 * @param {number} id - 文章ID
 * @returns {Promise} - 请求Promise对象
 */
export function favoriteArticle(id) {
  return request({
    url: `api/articles/${id}/favorite/`,
    method: 'POST'
  })
}

/**
 * 获取用户收藏的文章列表
 * @param {Object} params - 查询参数
 * @returns {Promise} - 请求Promise对象
 */
export function getFavoriteArticles(params) {
  return request({
    url: 'api/articles/favorites/',
    method: 'GET',
    params
  })
}

/**
 * 获取用户自己发布的文章
 * @param {Object} params - 查询参数
 * @returns {Promise} - 请求Promise对象
 */
export function getMyArticles(params) {
  return request({
    url: 'api/articles/my/',
    method: 'GET',
    params
  })
}

/**
 * 文章分享统计
 * @param {number} id - 文章ID
 * @returns {Promise} - 请求Promise对象
 */
export function shareArticle(id) {
  return request({
    url: `api/articles/${id}/share/`,
    method: 'POST'
  })
}

/**
 * 获取热门文章
 * @param {Object} params - 查询参数
 * @returns {Promise} - 请求Promise对象
 */
export function getHotArticles(params) {
  return request({
    url: 'api/articles/hot/',
    method: 'GET',
    params
  })
}

/**
 * 获取推荐文章
 * @param {Object} params - 查询参数
 * @returns {Promise} - 请求Promise对象
 */
export function getRecommendedArticles(params) {
  return request({
    url: 'api/articles/recommended/',
    method: 'GET',
    params
  })
}

/**
 * 举报文章
 * @param {number} id - 文章ID
 * @param {Object} data - 举报原因等数据
 * @returns {Promise} - 请求Promise对象
 */
export function reportArticle(id, data) {
  return request({
    url: `api/articles/${id}/report/`,
    method: 'POST',
    data
  })
}

/**
 * 按标签获取文章
 * @param {string} tag - 标签名称
 * @param {Object} params - 查询参数
 * @returns {Promise} - 请求Promise对象
 */
export function getArticlesByTag(tag, params) {
  return request({
    url: `api/articles/tags/${tag}/`,
    method: 'GET',
    params
  })
}

/**
 * 获取文章标签列表
 * @returns {Promise} - 请求Promise对象
 */
export function getArticleTags() {
  return request({
    url: 'api/articles/tags/',
    method: 'GET'
  })
} 