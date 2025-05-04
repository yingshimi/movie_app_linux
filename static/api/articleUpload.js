import request from '@/static/api/requests.js'

/**
 * 上传文章封面图片
 * @param {File} imageFile - 图片文件
 * @param {Object} metadata - 图片元数据
 * @returns {Promise} 请求Promise对象
 */
export function uploadCoverImage(imageFile) {
  const formData = new FormData();
  formData.append('cover_image', imageFile);
  
  return request({
    url: 'api/uploads/',
    method: 'POST',
    data: formData,
    header: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * 上传文章内容图片
 * @param {File} imageFile - 图片文件
 * @param {Object} metadata - 图片元数据
 * @returns {Promise} 请求Promise对象
 */
export function uploadContentImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return request({
    url: 'api/uploads/',
    method: 'POST',
    data: formData,
    header: {
      'Content-Type': 'multipart/form-data'
    }
  });
}