import request from '@/static/api/requests.js'

/**
 * 上传图片
 * @param {File} imageFile - 图片文件(JPG/PNG/GIF/WebP格式，大小<10MB)
 * @returns {Promise} 请求Promise对象
 */
export function uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    return request({
        url: 'api/upload/',
        method: 'POST',
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 获取已上传的图片列表
 * @returns {Promise} 请求Promise对象
 */
export function getImageList() {
    return request({
        url: 'api/upload/',
        method: 'GET'
    });
}

/**
 * 上传电影海报
 * @param {Object} posterData - 海报数据
 * @param {File} posterData.name - 海报图片文件(JPG/PNG/GIF/WebP格式，大小<10MB)
 * @param {string} posterData.m_id - 电影ID
 * @param {string} posterData.title - 海报标题
 * @param {string} [posterData.tag] - 海报标签
 * @returns {Promise} 请求Promise对象
 */
export function uploadPoster(posterData) {
    const formData = new FormData();
    Object.keys(posterData).forEach(key => {
        formData.append(key, posterData[key]);
    });

    return request({
        url: 'api/upload/poster/',
        method: 'POST',
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 获取已上传的海报列表
 * @returns {Promise} 请求Promise对象
 */
export function getPosterList() {
    return request({
        url: 'api/upload/poster/',
        method: 'GET'
    });
}

/**
 * 获取已上传图片列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.page_size=20] - 每页数量
 * @param {string} [params.category] - 按分类筛选
 * @param {Array} [params.tags] - 按标签筛选
 * @returns {Promise} 请求Promise对象
 */
export function getUploadedImages(params = {}) {
  return request({
    url: 'api/upload/',
    method: 'GET',
    params
  });
}

/**
 * 获取海报列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.page_size=20] - 每页数量
 * @param {string} [params.m_id] - 按电影ID筛选
 * @param {string} [params.tag] - 按标签筛选
 * @returns {Promise} 请求Promise对象
 */
export function getPosters(params = {}) {
  return request({
    url: 'api/upload/poster/',
    method: 'GET',
    params
  });
}

/**
 * 获取指定标签的海报
 * @param {string} tag - 海报标签
 * @returns {Promise} 请求Promise对象
 */
export function getPoster(tag) {
  return request({
    url: 'api/upload/poster/',
    method: 'GET',
    data: {
      tag
    }
  });
}