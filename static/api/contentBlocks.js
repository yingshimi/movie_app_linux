import request from '@/static/api/requests.js'

/**
 * 获取文章的所有内容块
 * @param {number} articleId - 文章ID
 * @returns {Promise} - 请求Promise对象
 */
export function getContentBlocks(articleId) {
  return request({
    url: `api/articles/${articleId}/`,
    method: 'GET'
  })
}

/**
 * 获取特定内容块
 * @param {number} id - 内容块ID
 * @returns {Promise} - 请求Promise对象
 */
export function getContentBlock(id) {
  // 由于没有专门的内容块端点，我们可能需要获取整篇文章然后过滤出特定内容块
  // 这里假设文章API返回的数据中包含content_blocks数组
  return request({
    url: `api/articles/${id}/`,
    method: 'GET'
  }).then(response => {
    // 从文章数据中找到对应的内容块
    // 注意：这里的实现可能需要根据实际API响应结构调整
    const contentBlock = response.data.content.find(block => block.id === id);
    return { data: contentBlock, statusCode: response.statusCode };
  });
}

/**
 * 创建新内容块
 * @param {Object} data - 内容块数据
 * @returns {Promise} - 请求Promise对象
 */
export function createContentBlock(data) {
  return request({
    url: `api/articles/${data.article}/`,
    method: 'PATCH',
    data: {
      content_blocks: [data]
    }
  })
}

/**
 * 更新现有内容块
 * @param {number} id - 内容块ID
 * @param {Object} data - 更新的内容块数据
 * @returns {Promise} - 请求Promise对象
 */
export function updateContentBlock(id, data) {
  const articleId = data.article;
  
  // 获取当前文章内容
  return request({
    url: `api/articles/${articleId}/`,
    method: 'GET'
  }).then(response => {
    const article = response.data;
    const content = article.content || [];
    
    // 更新或添加内容块
    let updated = false;
    for (let i = 0; i < content.length; i++) {
      if (content[i].id === id) {
        content[i] = { ...content[i], ...data };
        updated = true;
        break;
      }
    }
    
    if (!updated) {
      content.push(data);
    }
    
    // 更新文章内容
    return request({
      url: `api/articles/${articleId}/`,
      method: 'PATCH',
      data: { content }
    });
  });
}

/**
 * 删除内容块
 * @param {number} id - 要删除的内容块ID
 * @param {number} articleId - 文章ID
 * @returns {Promise} - 请求Promise对象
 */
export function deleteContentBlock(id, articleId) {
  return request({
    url: `api/articles/${articleId}/`,
    method: 'PATCH',
    data: {
      delete_content_blocks: [id]
    }
  })
}

/**
 * 重新排序内容块
 * @param {number} articleId - 文章ID
 * @param {Array} orderData - 包含{id, order}对象的数组
 * @returns {Promise} - 请求Promise对象
 */
export function reorderContentBlocks(articleId, orderData) {
  return request({
    url: `api/articles/${articleId}/`,
    method: 'PATCH',
    data: {
      reorder_content_blocks: orderData
    }
  })
}

/**
 * 为图片内容块上传图片
 * @param {number} articleId - 文章ID
 * @param {FormData} formData - 包含图片文件的表单数据
 * @returns {Promise} - 请求Promise对象
 */
export function uploadContentImage(articleId, formData) {
  return request({
    url: `api/articles/${articleId}/`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
} 