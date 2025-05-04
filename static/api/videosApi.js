import request from '@/static/api/requests.js'

/**
 * 获取视频列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page] - 分页页码
 * @param {number} [params.category] - 分类ID
 * @param {string} [params.status] - 视频状态(draft/published/private)
 * @param {number} [params.user] - 用户ID
 * @param {string} [params.search] - 搜索关键词
 * @param {string} [params.ordering] - 排序字段(created_at/-created_at/views/-views/likes/-likes)
 * @returns {Promise} 请求Promise对象
 */
export function getVideoList(params = {}) {
    return request({
        url: 'api/videos/videos/',
        method: 'GET',
        params
    });
}

/**
 * 获取视频详情
 * @param {number} id - 视频ID
 * @returns {Promise} 请求Promise对象
 */
export function getVideoDetail(id) {
    return request({
        url: `api/videos/videos/${id}/`,
        method: 'GET'
    });
}

/**
 * 上传新视频
 * @param {Object} videoData - 视频数据
 * @param {string} videoData.title - 视频标题
 * @param {string} [videoData.description] - 视频描述
 * @param {File} videoData.cover_image - 视频封面图片
 * @param {File} videoData.video_file - 视频文件
 * @param {number} [videoData.duration] - 视频时长(秒)
 * @param {string} [videoData.status] - 视频状态(draft/published/private)
 * @param {number} [videoData.category] - 分类ID
 * @returns {Promise} 请求Promise对象
 */
export function uploadVideo(videoData) {
    const formData = new FormData();
    Object.keys(videoData).forEach(key => {
        formData.append(key, videoData[key]);
    });

    return request({
        url: 'api/videos/videos/',
        method: 'POST',
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 更新视频信息
 * @param {number} id - 视频ID
 * @param {Object} videoData - 要更新的视频数据
 * @param {string} [videoData.title] - 视频标题
 * @param {string} [videoData.description] - 视频描述
 * @param {File} [videoData.cover_image] - 视频封面图片
 * @param {File} [videoData.video_file] - 视频文件
 * @param {number} [videoData.duration] - 视频时长(秒)
 * @param {string} [videoData.status] - 视频状态(draft/published/private)
 * @param {number} [videoData.category] - 分类ID
 * @returns {Promise} 请求Promise对象
 */
export function updateVideo(id, videoData) {
    const formData = new FormData();
    Object.keys(videoData).forEach(key => {
        formData.append(key, videoData[key]);
    });

    return request({
        url: `api/videos/videos/${id}/`,
        method: 'PATCH',
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 删除视频
 * @param {number} id - 视频ID
 * @returns {Promise} 请求Promise对象
 */
export function deleteVideo(id) {
    return request({
        url: `api/videos/videos/${id}/`,
        method: 'DELETE'
    });
}

/**
 * 视频点赞
 * @param {number} id - 视频ID
 * @returns {Promise} 请求Promise对象
 */
export function likeVideo(id) {
    return request({
        url: `api/videos/videos/${id}/like/`,
        method: 'POST'
    });
}

/**
 * 获取视频观看记录
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getVideoHistory(params = {}) {
  return request({
    url: 'api/videos/history/',
    method: 'GET',
    params
  });
}

/**
 * 记录视频观看
 * @param {number} videoId - 视频ID
 * @param {Object} data - 观看数据
 * @param {number} data.duration - 观看时长(秒)
 * @param {number} data.position - 观看位置(秒)
 * @returns {Promise} 请求Promise对象
 */
export function recordVideoView(videoId, data) {
  return request({
    url: `api/videos/${videoId}/view/`,
    method: 'POST',
    data
  });
}

/**
 * 获取推荐视频
 * @param {number} videoId - 当前视频ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getRecommendedVideos(videoId, params = {}) {
  return request({
    url: `api/videos/${videoId}/recommendations/`,
    method: 'GET',
    params
  });
}

/**
 * 获取热门视频
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getHotVideos(params = {}) {
  return request({
    url: 'api/videos/hot/',
    method: 'GET',
    params
  });
}

/**
 * 按分类获取视频
 * @param {string} category - 分类名称
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getVideosByCategory(category, params = {}) {
  return request({
    url: 'api/videos/',
    method: 'GET',
    params: { 
      ...params,
      category 
    }
  });
}

/**
 * 获取用户收藏的视频
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getFavoriteVideos(params = {}) {
  return request({
    url: 'api/videos/favorites/',
    method: 'GET',
    params
  });
}

/**
 * 收藏/取消收藏视频
 * @param {number} id - 视频ID
 * @returns {Promise} 请求Promise对象
 */
export function favoriteVideo(id) {
  return request({
    url: `api/videos/${id}/favorite/`,
    method: 'POST'
  });
} 