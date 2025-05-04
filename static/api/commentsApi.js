import request from '@/static/api/requests.js'

/**
 * 获取评论列表
 * @param {Object} params - 查询参数
 * @param {number} [params.video_id] - 视频ID
 * @param {number} [params.article_id] - 文章ID
 * @returns {Promise} 请求Promise对象
 */
export function getCommentList(params = {}) {
    return request({
        url: 'api/comments/',
        method: 'GET',
        params
    });
}

/**
 * 获取评论详情
 * @param {number} id - 评论ID
 * @returns {Promise} 请求Promise对象
 */
export function getCommentDetail(id) {
    return request({
        url: `api/comments/${id}/`,
        method: 'GET'
    });
}

/**
 * 获取评论回复列表
 * @param {number} id - 评论ID
 * @returns {Promise} 请求Promise对象
 */
export function getCommentReplies(id) {
    return request({
        url: `api/comments/${id}/replies/`,
        method: 'GET'
    });
}

/**
 * 发布新评论
 * @param {Object} commentData - 评论数据
 * @param {string} commentData.content - 评论内容
 * @param {number} [commentData.video] - 视频ID
 * @param {number} [commentData.article] - 文章ID
 * @param {number} [commentData.parent] - 父评论ID
 * @returns {Promise} 请求Promise对象
 */
export function createComment(commentData) {
    return request({
        url: 'api/comments/',
        method: 'POST',
        data: commentData
    });
}

/**
 * 更新评论
 * @param {number} id - 评论ID
 * @param {Object} commentData - 评论数据
 * @param {string} commentData.content - 评论内容
 * @returns {Promise} 请求Promise对象
 */
export function updateComment(id, commentData) {
    return request({
        url: `api/comments/${id}/`,
        method: 'PATCH',
        data: commentData
    });
}

/**
 * 删除评论
 * @param {number} id - 评论ID
 * @returns {Promise} 请求Promise对象
 */
export function deleteComment(id) {
    return request({
        url: `api/comments/${id}/`,
        method: 'DELETE'
    });
}

/**
 * 获取视频评论
 * @param {number} videoId - 视频ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getVideoComments(videoId, params = {}) {
  return request({
    url: 'api/comments/',
    method: 'GET',
    params: {
      ...params,
      video_id: videoId
    }
  });
}

/**
 * 获取文章评论
 * @param {number} articleId - 文章ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getArticleComments(articleId, params = {}) {
  return request({
    url: 'api/comments/',
    method: 'GET',
    params: {
      ...params,
      article_id: articleId
    }
  });
}

/**
 * 发表视频评论
 * @param {number} videoId - 视频ID
 * @param {string} content - 评论内容
 * @param {number} [parentId] - 父评论ID，用于回复评论
 * @returns {Promise} 请求Promise对象
 */
export function addVideoComment(videoId, content, parentId = null) {
  const data = {
    content,
    video: videoId
  };
  
  if (parentId) {
    data.parent = parentId;
  }
  
  return createComment(data);
}

/**
 * 发表文章评论
 * @param {number} articleId - 文章ID
 * @param {string} content - 评论内容
 * @param {number} [parentId] - 父评论ID，用于回复评论
 * @returns {Promise} 请求Promise对象
 */
export function addArticleComment(articleId, content, parentId = null) {
  const data = {
    content,
    article: articleId
  };
  
  if (parentId) {
    data.parent = parentId;
  }
  
  return createComment(data);
}

/**
 * 点赞评论
 * @param {number} id - 评论ID
 * @returns {Promise} 请求Promise对象
 */
export function likeComment(id) {
  return request({
    url: `api/comments/${id}/like/`,
    method: 'POST'
  });
} 