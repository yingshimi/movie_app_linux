import request from '@/static/api/requests.js'

/**
 * 获取播放列表
 * @param {Object} params - 查询参数
 * @param {number} [params.user] - 用户ID
 * @param {number} [params.page] - 页码
 * @param {number} [params.page_size] - 每页数量
 * @returns {Promise} 请求Promise对象
 */
export function getPlaylists(params = {}) {
  return request({
    url: 'api/playlists/',
    method: 'GET',
    params
  });
}

/**
 * 获取播放列表详情
 * @param {number} id - 播放列表ID
 * @returns {Promise} 请求Promise对象
 */
export function getPlaylist(id) {
  return request({
    url: `api/playlists/${id}/`,
    method: 'GET'
  });
}

/**
 * 删除播放列表
 * @param {number} id - 播放列表ID
 * @returns {Promise} 请求Promise对象
 */
export function deletePlaylist(id) {
  return request({
    url: `api/playlists/${id}/`,
    method: 'DELETE'
  });
}

/**
 * 添加视频到播放列表
 * @param {number} playlistId - 播放列表ID
 * @param {number} videoId - 视频ID
 * @returns {Promise} 请求Promise对象
 */
export function addVideoToPlaylist(playlistId, videoId) {
  return request({
    url: 'api/playlist-items/',
    method: 'POST',
    data: {
      playlist: playlistId,
      video: videoId
    }
  });
}

/**
 * 从播放列表移除视频
 * @param {number} playlistItemId - 播放列表项ID
 * @returns {Promise} 请求Promise对象
 */
export function removeVideoFromPlaylist(playlistItemId) {
  return request({
    url: `api/playlist-items/${playlistItemId}/`,
    method: 'DELETE'
  });
}

/**
 * 获取播放列表中的视频
 * @param {number} playlistId - 播放列表ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getPlaylistVideos(playlistId, params = {}) {
  return request({
    url: `api/playlists/${playlistId}/videos/`,
    method: 'GET',
    params
  });
}

/**
 * 获取用户的播放列表
 * @param {number} userId - 用户ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getUserPlaylists(userId, params = {}) {
  return request({
    url: 'api/playlists/',
    method: 'GET',
    params: {
      ...params,
      user: userId
    }
  });
}

/**
 * 获取当前用户的播放列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getMyPlaylists(params = {}) {
  return request({
    url: 'api/playlists/my/',
    method: 'GET',
    params
  });
}

/**
 * 获取片单列表
 * @returns {Promise} 请求Promise对象
 */
export function getPlaylistList() {
    return request({
        url: 'api/playlists/',
        method: 'GET'
    });
}

/**
 * 获取片单详情
 * @param {number} id - 片单ID
 * @returns {Promise} 请求Promise对象
 */
export function getPlaylistDetail(id) {
    return request({
        url: `api/playlists/${id}/`,
        method: 'GET'
    });
}

/**
 * 创建片单
 * @param {Object} playlistData - 片单数据
 * @param {string} playlistData.title - 片单标题
 * @param {string} [playlistData.description] - 片单描述
 * @param {File} [playlistData.cover_image] - 封面图片
 * @param {string} [playlistData.badge] - 徽章文字
 * @param {boolean} [playlistData.is_public] - 是否公开
 * @param {string} [playlistData.playlist_type] - 片单类型(mixed/tmdb/video/youtube/yinsifan)
 * @returns {Promise} 请求Promise对象
 */
export function createPlaylist(playlistData) {
    const formData = new FormData();
    Object.keys(playlistData).forEach(key => {
        formData.append(key, playlistData[key]);
    });

    return request({
        url: 'api/playlists/',
        method: 'POST',
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 更新片单
 * @param {number} id - 片单ID
 * @param {Object} playlistData - 片单数据
 * @param {string} [playlistData.title] - 片单标题
 * @param {string} [playlistData.description] - 片单描述
 * @param {File} [playlistData.cover_image] - 封面图片
 * @param {string} [playlistData.badge] - 徽章文字
 * @param {boolean} [playlistData.is_public] - 是否公开
 * @param {string} [playlistData.playlist_type] - 片单类型(mixed/tmdb/video/youtube/yinsifan)
 * @returns {Promise} 请求Promise对象
 */
export function updatePlaylist(id, playlistData) {
    const formData = new FormData();
    Object.keys(playlistData).forEach(key => {
        formData.append(key, playlistData[key]);
    });

    return request({
        url: `api/playlists/${id}/`,
        method: 'PATCH',
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 获取片单项目列表
 * @param {Object} params - 查询参数
 * @param {number} [params.playlist] - 片单ID
 * @returns {Promise} 请求Promise对象
 */
export function getPlaylistItemList(params = {}) {
    return request({
        url: 'api/playlists/items/',
        method: 'GET',
        params
    });
}

/**
 * 获取片单项目详情
 * @param {number} id - 片单项目ID
 * @returns {Promise} 请求Promise对象
 */
export function getPlaylistItemDetail(id) {
    return request({
        url: `api/playlists/items/${id}/`,
        method: 'GET'
    });
}

/**
 * 添加片单项目
 * @param {Object} itemData - 片单项目数据
 * @param {number} itemData.playlist - 片单ID
 * @param {number} [itemData.movie] - TMDB电影ID
 * @param {number} [itemData.video] - 视频ID
 * @returns {Promise} 请求Promise对象
 */
export function addPlaylistItem(itemData) {
    return request({
        url: 'api/playlists/items/',
        method: 'POST',
        data: itemData
    });
} 